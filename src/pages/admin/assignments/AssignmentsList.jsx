import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAssignments, toggleAssignment } from "../../../services/assignmentService";
import { ArrowLeft } from "lucide-react";

const AssignmentsList = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      // Debug: Verificar token y usuario
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      console.log("🔍 DEBUG - Token existe:", !!token);
      console.log("🔍 DEBUG - Usuario:", userStr ? JSON.parse(userStr) : null);

      const res = await getAssignments();
      setAssignments(res.data.result || []);
    } catch (e) {
      console.error("❌ Error cargando asignaciones", e);
      console.error("❌ Respuesta del servidor:", e.response?.data);

      let errorMsg = "Error al cargar asignaciones: ";

      if (e.response?.status === 403) {
        errorMsg += "No tienes permisos para ver asignaciones. Asegúrate de estar logueado como ADMIN.";
      } else {
        errorMsg += e.response?.data?.message || e.message;
      }

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleToggle = async (id) => {
    try {
      setError("");
      await toggleAssignment(id);
      load();
    } catch (e) {
      console.error("Error al cambiar estado de asignación", e);
      setError("Error al cambiar estado: " + (e.response?.data?.message || e.message));
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Asignaciones</h1>
        </div>
        <Link
          to="/admin/assignments/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Crear asignación
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold mb-2">Error:</p>
          <p>{error}</p>
          {error.includes("403") || error.includes("permisos") ? (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-300 rounded">
              <p className="font-semibold text-yellow-800 mb-1">💡 Solución:</p>
              <ul className="text-yellow-900 text-sm list-disc list-inside">
                <li>Cierra sesión y vuelve a iniciar sesión como administrador</li>
                <li>Credenciales de admin: <code className="bg-yellow-200 px-1">admin@gmail.com</code> / <code className="bg-yellow-200 px-1">1234</code></li>
                <li>Verifica que tu usuario tenga el rol ADMIN</li>
              </ul>
            </div>
          ) : null}
        </div>
      )}

      {loading && <p className="text-center py-4">Cargando asignaciones...</p>}

      <div className="bg-white shadow rounded p-4 mt-4">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th>ID</th>
              <th>Repartidor</th>
              <th>Tienda</th>
              <th>Tipo</th>
              <th>Fecha inicio</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {assignments.length === 0 && (
              <tr><td colSpan="7" className="text-center py-4">No hay asignaciones</td></tr>
            )}

            {assignments.map(a => (
              <tr key={a.id} className="border-b text-center">
                <td>{a.id}</td>
                <td>{a.dealer?.email}</td>
                <td>{a.store?.name}</td>
                <td>{a.assignmentType?.code}</td>
                <td>{a.startDate}</td>

                <td>
                  <span className={`px-2 py-1 rounded text-white 
                    ${a.isActive ? 'bg-green-500' : 'bg-red-500'}`}>
                    {a.isActive ? "Activo" : "Inactivo"}
                  </span>
                </td>

                <td className="flex gap-2 justify-center py-2">
                  <Link
                    to={`/admin/assignments/${a.id}`}
                    className="px-3 py-1 bg-yellow-500 text-white rounded"
                  >
                    Editar
                  </Link>

                  <button
                    onClick={() => handleToggle(a.id)}
                    className="px-3 py-1 bg-gray-600 text-white rounded"
                  >
                    Toggle
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

export default AssignmentsList;