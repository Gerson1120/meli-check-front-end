import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useZxing } from "react-zxing";
import { VisitService } from "../../services/visitService";

const DealerScan = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const visitId = new URLSearchParams(location.search).get("visitId");

  const [result, setResult] = useState("");
  const [error, setError] = useState("");

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

  const processQr = async (qrText) => {
    try {
      const payload = { qrCode: qrText, latitude: 0, longitude: 0 };
      await VisitService.checkInByQr(payload);

      navigate(`/dealer/visits/${visitId}`);
    } catch (e) {
      console.error(e);
      setError("QR inválido o no corresponde a la tienda");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Escanear QR</h2>

      <video ref={ref} className="w-full rounded-lg shadow-lg" />

      {result && <p className="text-green-600 mt-4">QR detectado: {result}</p>}
      {error && <p className="text-red-600 mt-4">{error}</p>}

      <button
        className="w-full mt-6 py-3 bg-gray-700 text-white rounded-lg"
        onClick={() => navigate(-1)}
      >
        Cancelar
      </button>
    </div>
  );
};

export default DealerScan;
