'use client';

import Link from "next/link";
import Image from "next/image";
import Background from "../../public/background.svg";

export default function Home() {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={Background}
          alt="Powerlifting"
          fill
          className="object-cover opacity-60"
        />
      </div>

      <div className="absolute inset-0 bg-black/50 z-10" />

      <div className="relative z-20 flex flex-col items-center justify-center h-full space-y-6 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
          Powerlifting Championship
        </h1>

        <div className="flex flex-col md:flex-row gap-4 mt-8">
          <Link href="/operador">
            <button className="cursor-pointer px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-700 transition">
              Operador
            </button>
          </Link>
          <Link href="/painel">
            <button className="cursor-pointer px-6 py-3 bg-red-600 text-white font-semibold rounded-xl shadow-lg hover:bg-red-700 transition">
              Painel
            </button>
          </Link>
          <Link href="/ranking">
            <button className="cursor-pointer px-6 py-3 bg-green-600 text-white font-semibold rounded-xl shadow-lg hover:bg-green-700 transition">
              Ranking
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
