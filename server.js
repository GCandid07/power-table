/* eslint-disable @typescript-eslint/no-require-imports */
const express = require("express");
const next = require("next");
const http = require("http");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const rankingData = {};

function calcularRanking() {
  const competidores = Object.entries(rankingData).map(([nome, dados]) => {
    const getMax = (arr) => (arr.length ? Math.max(...arr) : 0);
    const squat = dados.squat || [];
    const bench = dados.bench || [];
    const deadlift = dados.deadlift || [];

    return {
      nome,
      squat,
      bench,
      deadlift,
      total: getMax(squat) + getMax(bench) + getMax(deadlift),
    };
  });

  competidores.sort((a, b) => b.total - a.total);
  return competidores;
}

app.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);
  const io = new Server(httpServer, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("🔌 Cliente conectado");

    socket.emit("ranking_atualizado", calcularRanking());

    socket.on("dados_parciais", (data) => {
      socket.broadcast.emit("dados_parciais", data);
    });

    socket.on("validar_resultado", (resultado) => {
      console.log("🔍 Validando resultado:", resultado);

      const { nome, movimento, peso, status } = resultado;

      io.emit("validar_resultado", status);

      if (status !== "valido") return;

      if (!nome || !movimento || peso === undefined) {
        console.warn("🚨 Dados inválidos recebidos:", resultado);
        return;
      }

      if (!rankingData[nome]) {
        rankingData[nome] = {
          squat: [],
          bench: [],
          deadlift: [],
        };
      }

      const pesoNumerico = Number(peso);
      if (!isNaN(pesoNumerico)) {
        rankingData[nome][movimento].push(pesoNumerico);
      }

      const ranking = calcularRanking();
      io.emit("ranking_atualizado", ranking);
    });

    socket.on("disconnect", () => {
      console.log("⛔ Cliente desconectado");
    });
  });

  server.use((req, res) => handle(req, res));

  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  });
});
