import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const DealerVisits = () => {
  const navigate = useNavigate();
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/visits/today")
      .then((res) => {
        setVisits(res.data.result || []);
      })
      .catch((err) => {
        console.error("Error cargando visitas:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center p-6">Cargando visitas...</p>;

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Tus visitas de hoy</h1>

      {visits.length === 0 ? (
        <p className="text-center text-gray-500">
          No tienes visitas programadas para hoy.
        </p>
      ) : (
        visits.map((v) => (
          <div key={v.id} className="bg-white shadow rounded p-4 mb-3">

            <h2 className="text-lg font-bold">
              {v.store?.name}
            </h2>

            <p className="text-sm text-gray-600">
              Dirección: {v.store?.address}
            </p>

            <p className="mt-1 text-sm">
              Estado: <b>{v.status?.code}</b>
            </p>

            <button
              className="w-full mt-3 bg-blue-600 text-white py-2 rounded"
              onClick={() => navigate(`/dealer/visits/${v.id}`)}
            >
              Ver detalles
            </button>

          </div>
        ))
      )}
    </div>
  );
};

export default DealerVisits;
