import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAssignment, updateAssignment } from "../../../services/assignmentService";
import { ArrowLeft } from "lucide-react";

const EditAssignment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadAssignment = async () => {
      try {
        setError("");
        const res = await getAssignment(id);
        const a = res.data.result;

        // Convertimos fecha a formato yyyy-mm-dd
        const startDate = a.startDate ? a.startDate.substring(0, 10) : "";
        const endDate = a.endDate ? a.endDate.substring(0, 10) : "";

        setForm({
          dealerId: a.dealer.id,
          storeId: a.store.id,
          assignmentType: a.assignmentType.code,
          frequencyDays: a.frequencyDays || "",
          startDate,
          endDate,
          isActive: a.isActive
        });
      } catch (err) {
        console.error("Error cargando asignación:", err);
        setError("Error al cargar asignación: " + (err.response?.data?.message || err.message));
      }
    };
    loadAssignment();
  }, [id]);

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await updateAssignment(id, form);
      navigate("/admin/assignments");
    } catch (err) {
      console.error("Error actualizando asignación:", err);
      setError("Error al actualizar asignación: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (!form && !error) return <p className="p-8">Cargando asignación...</p>;

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => navigate("/admin/assignments")}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          type="button"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold">Editar asignación #{id}</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 max-w-lg">
          {error}
        </div>
      )}

      {!form && error ? (
        <p className="text-red-600">No se pudo cargar la asignación</p>
      ) : null}

      {form && (

      <form onSubmit={submit} className="bg-white p-6 rounded shadow w-full max-w-md">

        {/* Tipo */}
        <label className="block mb-2 font-semibold">Tipo de asignación</label>
        <select
          name="assignmentType"
          value={form.assignmentType}
          onChange={change}
          className="input w-full"
          required
        >
          <option value="PERMANENT">Permanente</option>
          <option value="TEMPORARY">Temporal</option>
        </select>

        {/* Frecuencia (solo permanente) */}
        {form.assignmentType === "PERMANENT" && (
          <>
            <label className="block mt-4 font-semibold">Frecuencia (días)</label>
            <input
              type="number"
              name="frequencyDays"
              value={form.frequencyDays}
              onChange={change}
              className="input w-full"
              min="1"
              required
            />
          </>
        )}

        {/* Fecha inicio */}
        <label className="block mt-4 font-semibold">Fecha inicio</label>
        <input
          type="date"
          name="startDate"
          value={form.startDate}
          onChange={change}
          className="input w-full"
          required={form.assignmentType === "TEMPORARY"}
        />

        {/* Fecha fin (solo temporal) */}
        {form.assignmentType === "TEMPORARY" && (
          <>
            <label className="block mt-4 font-semibold">Fecha fin</label>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={change}
              className="input w-full"
            />
          </>
        )}

        {/* Estado */}
        <label className="block mt-4 font-semibold">Estado</label>
        <select
          name="isActive"
          value={form.isActive}
          onChange={(e) =>
            setForm({ ...form, isActive: e.target.value === "true" })
          }
          className="input w-full"
        >
          <option value="true">Activa</option>
          <option value="false">Inactiva</option>
        </select>

        <button
          type="submit"
          className="mt-6 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Actualizando..." : "Actualizar"}
        </button>

      </form>
      )}
    </div>
  );
};

export default EditAssignment;