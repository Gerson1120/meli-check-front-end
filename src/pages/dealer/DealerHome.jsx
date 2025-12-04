import { useNavigate } from "react-router-dom";

const DealerHome = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-6 text-center">MeliCheck — Repartidor</h1>

      {/* VISITAS */}
      <button
        className="bg-blue-600 text-white w-full py-3 rounded-lg mb-3"
        onClick={() => navigate("/dealer/visits")}
      >
        Ver mis visitas de hoy
      </button>

      {/* ASIGNACIONES */}
      <button
        className="bg-gray-700 text-white w-full py-3 rounded-lg"
        onClick={() => navigate("/dealer/assignments")}
      >
        Ver mis asignaciones
      </button>
    </div>
  );
};

export default DealerHome;
