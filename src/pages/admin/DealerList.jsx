import { useEffect, useState } from "react";
import { DealerService } from "../../services/dealerService";
import { Link } from "react-router-dom";

const DealerList = () => {
  const [dealers, setDealers] = useState([]);

  const loadDealers = async () => {
    try {
      const res = await DealerService.getAll();
      setDealers(res.data.result);
    } catch (e) {
      console.error("Error cargando dealers", e);
    }
  };

  useEffect(() => {
  let isMounted = true;

  const load = async () => {
    try {
      const res = await DealerService.getAll();
      if (isMounted) setDealers(res.data.result);
    } catch (e) {
      console.error("Error cargando dealers", e);
    }
  };

  load();

  return () => {
    isMounted = false;
  };
}, []);


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Repartidores</h1>

      <Link
        className="bg-blue-600 text-white px-4 py-2 rounded"
        to="/admin/dealers/new"
      >
        Crear Dealer
      </Link>

      <table className="w-full mt-4 border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Nombre</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Teléfono</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {dealers.map((d) => (
            <tr key={d.id}>
              <td className="p-2 border">{d.id}</td>
              <td className="p-2 border">{d.name} {d.lastName}</td>
              <td className="p-2 border">{d.email}</td>
              <td className="p-2 border">{d.phone}</td>
              <td className="p-2 border">
                <Link
                  className="text-blue-600 mr-3"
                  to={`/admin/dealers/${d.id}`}
                >
                  Editar
                </Link>

                <button
                  className="text-red-600"
                  onClick={() => DealerService.toggle(d.id).then(loadDealers)}
                >
                  Toggle
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
