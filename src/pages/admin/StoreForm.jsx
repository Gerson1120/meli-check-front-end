import { useEffect, useState } from "react";
import { StoreService } from "../../services/storeService";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const StoreForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: "",
    address: "",
    latitude: "",
    longitude: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      StoreService.getOne(id)
        .then((res) => {
          setForm(res.data.result);
        })
        .catch((err) => {
          setError("Error al cargar la tienda: " + (err.response?.data?.message || err.message));
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);



  const handleCoordinateChange = (e, field) => {
    const value = e.target.value;

    if (value === "" || value === "-" || /^-?\d*\.?\d*$/.test(value)) {
      setForm({ ...form, [field]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");



    setLoading(true);
    try {
      if (isEdit) {
        await StoreService.update(id, form);
      } else {
        await StoreService.create(form);
      }
      navigate("/admin/stores");
    } catch (err) {
      setError("Error al guardar la tienda: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/admin/stores")}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          type="button"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold">
          {isEdit ? "Editar Tienda" : "Nueva Tienda"}
        </h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">

        <label className="block mb-4">
          <span className="font-medium">Nombre</span>
          <input
            className="w-full border px-3 py-2 rounded mt-1"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            disabled={loading}
          />
        </label>

        <label className="block mb-4">
          <span className="font-medium">Dirección</span>
          <input
            className="w-full border px-3 py-2 rounded mt-1"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            required
            disabled={loading}
          />
        </label>

        <label className="block mb-4">
          <span className="font-medium">Latitud</span>
          <input
            className="w-full border px-3 py-2 rounded mt-1"
            value={form.latitude}
            onChange={(e) => handleCoordinateChange(e, "latitude")}
            placeholder="Ingresa la latitud"
            disabled={loading}
          />
        </label>

        <label className="block mb-4">
          <span className="font-medium">Longitud</span>
          <input
            className="w-full border px-3 py-2 rounded mt-1"
            value={form.longitude}
            onChange={(e) => handleCoordinateChange(e, "longitude")}
            placeholder="Ingresa la longitud"
            disabled={loading}
          />
        </label>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Guardando..." : (isEdit ? "Guardar Cambios" : "Crear Tienda")}
        </button>
      </form>
    </div>
  );
};

export default StoreForm;