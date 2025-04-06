'use client';

import { useEffect, useState } from 'react';
import io from 'socket.io-client';

type Competidor = {
  nome: string;
  squat: number[];
  bench: number[];
  deadlift: number[];
  total: number;
};

export default function Ranking() {
  const [ranking, setRanking] = useState<Competidor[]>([]);
  const [sortKey, setSortKey] = useState<keyof Competidor | 'colocacao'>('total');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const socket = io();

    socket.on('ranking_atualizado', (data: Competidor[]) => {
      setRanking(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sorted = [...ranking].sort((a, b) => {
    const getMax = (arr: number[]) => Math.max(...arr, 0);
    if (sortKey === 'colocacao') return 0;
    if (sortKey === 'nome') {
      return sortOrder === 'asc'
        ? a.nome.localeCompare(b.nome)
        : b.nome.localeCompare(a.nome);
    }
    if (sortKey === 'total') {
      return sortOrder === 'asc' ? a.total - b.total : b.total - a.total;
    }
    // squat, bench, deadlift
    const maxA = getMax(a[sortKey] as number[]);
    const maxB = getMax(b[sortKey] as number[]);
    return sortOrder === 'asc' ? maxA - maxB : maxB - maxA;
  });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">🏆 Ranking Geral</h1>

      <div className="flex gap-2 mb-4 justify-center">
        {['colocacao', 'nome', 'squat', 'bench', 'deadlift', 'total'].map((key) => (
          <button
            key={key}
            onClick={() =>
              setSortKey(key as keyof Competidor | 'colocacao')
            }
            className="cursor-pointer bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-700"
          >
            {key.toUpperCase()}
          </button>
        ))}
        <button
          onClick={() =>
            setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
          }
          className="cursor-pointer bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-500"
        >
          {sortOrder === 'asc' ? '↑ Crescente' : '↓ Decrescente'}
        </button>
      </div>

      <table className="w-full text-left border border-white/20">
        <thead>
          <tr className="bg-gray-900 text-white">
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Nome</th>
            <th className="px-4 py-2">Squat</th>
            <th className="px-4 py-2">Bench</th>
            <th className="px-4 py-2">Deadlift</th>
            <th className="px-4 py-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((comp, index) => {
            const getMax = (arr: number[]) => Math.max(...arr, 0);
            return (
              <tr key={comp.nome} className="border-t border-white/10">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{comp.nome}</td>
                <td className="px-4 py-2">{getMax(comp.squat)}</td>
                <td className="px-4 py-2">{getMax(comp.bench)}</td>
                <td className="px-4 py-2">{getMax(comp.deadlift)}</td>
                <td className="px-4 py-2">{comp.total}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
