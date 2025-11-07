import UploaderDocumento from "../components/UploaderDocumento";
import { useState } from "react";

export default function NuevoDocumento() {
  const [expedienteId, setExpedienteId] = useState("");

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Cargar documento</h1>

      <p className="text-sm text-gray-600 mb-3">
        Seleccioná el expediente al que pertenece el archivo.
      </p>

      <input
        type="number"
        placeholder="ID de expediente"
        value={expedienteId}
        onChange={(e) => setExpedienteId(e.target.value)}
        className="border px-3 py-2 rounded mb-4 w-full"
      />

      {expedienteId ? (
        <UploaderDocumento expedienteId={expedienteId} />
      ) : (
        <div className="text-gray-500 text-sm">Ingresá un ID para continuar.</div>
      )}
    </div>
  );
}
