import { useEffect, useState } from "react";
import { StoreService } from "../../services/storeService";
import { Link } from "react-router-dom";
import { X, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const StoresList = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [qrModal, setQrModal] = useState({ show: false, url: null, storeName: "" });

  const loadStores = async () => {
    try {
      setError("");
      const res = await StoreService.getAll();
      setStores(res.data.result);
    } catch (err) {
      console.error("Error cargando tiendas", err);
      setError("Error al cargar las tiendas: " + (err.response?.data?.message || err.message));
    }
    setLoading(false);
  };

  useEffect(() => {
    loadStores();
  }, []);

  const toggleStore = async (id) => {
    try {
      setError("");
      await StoreService.toggle(id);
      loadStores();
    } catch (err) {
      setError("Error al cambiar estado de tienda: " + (err.response?.data?.message || err.message));
    }
  };

  const showQR = async (id, storeName) => {
    try {
      setError("");
      const res = await StoreService.getQr(id);
      const blob = new Blob([res.data], { type: "image/png" });
      const url = URL.createObjectURL(blob);
      setQrModal({ show: true, url, storeName });
    } catch (err) {
      setError("Error al cargar QR: " + (err.response?.data?.message || err.message));
    }
  };

  const closeQRModal = () => {
    if (qrModal.url) {
      URL.revokeObjectURL(qrModal.url);
    }
    setQrModal({ show: false, url: null, storeName: "" });
  };

  if (loading) return <p className="text-center p-10">Cargando tiendas...</p>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Tiendas</h1>
        </div>
        <Link
          to="create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Nueva Tienda
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

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
                    onClick={() => showQR(s.id, s.name)}
                    className="text-blue-600 hover:text-blue-800 underline"
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

      {qrModal.show && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeQRModal}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeQRModal}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-xl font-bold mb-4">Código QR - {qrModal.storeName}</h2>

            <div className="flex justify-center items-center bg-gray-50 p-6 rounded-lg">
              {qrModal.url && (
                <img
                  src={qrModal.url}
                  alt={`QR de ${qrModal.storeName}`}
                  className="max-w-full h-auto"
                />
              )}
            </div>

            <div className="mt-4 flex gap-3">
              <a
                href={qrModal.url}
                download={`QR-${qrModal.storeName}.png`}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-center hover:bg-blue-700"
              >
                Descargar QR
              </a>
              <button
                onClick={closeQRModal}
                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoresList;``