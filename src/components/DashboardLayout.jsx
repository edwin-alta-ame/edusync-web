import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function DashboardLayout({ children }) {
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            {/* Overlay para cerrar el menú en móvil al tocar fuera */}
            {isMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
                    onClick={toggleMenu}
                />
            )}

            {/* Sidebar / Menú Lateral */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col shadow-xl transform transition-transform duration-300 ease-in-out
                lg:relative lg:translate-x-0
                ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                    <h2 className="text-2xl font-black text-blue-400 tracking-tighter">EduSync</h2>
                    <button onClick={toggleMenu} className="lg:hidden text-slate-400">
                        ✕
                    </button>
                </div>
                
                <nav className="flex-1 p-4 space-y-2">
                    {/* Enlace al Inicio */}
                    <Link 
                        to="/dashboard" 
                        className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors font-medium flex items-center gap-3 block"
                    >
                        <span>📊</span> Inicio
                    </Link>

                    {/* Enlace Condicional para Admin */}
                    {user?.role === 'admin' && (
                        <Link 
                            to="/dashboard/registrar" 
                            className="w-full text-left px-4 py-3 rounded-xl bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 transition-colors font-bold flex items-center gap-3 border border-blue-600/20 block"
                        >
                            <span>👤</span> Registrar Maestro
                        </Link>
                    )}

                    <Link 
                        to="/dashboard/subir" 
                        className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors font-medium flex items-center gap-3 block"
                    >
                        <span>📝</span> Subir Examen
                    </Link>
    
                    <Link 
                        to="/dashboard/historial" 
                        className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors font-medium flex items-center gap-3 block"
                    >
                        <span>📚</span> Historial
                    </Link>
                </nav>

                <div className="p-4 bg-slate-950">
                    <div className="flex items-center space-x-3 mb-4 px-2">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold flex-shrink-0">
                            {user?.name?.charAt(0)}
                        </div>
                        <p className="text-sm font-medium truncate">{user?.name}</p>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="w-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white py-2 rounded-lg text-sm font-bold transition-all"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Contenido Principal */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="bg-white shadow-sm p-4 px-6 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        {/* Botón Hamburguesa */}
                        <button onClick={toggleMenu} className="lg:hidden text-slate-600 text-2xl">
                            ☰
                        </button>
                        <h1 className="text-slate-500 font-medium hidden sm:block">Panel de Control</h1>
                    </div>
                    <span className="text-[10px] sm:text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold uppercase tracking-wider">
                        En línea
                    </span>
                </header>

                <main className="flex-1 overflow-y-auto p-4 sm:p-8">
                    <div className="max-w-5xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
