'use client';
import { useState, useEffect } from "react";
import io from "socket.io-client";
import Papa from "papaparse";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/ui/select";

const socket = io();

export default function Operador() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [atletas, setAtletas] = useState<any[]>([]);
  const [nome, setNome] = useState("");
  const [pesoCorporal, setPesoCorporal] = useState("");
  const [categoria, setCategoria] = useState("MO");
  const [movimento, setMovimento] = useState("Bench");
  const [tentativa, setTentativa] = useState("1");
  const [peso, setPeso] = useState("");

  const handleCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setAtletas(results.data);
      },
    });
  };

  const atualizarPesoAutomatico = (nome: string, movimento: string, tentativa: string) => {
    const atleta = atletas.find((a) => a.nome === nome);
    if (atleta) {
      const campo = `${movimento.toLowerCase()}${tentativa}`;
      setPeso(atleta[campo] || "");
    }
  };

  const handleSelecionarNome = (selectedName: string) => {
    setNome(selectedName);
    const atleta = atletas.find((a) => a.nome === selectedName);
    if (atleta) {
      setPesoCorporal(atleta.pesoCorporal);
      setCategoria(atleta.categoria);
      atualizarPesoAutomatico(selectedName, movimento, tentativa);
    }
  };

  const handleMovimentoChange = (mov: string) => {
    setMovimento(mov);
    atualizarPesoAutomatico(nome, mov, tentativa);
  };

  const handleTentativaChange = (tent: string) => {
    setTentativa(tent);
    atualizarPesoAutomatico(nome, movimento, tent);
  };

  const enviarResultado = (status: "valido" | "invalido") => {
    if (!nome || !peso || !movimento) return;
  
    socket.emit("validar_resultado", {
      nome,
      movimento: movimento.toLowerCase(),
      peso: Number(peso),
      status,
    });
  };

  useEffect(() => {
    if (!nome || !peso || !movimento) return;
  
    socket.emit("dados_parciais", {
      nome,
      pesoCorporal,
      categoria,
      movimento,
      tentativa,
      peso,
    });
  }, [nome, pesoCorporal, categoria, movimento, tentativa, peso]);

  return (
    <div className="p-6 grid gap-4 max-w-xl mx-auto">
      <Input type="file" accept=".csv" onChange={handleCSV} className="mb-4" />

      <Card>
        <CardContent className="p-4 grid gap-4">
          <Select value={nome} onValueChange={handleSelecionarNome}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o atleta" />
            </SelectTrigger>
            <SelectContent>
              {atletas.map((a, index) => (
                <SelectItem key={index} value={a.nome}>
                  {a.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Input
              placeholder="Peso corporal (Kg)"
              value={pesoCorporal}
              onChange={(e) => setPesoCorporal(e.target.value)}
            />
            <Select value={categoria} onValueChange={setCategoria}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MO">MO</SelectItem>
                <SelectItem value="MS">MS</SelectItem>
                <SelectItem value="SUBJ">SUBJ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Select value={movimento} onValueChange={handleMovimentoChange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Bench">Bench</SelectItem>
                <SelectItem value="Squat">Squat</SelectItem>
                <SelectItem value="Deadlift">Deadlift</SelectItem>
              </SelectContent>
            </Select>

            <Select value={tentativa} onValueChange={handleTentativaChange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Tentativa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1ª</SelectItem>
                <SelectItem value="2">2ª</SelectItem>
                <SelectItem value="3">3ª</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Peso levantado"
              value={peso}
              onChange={(e) => setPeso(e.target.value)}
            />
          </div>

          <div className="flex gap-4 justify-center">
            <Button
              className="cursor-pointer bg-green-600 hover:bg-green-700"
              onClick={() => enviarResultado("valido")}
            >
              ✓ Lift válido
            </Button>
            <Button
              className="cursor-pointer bg-red-600 hover:bg-red-700"
              onClick={() => enviarResultado("invalido")}
            >
              ✗ No Lift
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
