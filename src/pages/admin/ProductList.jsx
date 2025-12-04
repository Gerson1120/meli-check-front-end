import { useEffect, useState } from "react";
import { ProductService } from "../../services/productService";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await ProductService.getAll();
      setProducts(res.data.result || []);
    } catch (e) {
      console.error("Error cargando productos", e);
      setError("Error al cargar productos: " + (e.response?.data?.message || e.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await ProductService.getAll();
        if (isMounted) setProducts(res.data.result || []);
      } catch (e) {
        console.error("Error cargando productos", e);
        if (isMounted) setError("Error al cargar productos: " + (e.response?.data?.message || e.message));
      } finally {
        if (isMounted) setLoading(false);
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
      await ProductService.toggle(id);
      await loadProducts();
    } catch (e) {
      console.error("Error al cambiar estado del producto", e);
      setError("Error al cambiar estado del producto: " + (e.response?.data?.message || e.message));
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
          <h1 className="text-2xl font-bold">Productos</h1>
        </div>
        <Link
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          to="/admin/products/new"
        >
          + Crear producto
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading && <p className="mt-4">Cargando productos...</p>}

      <table className="w-full mt-4 border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Nombre</th>
            <th className="p-2 border">SKU</th>
            <th className="p-2 border">Unidad</th>
            <th className="p-2 border">Precio</th>
            <th className="p-2 border">Estado</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td className="p-2 border">{p.id}</td>
              <td className="p-2 border">{p.name}</td>
              <td className="p-2 border">{p.sku}</td>
              <td className="p-2 border">{p.unit}</td>
              <td className="p-2 border">${p.price}</td>
              <td className="p-2 border">
                {p.isActive ? (
                  <span className="text-green-600 font-semibold">Activo</span>
                ) : (
                  <span className="text-red-600 font-semibold">Inactivo</span>
                )}
              </td>
              <td className="p-2 border">
                <Link
                  className="text-blue-600 mr-3"
                  to={`/admin/products/${p.id}`}
                >
                  Editar
                </Link>

                <button
                  className={`${
                    p.isActive ? "text-red-600" : "text-green-600"
                  }`}
                  onClick={() => handleToggle(p.id)}
                >
                  {p.isActive ? "Desactivar" : "Activar"}
                </button>
              </td>
            </tr>
          ))}

          {products.length === 0 && !loading && (
            <tr>
              <td className="p-4 text-center" colSpan={7}>
                No hay productos registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;