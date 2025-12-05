import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { ArrowLeft, QrCode, CheckCircle, Clock } from "lucide-react";

const DealerVisits = () => {
  const navigate = useNavigate();
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTodayVisits();
  }, []);

  const loadTodayVisits = async () => {
    try {
      setError("");
      const res = await api.get("/api/visits/today");
      setVisits(res.data.result || []);
    } catch (err) {
      console.error("Error cargando visitas:", err);
      setError("Error al cargar visitas: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (code) => {
    switch (code) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CHECKED_IN":
        return "bg-blue-100 text-blue-800";
      case "PLANNED":
        return "bg-yellow-100 text-yellow-800";
      case "SKIPPED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (code) => {
    switch (code) {
      case "COMPLETED":
        return <CheckCircle className="w-5 h-5" />;
      case "CHECKED_IN":
      case "PLANNED":
        return <Clock className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  if (loading) return <p className="text-center p-6">Cargando visitas...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate("/dealer/home")}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Mis visitas de hoy</h1>
            <p className="text-sm text-gray-600">
              {new Date().toLocaleDateString('es-MX', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

      {visits.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <p className="text-gray-500 mb-4">
            No tienes visitas programadas para hoy.
          </p>
          <button
            onClick={() => navigate("/dealer/assignments")}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            Ver mis asignaciones
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {visits.map((v) => (
            <div key={v.id} className="bg-white shadow-md rounded-lg p-4 border-l-4 border-blue-500">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-lg font-bold text-gray-900">
                  {v.store?.name}
                </h2>
                <span className={`px-3 py-1 text-xs rounded-full flex items-center gap-1 ${getStatusColor(v.status?.code)}`}>
                  {getStatusIcon(v.status?.code)}
                  {v.status?.description || v.status?.code}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-2">
                📍 {v.store?.address}
              </p>

              {v.checkInAt && (
                <p className="text-xs text-gray-500 mb-2">
                  Check-in: {new Date(v.checkInAt).toLocaleString('es-MX')}
                </p>
              )}

              <div className="flex gap-2 mt-3">
                <button
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={() => navigate(`/dealer/visits/${v.id}`)}
                >
                  Ver detalles
                </button>
                {v.status?.code === "PLANNED" && (
                  <button
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
                    onClick={() => navigate(`/dealer/scan?visitId=${v.id}`)}
                  >
                    <QrCode className="w-5 h-5" />
                    Escanear QR
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
};

export default DealerVisits;