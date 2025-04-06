'use client';

import { useEffect, useState } from "react";
import io from "socket.io-client";

export default function PainelPowerlifting() {
  const [dados, setDados] = useState<{
    nome: string;
    pesoCorporal: string;
    categoria: string;
    movimento: string;
    peso: string;
    tentativa: string;
    resultado?: "valido" | "invalido";
  } | null>(null);

  useEffect(() => {
    const socket = io();

    socket.on("dados_parciais", (data) => {
      setDados({ ...data, resultado: undefined });
    });

    socket.on("validar_resultado", (res: "valido" | "invalido") => {
      setDados((prev) => (prev ? { ...prev, resultado: res } : prev));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="h-screen w-screen bg-black text-white flex items-center justify-center p-8">
      {dados ? (
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">{dados.nome}</h1>
          <p className="text-2xl mb-2">
            {dados.categoria} - {dados.pesoCorporal} Kg
          </p>
          <p className="text-4xl font-semibold mb-2">
            {dados.movimento} - {dados.tentativa}
          </p>
          <p className="text-5xl font-bold mb-4">{dados.peso} Kg</p>

          {dados.resultado ? (
            <div
              className={`text-5xl font-extrabold px-10 py-4 rounded-xl ${
                dados.resultado === "valido" ? "bg-green-600" : "bg-red-600"
              }`}
            >
              {dados.resultado === "valido" ? "LIFT VÁLIDO" : "NO LIFT"}
            </div>
          ) : (
            <p className="text-2xl text-yellow-400 font-semibold mt-4">
              Aguardando execução/validação...
            </p>
          )}
        </div>
      ) : (
        <p className="text-2xl text-gray-500">Aguardando dados do operador...</p>
      )}
    </div>
  );
}
