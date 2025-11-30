import { useEffect, useState } from "react";
import { StoreService } from "../../services/storeService";
import { useNavigate, useParams } from "react-router-dom";

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

  useEffect(() => {
    if (isEdit) {
      StoreService.getOne(id).then((res) => {
        setForm(res.data.result);
      });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEdit) {
      await StoreService.update(id, form);
    } else {
      await StoreService.create(form);
    }
    navigate("/admin/stores");
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {isEdit ? "Editar Tienda" : "Nueva Tienda"}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
        
        <label className="block mb-4">
          <span>Nombre</span>
          <input 
            className="w-full border px-3 py-2 rounded" 
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </label>

        <label className="block mb-4">
          <span>Dirección</span>
          <input 
            className="w-full border px-3 py-2 rounded" 
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            required
          />
        </label>

        <label className="block mb-4">
          <span>Latitud</span>
          <input 
            className="w-full border px-3 py-2 rounded" 
            value={form.latitude}
            onChange={(e) => setForm({ ...form, latitude: e.target.value })}
          />
        </label>

        <label className="block mb-4">
          <span>Longitud</span>
          <input 
            className="w-full border px-3 py-2 rounded" 
            value={form.longitude}
            onChange={(e) => setForm({ ...form, longitude: e.target.value })}
          />
        </label>

        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
        >
          {isEdit ? "Guardar Cambios" : "Crear Tienda"}
        </button>
      </form>
    </div>
  );
};

export default StoreForm;