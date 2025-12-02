import { useState, useEffect } from "react";
import { DealerService } from "../../services/dealerService";
import { useNavigate, useParams } from "react-router-dom";

const DealerForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    lastName: "",
    surname: "",
    phone: "",
    email: "",
    password: ""
  });

  useEffect(() => {
    if (isEdit) {
      DealerService.getOne(id).then((res) => {
        setForm(res.data.result);
      });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEdit) {
      await DealerService.update(id, form);
    } else {
      await DealerService.create(form);
    }

    navigate("/admin/dealers");
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {isEdit ? "Editar Dealer" : "Nuevo Dealer"}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
        
        <label className="block mb-3">
          <span>Nombre</span>
          <input
            className="w-full border px-3 py-2"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </label>

        <label className="block mb-3">
          <span>Apellido paterno</span>
          <input
            className="w-full border px-3 py-2"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            required
          />
        </label>

        <label className="block mb-3">
          <span>Apellido materno</span>
          <input
            className="w-full border px-3 py-2"
            value={form.surname}
            onChange={(e) => setForm({ ...form, surname: e.target.value })}
            required
          />
        </label>

        <label className="block mb-3">
          <span>Teléfono</span>
          <input
            className="w-full border px-3 py-2"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </label>

        <label className="block mb-3">
          <span>Email</span>
          <input
            className="w-full border px-3 py-2"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </label>

        {!isEdit && (
          <label className="block mb-3">
            <span>Contraseña</span>
            <input
              type="password"
              className="w-full border px-3 py-2"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </label>
        )}

        <button className="bg-blue-600 text-white w-full py-2 rounded">
          {isEdit ? "Guardar cambios" : "Crear Dealer"}
        </button>
      </form>
    </div>
  );
};

export default DealerForm;
