import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAssignment } from "../../../services/assignmentService";
import { DealerService } from "../../../services/dealerService";
import { StoreService } from "../../../services/storeService";
import { ArrowLeft } from "lucide-react";

const CreateAssignment = () => {
  const navigate = useNavigate();

  const [dealers, setDealers] = useState([]);
  const [stores, setStores] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    dealerId: "",
    storeId: "",
    assignmentType: "PERMANENT",
    frequencyDays: "",
    startDate: "",
    isActive: true
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setError("");
        const [dealersRes, storesRes] = await Promise.all([
          DealerService.getAll(),
          StoreService.getAll()
        ]);
        setDealers(dealersRes.data.result);
        setStores(storesRes.data.result);
      } catch (err) {
        setError("Error al cargar datos: " + (err.response?.data?.message || err.message));
      }
    };
    loadData();
  }, []);

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await createAssignment(form);
      navigate("/admin/assignments");
    } catch (err) {
      console.error("Error creando asignación:", err);
      setError("Error al crear asignación: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

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
        <h1 className="text-2xl font-bold">Crear Asignación</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 max-w-lg">
          {error}
        </div>
      )}

      <form onSubmit={submit} className="bg-white p-6 shadow rounded w-96">
        
        {/* Dealer */}
        <label className="block mt-2">Repartidor</label>
        <select name="dealerId" value={form.dealerId} onChange={change} className="input" required>
          <option value="">Seleccione...</option>
          {dealers.map(d => (
            <option key={d.id} value={d.id}>{d.name} {d.lastName}</option>
          ))}
        </select>

        {/* Store */}
        <label className="block mt-2">Tienda</label>
        <select name="storeId" value={form.storeId} onChange={change} className="input" required>
          <option value="">Seleccione...</option>
          {stores.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        {/* Type */}
        <label className="block mt-2">Tipo de asignación</label>
        <select name="assignmentType" value={form.assignmentType} onChange={change} className="input">
          <option value="PERMANENT">Permanente</option>
          <option value="TEMPORARY">Temporal</option>
        </select>

        {/* Frequency (solo para permanente) */}
        {form.assignmentType === "PERMANENT" && (
          <>
            <label className="block mt-2">Frecuencia (días)</label>
            <input type="number" name="frequencyDays" value={form.frequencyDays}
              onChange={change} className="input" required />
          </>
        )}

        {/* Start Date */}
        <label className="block mt-2">Fecha de inicio</label>
        <input type="date" name="startDate" value={form.startDate} onChange={change} className="input" />

        <button
          type="submit"
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Creando..." : "Crear"}
        </button>

      </form>
    </div>
  );
};

export default CreateAssignment;