import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { VisitService } from "../../services/visitService";

const DealerVisitDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [visit, setVisit] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisit = async () => {
      try {
        const response = await VisitService.getVisit(id);
        setVisit(response.data.result);
      } catch (err) {
        console.error("❌ Error al traer visita:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVisit();
  }, [id]);

  if (loading) return <div className="p-6 text-center">Cargando visita...</div>;
  if (!visit) return <div className="p-6 text-center">Visita no encontrada</div>;

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Detalles de la Visita</h2>

      <div className="bg-white shadow p-4 rounded-lg">
        <p><strong>Tienda:</strong> {visit.store?.name}</p>
        <p><strong>Dirección:</strong> {visit.store?.address}</p>
        <p><strong>Fecha planeada:</strong> {visit.date}</p>
        <p><strong>Estado:</strong> {visit.status}</p>

        <button
          className="bg-green-600 text-white w-full py-3 mt-4 rounded-lg"
          onClick={() => navigate(`/dealer/scan?visitId=${id}`)}
        >
          Escanear QR (Check-in)
        </button>

        <button
          className="bg-gray-800 text-white w-full py-3 mt-3 rounded-lg"
          onClick={() => navigate("/dealer/visits")}
        >
          Volver
        </button>
      </div>
    </div>
  );
};

export default DealerVisitDetails;
