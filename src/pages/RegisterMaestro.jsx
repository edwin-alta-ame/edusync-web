import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function RegisterMaestro() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', password_confirmation: '' });
    const [maestros, setMaestros] = useState([]);
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [loading, setLoading] = useState(true);

    // Estados para Modales
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedMaestro, setSelectedMaestro] = useState({ 
        id: '', name: '', email: '', password: '', password_confirmation: '' 
    });

    const fetchMaestros = async () => {
        try {
            const res = await api.get('/maestros');
            setMaestros(res.data);
        } catch (error) {
            console.error("Error al obtener maestros", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMaestros();
    }, []);

    // --- ACCIONES ---

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: 'info', msg: 'Registrando...' });
        try {
            await api.post('/register-maestro', formData);
            setStatus({ type: 'success', msg: '¡Maestro registrado con éxito!' });
            setFormData({ name: '', email: '', password: '', password_confirmation: '' });
            fetchMaestros();
        } catch (error) {
            setStatus({ type: 'error', msg: error.response?.data?.email?.[0] || 'Error al registrar' });
        }
    };

    const openEditModal = (maestro) => {
        setSelectedMaestro({ 
            id: maestro.id, 
            name: maestro.name, 
            email: maestro.email,
            password: '', 
            password_confirmation: '' 
        });
        setShowEditModal(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const dataToUpdate = {
                name: selectedMaestro.name,
                email: selectedMaestro.email
            };

            if (selectedMaestro.password) {
                dataToUpdate.password = selectedMaestro.password;
                dataToUpdate.password_confirmation = selectedMaestro.password_confirmation;
            }

            await api.put(`/edit-maestro/${selectedMaestro.id}`, dataToUpdate);
            setShowEditModal(false);
            setStatus({ type: 'success', msg: 'Maestro actualizado' });
            fetchMaestros();
        } catch (error) {
            setStatus({ type: 'error', msg: 'Error al actualizar datos' });
        }
    };

    const openDeleteModal = (maestro) => {
        setSelectedMaestro(maestro);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            await api.delete(`/delete-maestro/${selectedMaestro.id}`);
            setShowDeleteModal(false);
            setStatus({ type: 'success', msg: 'Maestro eliminado' });
            fetchMaestros();
        } catch (error) {
            setStatus({ type: 'error', msg: 'No se pudo eliminar' });
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8">
            
            {/* Formulario de Registro */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center text-balance">Gestión de Maestros</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Nombre completo" className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
                        value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                    <input type="email" placeholder="Correo electrónico" className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
                        value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                    <input type="password" placeholder="Contraseña" className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
                        value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
                    <input type="password" placeholder="Confirmar contraseña" className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
                        value={formData.password_confirmation} onChange={e => setFormData({...formData, password_confirmation: e.target.value})} required />
                    <button className="md:col-span-2 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                        Registrar Maestro
                    </button>
                </form>
            </div>

            {/* Mensajes de Estado */}
            {status.msg && (
                <div className={`p-4 rounded-xl text-center font-bold ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                    {status.msg}
                </div>
            )}

            {/* Tabla de Maestros */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden shadow-xl">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 font-bold text-slate-500 uppercase text-xs tracking-wider">Maestro</th>
                            <th className="px-6 py-4 font-bold text-slate-500 uppercase text-xs tracking-wider">Email</th>
                            <th className="px-6 py-4 font-bold text-slate-500 uppercase text-xs tracking-wider text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr>
                                <td colSpan="3" className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center justify-center space-y-4">
                                        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                        <span className="text-slate-500 font-medium animate-pulse">Sincronizando maestros...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : maestros.length > 0 ? (
                            maestros.map(m => (
                                <tr key={m.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 text-slate-700 font-medium">{m.name}</td>
                                    <td className="px-6 py-4 text-slate-500">{m.email}</td>
                                    <td className="px-6 py-4 text-right space-x-4">
                                        <button onClick={() => openEditModal(m)} className="text-blue-600 hover:text-blue-800 font-bold transition-colors">Editar</button>
                                        <button onClick={() => openDeleteModal(m)} className="text-red-500 hover:text-red-700 font-bold transition-colors">Eliminar</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="px-6 py-12 text-center text-slate-400 italic font-light">
                                    No se encontraron maestros registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* --- MODAL DE EDICIÓN --- */}
            {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 transform transition-all animate-in zoom-in duration-200">
                        <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">Editar Perfil</h3>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <input type="text" className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nombre"
                                value={selectedMaestro.name} onChange={e => setSelectedMaestro({...selectedMaestro, name: e.target.value})} required />
                            <input type="email" className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="Email"
                                value={selectedMaestro.email} onChange={e => setSelectedMaestro({...selectedMaestro, email: e.target.value})} required />
                            
                            <div className="pt-2 border-t border-slate-100">
                                <p className="text-[10px] text-slate-400 mb-2 italic text-center">Opcional: Llena estos campos solo si deseas cambiar la contraseña</p>
                                <div className="grid grid-cols-2 gap-2">
                                    <input type="password" placeholder="Nueva Clave" className="p-3 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                        value={selectedMaestro.password || ''} onChange={e => setSelectedMaestro({...selectedMaestro, password: e.target.value})} />
                                    <input type="password" placeholder="Confirmar" className="p-3 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                        value={selectedMaestro.password_confirmation || ''} onChange={e => setSelectedMaestro({...selectedMaestro, password_confirmation: e.target.value})} />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200">Cancelar</button>
                                <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200">Actualizar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- MODAL DE ELIMINACIÓN --- */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-8 transform transition-all animate-in zoom-in duration-200">
                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 text-center mb-2 font-poppins">¿Confirmar eliminación?</h3>
                        <p className="text-slate-500 text-center text-sm mb-6 px-2">
                            Estás por eliminar a <span className="font-bold text-slate-700 italic">"{selectedMaestro.name}"</span> de forma permanente.
                        </p>
                        <div className="flex flex-col gap-2">
                            <button onClick={confirmDelete} className="w-full py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-100">
                                Eliminar Maestro
                            </button>
                            <button onClick={() => setShowDeleteModal(false)} className="w-full py-3 bg-slate-50 text-slate-500 rounded-xl font-medium hover:bg-slate-100 transition-colors">
                                Volver atrás
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}