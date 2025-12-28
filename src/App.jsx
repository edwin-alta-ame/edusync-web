import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import DashboardLayout from './components/DashboardLayout';
import RegisterMaestro from './pages/RegisterMaestro';

const Welcome = () => {
  const { user } = useAuth();
  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
      <h2 className="text-3xl font-bold text-slate-800">¡Hola, {user?.name}! 👋</h2>
      <p className="text-slate-500 mt-2">Bienvenido a tu asistente de calificación con IA.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <div className="p-6 border-2 border-dashed border-blue-200 rounded-2xl hover:border-blue-400 cursor-pointer transition-all">
          <p className="text-2xl mb-2">📸</p>
          <h3 className="font-bold text-slate-800">Calificar nuevo examen</h3>
        </div>
        <div className="p-6 border-2 border-dashed border-slate-200 rounded-2xl hover:border-slate-400 cursor-pointer transition-all">
          <p className="text-2xl mb-2">📁</p>
          <h3 className="font-bold text-slate-800">Ver reportes</h3>
        </div>
      </div>
    </div>
  );
};

function App() {
  const { user, loading } = useAuth();

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-900 text-white">Cargando...</div>;

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
      
      <Route path="/dashboard/*" element={
        user ? (
          <DashboardLayout>
            <Routes>
              <Route index element={<Welcome />} />
              {user.role === 'admin' && (
                <Route path="registrar" element={<RegisterMaestro />} />
              )}
              {/* Aquí puedes añadir más rutas como "subir" o "historial" */}
            </Routes>
          </DashboardLayout>
        ) : <Navigate to="/login" />
      } />

      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
    </Routes>
  );
}

export default App;
