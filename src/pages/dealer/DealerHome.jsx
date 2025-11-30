import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MapPin, LogOut, QrCode, ClipboardList } from 'lucide-react';

const DealerHome = () => {
  const { logout, user } = useAuth();
  
  // Datos MOCK (Pronto los conectaremos a tu API de Tiendas)
  const [routes, setRoutes] = useState([
    { id: 1, name: 'Tienda Ejemplo 1', address: 'Av. Siempre Viva 123', status: 'pending' },
    { id: 2, name: 'Tienda Ejemplo 2', address: 'Calle 5 de Mayo #45', status: 'completed' },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-blue-600 text-white p-4 sticky top-0 z-10 shadow-md">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold">Mis Rutas</h1>
            <p className="text-blue-100 text-xs">{new Date().toLocaleDateString()}</p>
          </div>
          <div className="flex gap-3 items-center">
             <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold border border-blue-400">
               {user?.name ? user.name.charAt(0).toUpperCase() : 'D'}
             </div>
             <button onClick={logout}><LogOut size={20} /></button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-sm">Visitas Hoy</p>
            <p className="text-2xl font-bold text-gray-800">
              {routes.filter(r => r.status === 'completed').length} / {routes.length}
            </p>
          </div>
          <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
            <ClipboardList size={20} />
          </div>
        </div>

        <h2 className="font-semibold text-gray-700 mt-6">Tiendas Asignadas</h2>

        <div className="space-y-3">
          {routes.map((store) => (
            <div 
              key={store.id} 
              className={`bg-white p-4 rounded-xl shadow-sm border-l-4 flex justify-between items-center transition-transform active:scale-95
                ${store.status === 'completed' ? 'border-green-500 opacity-70' : 'border-blue-500'}`}
            >
              <div className="flex-1">
                <h3 className="font-bold text-gray-800">{store.name}</h3>
                <p className="text-gray-500 text-xs flex items-center gap-1 mt-1">
                  <MapPin size={12} /> {store.address}
                </p>
              </div>
              
              {store.status === 'pending' ? (
                <button className="bg-blue-600 text-white p-2 rounded-full shadow-lg active:bg-blue-700">
                  <QrCode size={20} />
                </button>
              ) : (
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">
                  LISTO
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DealerHome;