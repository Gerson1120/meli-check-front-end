import Dexie from 'dexie';

export const db = new Dexie('MeliCheckDB');

// Definimos el esquema
// IMPORTANTE: Solo indexamos los campos por los que vamos a buscar (WHERE)
db.version(1).stores({
  // Usuarios (Para guardar token y rol localmente)
  users: 'id, role, name, token', 
  
  // Tiendas asignadas (Copia local para verlas offline)
  stores: 'id, name, address, latitude, longitude, qrCode, status', 
  
  // Catálogo de productos (Copia local)
  products: 'id, name, sku, unit, price', 
  
  // Visitas/Check-ins pendientes de sincronizar
  pendingVisits: '++id, storeId, timestamp, latitude, longitude, synced', 
  
  // Pedidos pendientes de sincronizar
  pendingOrders: '++id, storeId, visitId, items, total, createdAt, synced' 
});

// Función auxiliar para saber si hay datos pendientes
export const hasPendingData = async () => {
    const visits = await db.pendingVisits.where('synced').equals(0).count();
    const orders = await db.pendingOrders.where('synced').equals(0).count();
    return (visits + orders) > 0;
};