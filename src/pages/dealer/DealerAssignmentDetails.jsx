import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAssignment } from "../../services/assignmentService";
import { getMyAssignment } from "../../services/assignmentService";

const DealerAssignmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);

  useEffect(() => {
  getMyAssignment(id)
    .then(res => setAssignment(res.data.result))
    .catch(err => console.error(err));
}, [id]);


  if (!assignment) return <p className="p-4">Cargando detalles...</p>;

  const store = assignment.store;
  const dealer = assignment.dealer;

  return (
    <div className="p-5 max-w-md mx-auto">
      <button 
        className="mb-4 text-blue-500 underline"
        onClick={() => navigate(-1)}
      >
        ← Regresar
      </button>

      <h1 className="text-2xl font-bold mb-4">Detalles de asignación</h1>

      {/* STORE CARD */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-2">{store.name}</h2>

        <p><strong>Dirección:</strong> {store.address}</p>
        <p><strong>Coordenadas:</strong> {store.latitude}, {store.longitude}</p>
        <p><strong>QR:</strong> {store.qrCode}</p>

        <p className="mt-2 text-sm text-gray-500">
          Asignado el: {assignment.startDate}
        </p>

        {assignment.endDate && (
          <p className="text-sm text-gray-500">
            Finaliza: {assignment.endDate}
          </p>
        )}
      </div>

      {/* ASSIGNMENT INFO */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-md font-semibold mb-2">Información</h3>

        <p>
          <strong>Tipo:</strong>{" "}
          {assignment.assignmentType.code === "PERMANENT"
            ? "Permanente"
            : "Temporal"}
        </p>

        {assignment.frequencyDays && (
          <p><strong>Frecuencia:</strong> {assignment.frequencyDays} días</p>
        )}
      </div>
    </div>
  );
};

export default DealerAssignmentDetails;
