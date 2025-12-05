import { useEffect, useState } from "react";
import { getMyAssignments } from "../../services/assignmentService";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const DealerAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      setError("");
      const res = await getMyAssignments();
      setAssignments(res.data.result || []);
    } catch (err) {
      console.error("Error cargando asignaciones del dealer:", err);
      setError("Error al cargar asignaciones: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Cargando asignaciones...</p>;

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
          <h1 className="text-xl font-bold text-gray-800">
            Todas mis asignaciones
          </h1>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

      {assignments.length === 0 && (
        <p className="text-gray-500 text-center mt-12">
          No tienes asignaciones activas.
        </p>
      )}

      <div className="flex flex-col gap-4">
        {assignments.map(a => (
          <div
            key={a.id}
            className="bg-white rounded-xl shadow p-4 border border-gray-200"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                {a.store.name}
              </h2>

              <span
                className={`px-3 py-1 text-xs rounded-full ${
                  a.assignmentType.code === "PERMANENT"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-orange-100 text-orange-600"
                }`}
              >
                {a.assignmentType.code === "PERMANENT" ? "Permanente" : "Temporal"}
              </span>
            </div>

            <p className="text-gray-600 text-sm mt-1">
              Dirección: <span className="font-medium">{a.store.address}</span>
            </p>

            {/* Datos dependiendo del tipo */}
            {a.assignmentType.code === "PERMANENT" ? (
              <p className="text-gray-700 text-sm mt-1">
                Frecuencia: <span className="font-semibold">{a.frequencyDays} días</span>
              </p>
            ) : (
              <>
                <p className="text-gray-700 text-sm mt-1">
                  Fecha inicio:{" "}
                  <span className="font-semibold">{a.startDate}</span>
                </p>
                {a.endDate && (
                  <p className="text-gray-700 text-sm">
                    Fecha fin: <span className="font-semibold">{a.endDate}</span>
                  </p>
                )}
              </>
            )}

            <p className="text-xs text-gray-500 mt-2">
              Asignado desde: {a.createdAt.substring(0, 10)}
            </p>

            <button
  onClick={() => navigate(`/dealer/assignments/${a.id}`)}
  className="mt-4 bg-yellow-500 text-white w-full py-2 rounded"
>
  Ver detalles
</button>

          </div>
        ))}
      </div>
      </div>
    </div>
  );
};

export default DealerAssignments;