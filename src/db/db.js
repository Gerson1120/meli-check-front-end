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

// Nueva versión del esquema con mejoras para offline
db.version(2).stores({
  users: 'id, role, name, token',

  // Tiendas con más información para uso offline
  stores: 'id, name, address, latitude, longitude, qrCode, status, lastSync',

  // Productos con más información
  products: 'id, name, sku, unit, price, status, lastSync',

  // Asignaciones del dealer (tienda + producto)
  assignments: '++id, assignmentId, storeId, productId, dealerId, status, lastSync',

  // Visitas pendientes con más metadata
  pendingVisits: '++id, storeId, qrCode, timestamp, latitude, longitude, synced, syncAttempts, errorMessage',

  // Pedidos pendientes con más información
  pendingOrders: '++id, visitId, storeId, items, total, createdAt, synced, syncAttempts, errorMessage',

  // Metadata de sincronización
  syncMetadata: 'key, lastSync, status'
}).upgrade(trans => {
  // Migrar datos existentes
  return trans.syncMetadata.add({
    key: 'lastFullSync',
    lastSync: null,
    status: 'never'
  });
});

// Función auxiliar para saber si hay datos pendientes
export const hasPendingData = async () => {
    const visits = await db.pendingVisits.where('synced').equals(0).count();
    const orders = await db.pendingOrders.where('synced').equals(0).count();
    return (visits + orders) > 0;
};

// Función para obtener el conteo de datos pendientes
export const getPendingCounts = async () => {
    const visits = await db.pendingVisits.where('synced').equals(0).count();
    const orders = await db.pendingOrders.where('synced').equals(0).count();
    return { visits, orders, total: visits + orders };
};

// Función para limpiar datos viejos (opcional)
export const cleanOldSyncedData = async (daysOld = 30) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    await db.pendingVisits
        .where('synced').equals(1)
        .and(item => new Date(item.timestamp) < cutoffDate)
        .delete();

    await db.pendingOrders
        .where('synced').equals(1)
        .and(item => new Date(item.createdAt) < cutoffDate)
        .delete();
};

// Función para verificar si estamos online
export const isOnline = () => {
    return navigator.onLine;
};

// Función para obtener última sincronización
export const getLastSync = async (key = 'lastFullSync') => {
    const metadata = await db.syncMetadata.get(key);
    return metadata?.lastSync || null;
};

// Función para actualizar última sincronización
export const updateLastSync = async (key = 'lastFullSync') => {
    await db.syncMetadata.put({
        key,
        lastSync: new Date().toISOString(),
        status: 'success'
    });
};