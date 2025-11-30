import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
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

      <div className="bg-white p-10 rounded-lg shadow text-center">
        <h2 className="text-xl text-gray-600">Bienvenido al sistema MeliCheck</h2>
        <p className="text-gray-400 mt-2">Aquí gestionarás repartidores y tiendas.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;