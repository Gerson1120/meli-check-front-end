import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      {/* HEADER */}
      <div className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Panel de Control</h1>
          <p className="text-gray-500">Administrador: {user?.name || user?.email}</p>
        </div>
        <button 
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
        >
          Salir
        </button>
      </div>

      {/* MENU */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/admin/stores" className="bg-white p-8 rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-xl font-semibold text-gray-700">Tiendas</h2>
          <p className="text-gray-500 mt-2">Administrar tiendas</p>
        </Link>

        <Link to="assignments" className="bg-white p-8 rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-xl font-semibold text-gray-700">Asignaciones</h2>
          <p className="text-gray-500 mt-2">Gestionar asignaciones</p>
        </Link>

        <Link to="/admin/dealers" className="bg-white p-8 rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-xl font-semibold text-gray-700">Repartidores</h2>
          <p className="text-gray-500 mt-2">Gestionar repartidores</p>
        </Link>

        <div className="bg-white p-8 rounded-lg shadow opacity-50">
          <h2 className="text-xl font-semibold text-gray-700">Reportes (Próximamente)</h2>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;