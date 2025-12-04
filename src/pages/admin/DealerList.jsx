import { useEffect, useState } from "react";
import { DealerService } from "../../services/dealerService";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const DealerList = () => {
  const navigate = useNavigate();
  const [dealers, setDealers] = useState([]);
  const [error, setError] = useState("");

  const loadDealers = async () => {
    try {
      setError("");
      const res = await DealerService.getAll();
      setDealers(res.data.result);
    } catch (e) {
      console.error("Error cargando dealers", e);
      setError("Error al cargar dealers: " + (e.response?.data?.message || e.message));
    }
  };

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        setError("");
        const res = await DealerService.getAll();
        if (isMounted) setDealers(res.data.result);
      } catch (e) {
        console.error("Error cargando dealers", e);
        if (isMounted) setError("Error al cargar dealers: " + (e.response?.data?.message || e.message));
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggle = async (id) => {
    try {
      setError("");
      await DealerService.toggle(id);
      await loadDealers();
    } catch (e) {
      console.error("Error al cambiar estado del dealer", e);
      setError("Error al cambiar estado del dealer: " + (e.response?.data?.message || e.message));
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Repartidores</h1>
        </div>
        <Link
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          to="/admin/dealers/new"
        >
          + Crear Dealer
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <table className="w-full mt-4 border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Nombre</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Teléfono</th>
            <th className="p-2 border">Estado</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {dealers.map((d) => (
            <tr key={d.id}>
              <td className="p-2 border">{d.id}</td>
              <td className="p-2 border">{d.name} {d.lastName}</td>
              <td className="p-2 border">{d.email}</td>
              <td className="p-2 border">{d.phone || "N/A"}</td>
              <td className="p-2 border">
                {d.isActive ? (
                  <span className="text-green-600 font-semibold">Activo</span>
                ) : (
                  <span className="text-red-600 font-semibold">Inactivo</span>
                )}
              </td>
              <td className="p-2 border">
                <Link
                  className="text-blue-600 mr-3 hover:underline"
                  to={`/admin/dealers/${d.id}`}
                >
                  Editar
                </Link>

                <button
                  className={`${d.isActive ? "text-red-600" : "text-green-600"} hover:underline`}
                  onClick={() => handleToggle(d.id)}
                >
                  {d.isActive ? "Desactivar" : "Activar"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DealerList;