import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { VisitService } from "../../services/visitService";
import { QrCode, ShoppingCart, LogOut } from "lucide-react";

const DealerVisitDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [visit, setVisit] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisit = async () => {
      try {
        const response = await VisitService.getVisitById(id);
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

  const isPlanned = visit.status?.code === "PLANNED";
  const isCheckedIn = visit.status?.code === "CHECKED_IN";

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Detalles de la Visita</h2>

      <div className="bg-white shadow p-4 rounded-lg">
        <p><strong>Tienda:</strong> {visit.store?.name}</p>
        <p><strong>Dirección:</strong> {visit.store?.address}</p>
        <p><strong>Fecha planeada:</strong> {visit.visitDate}</p>
        <p><strong>Estado:</strong> {visit.status?.description || visit.status?.code}</p>

        {/* Si está en PLANNED, mostrar botón de check-in */}
        {isPlanned && (
          <button
            className="bg-green-600 text-white w-full py-3 mt-4 rounded-lg flex items-center justify-center gap-2"
            onClick={() => navigate(`/dealer/scan?visitId=${id}`)}
          >
            <QrCode className="w-5 h-5" />
            Hacer Check-in (Escanear QR)
          </button>
        )}

        {/* Si está CHECKED_IN, mostrar opciones de pedido */}
        {isCheckedIn && (
          <>
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
              <p className="text-green-800 text-sm">✓ Check-in realizado</p>
              {visit.checkInAt && (
                <p className="text-green-600 text-xs mt-1">
                  {new Date(visit.checkInAt).toLocaleString("es-MX")}
                </p>
              )}
            </div>

            <button
              className="bg-blue-600 hover:bg-blue-700 text-white w-full py-3 mt-4 rounded-lg flex items-center justify-center gap-2"
              onClick={() => navigate(`/dealer/visits/${id}/order`)}
            >
              <ShoppingCart className="w-5 h-5" />
              Crear/Editar Pedido
            </button>

            <button
              className="bg-orange-600 hover:bg-orange-700 text-white w-full py-3 mt-3 rounded-lg flex items-center justify-center gap-2"
              onClick={() => {
                // TODO: Implementar checkout
                alert("Función de checkout próximamente");
              }}
            >
              <LogOut className="w-5 h-5" />
              Hacer Check-out
            </button>
          </>
        )}

        <button
          className="bg-gray-600 hover:bg-gray-700 text-white w-full py-3 mt-3 rounded-lg"
          onClick={() => navigate("/dealer/visits")}
        >
          Volver
        </button>
      </div>
    </div>
  );
};

export default DealerVisitDetails;