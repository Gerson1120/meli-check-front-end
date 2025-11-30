import { useEffect, useState } from "react";
import { StoreService } from "../../services/storeService";
import { Link } from "react-router-dom";

const StoresList = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadStores = async () => {
    try {
      const res = await StoreService.getAll();
      setStores(res.data.result);
    } catch (err) {
      console.error("Error cargando tiendas", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadStores();
  }, []);

  const toggleStore = async (id) => {
    await StoreService.toggle(id);
    loadStores();
  };

  const showQR = async (id) => {
    const res = await StoreService.getQr(id);
    const blob = new Blob([res.data], { type: "image/png" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  if (loading) return <p className="text-center p-10">Cargando tiendas...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tiendas</h1>
        <Link 
          to="create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Nueva Tienda
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b text-left">
              <th className="py-3">Nombre</th>
              <th>Dirección</th>
              <th>Activo</th>
              <th>QR</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {stores.map((s) => (
              <tr key={s.id} className="border-b hover:bg-gray-50">
                <td className="py-3">{s.name}</td>
                <td>{s.address}</td>
                <td>
                  <span className={
                    s.isActive ? "text-green-600" : "text-red-600"
                  }>
                    {s.isActive ? "Sí" : "No"}
                  </span>
                </td>

                <td>
                  <button 
                    onClick={() => showQR(s.id)}
                    className="text-blue-600 underline"
                  >
                    Ver QR
                  </button>
                </td>

                <td className="space-x-3">
                  <Link 
                    to={`edit/${s.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    Editar
                  </Link>

                  <button
                    onClick={() => toggleStore(s.id)}
                    className={
                      s.isActive
                        ? "text-red-600"
                        : "text-green-600"
                    }
                  >
                    {s.isActive ? "Desactivar" : "Activar"}
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StoresList;
