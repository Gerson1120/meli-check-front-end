import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useZxing } from "react-zxing";
import { VisitService } from "../../services/visitService";
import { ArrowLeft, MapPin, Camera, ShoppingCart, XCircle, Keyboard } from "lucide-react";
import { db } from "../../db/db";

const DealerScan = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const visitId = new URLSearchParams(location.search).get("visitId");

  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [geoLocation, setGeoLocation] = useState({ latitude: null, longitude: null });
  const [geoError, setGeoError] = useState("");
  const [checkInSuccess, setCheckInSuccess] = useState(false);
  const [visitData, setVisitData] = useState(null);
  const [manualMode, setManualMode] = useState(false);
  const [manualQr, setManualQr] = useState("");

  // Obtener ubicación del usuario
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGeoLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setGeoError("");
        },
        (err) => {
          console.error("Error obteniendo ubicación:", err);
          setGeoError("No se pudo obtener la ubicación. El check-in se hará sin coordenadas.");
        }
      );
    } else {
      setGeoError("Tu navegador no soporta geolocalización.");
    }
  }, []);

  const { ref } = useZxing({
    onDecodeResult(result) {
      const qrText = result.getText();
      setResult(qrText);
      processQr(qrText);
    },
    onError(err) {
      console.warn("Camera error:", err);
    },
  });

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualQr.trim()) {
      processQr(manualQr.trim());
    }
  };

  const processQr = async (qrText) => {
    if (loading) return; // Evitar múltiples llamadas

    setLoading(true);
    setError("");

    try {
      const payload = {
        qrCode: qrText,
        latitude: geoLocation.latitude || 0,
        longitude: geoLocation.longitude || 0,
      };

      console.log("🔍 Haciendo check-in con:", payload);

      const response = await VisitService.checkInByQr(payload);

      console.log("✅ Check-in exitoso:", response.data);

      // Guardar datos de la visita y mostrar opciones
      setVisitData(response.data.result);
      setCheckInSuccess(true);
    } catch (e) {
      console.error("❌ Error en check-in:", e);

      let errorMsg = "Error al hacer check-in: ";
      if (e.response?.data?.message) {
        errorMsg += e.response.data.message;
      } else if (e.response?.data?.text) {
        errorMsg += e.response.data.text;
      } else {
        errorMsg += "QR inválido o no corresponde a una tienda asignada.";
      }

      setError(errorMsg);

      // Intentar guardar offline si falla
      try {
        await db.pendingVisits.add({
          qrCode: qrText,
          latitude: geoLocation.latitude || 0,
          longitude: geoLocation.longitude || 0,
          timestamp: new Date().toISOString(),
          synced: 0,
        });
        setError(errorMsg + " (Guardado offline para sincronizar después)");
      } catch (dbErr) {
        console.error("Error guardando offline:", dbErr);
      }
    } finally {
      setLoading(false);
    }
  };

  // Mostrar opciones después de check-in exitoso
  if (checkInSuccess && visitData) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold">Check-in Exitoso</h2>
          </div>

          <div className="bg-green-100 border border-green-400 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl">✓</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-green-900">
                  Check-in realizado
                </h3>
                <p className="text-sm text-green-700">
                  {visitData.store?.name}
                </p>
              </div>
            </div>
            <p className="text-sm text-green-800">
              Registro de ubicación: {geoLocation.latitude?.toFixed(6)}, {geoLocation.longitude?.toFixed(6)}
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow mb-4">
            <h3 className="font-semibold text-gray-800 mb-3">
              ¿Deseas levantar un pedido?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Puedes registrar los productos que necesita la tienda o continuar sin hacer pedido.
            </p>

            <div className="space-y-3">
              <button
                className="w-full bg-blue-600 text-white py-4 rounded-lg flex items-center justify-center gap-3 hover:bg-blue-700 transition-colors shadow-md"
                onClick={() => navigate(`/dealer/visits/${visitData.id}/order`)}
              >
                <ShoppingCart className="w-6 h-6" />
                <span className="font-semibold text-lg">Levantar pedido</span>
              </button>

              <button
                className="w-full bg-gray-600 text-white py-4 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-700 transition-colors shadow-md"
                onClick={() => navigate(`/dealer/visits/${visitData.id}`)}
              >
                <XCircle className="w-6 h-6" />
                <span className="font-semibold text-lg">No levantar pedido</span>
              </button>
            </div>
          </div>

          <button
            className="w-full mt-2 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            onClick={() => navigate("/dealer/visits")}
          >
            Volver a mis visitas
          </button>
        </div>
      </div>
    );
  }

  // UI normal del escáner QR
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold">Escanear QR de Tienda</h2>
        </div>

        {/* Info de ubicación */}
        <div className="bg-white rounded-lg p-4 mb-4 shadow">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            <span className="font-semibold">Ubicación</span>
          </div>
          {geoLocation.latitude && geoLocation.longitude ? (
            <p className="text-sm text-green-600">
              ✓ Ubicación obtenida: {geoLocation.latitude.toFixed(6)}, {geoLocation.longitude.toFixed(6)}
            </p>
          ) : (
            <p className="text-sm text-yellow-600">
              {geoError || "Obteniendo ubicación..."}
            </p>
          )}
        </div>

        {/* Toggle entre cámara y manual */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setManualMode(false)}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${
              !manualMode
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <Camera className="w-5 h-5" />
            Escanear
          </button>
          <button
            onClick={() => setManualMode(true)}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${
              manualMode
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <Keyboard className="w-5 h-5" />
            Ingresar código
          </button>
        </div>

        {/* Cámara o Input Manual */}
        <div className="bg-white rounded-lg p-4 shadow">
          {!manualMode ? (
            <>
              <div className="flex items-center gap-2 mb-3">
                <Camera className="w-5 h-5 text-blue-600" />
                <span className="font-semibold">Escáner QR</span>
              </div>

              <video ref={ref} className="w-full rounded-lg shadow-lg" />
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-3">
                <Keyboard className="w-5 h-5 text-blue-600" />
                <span className="font-semibold">Ingreso Manual</span>
              </div>

              <form onSubmit={handleManualSubmit} className="space-y-3">
                <input
                  type="text"
                  value={manualQr}
                  onChange={(e) => setManualQr(e.target.value)}
                  placeholder="Ingresa el código QR de la tienda"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !manualQr.trim()}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
                >
                  {loading ? "Procesando..." : "Hacer Check-in"}
                </button>
              </form>
            </>
          )}

          {loading && (
            <p className="text-blue-600 mt-4 text-center font-semibold">
              Procesando check-in...
            </p>
          )}

          {result && !loading && !error && (
            <p className="text-green-600 mt-4 text-center">
              ✓ QR detectado: {result}
            </p>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
              {error}
            </div>
          )}
        </div>

        <button
          className="w-full mt-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400"
          onClick={() => navigate(-1)}
          disabled={loading}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default DealerScan;