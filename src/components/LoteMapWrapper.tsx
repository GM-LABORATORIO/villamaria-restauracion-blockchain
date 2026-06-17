'use client';

import dynamic from 'next/dynamic';

const LoteMap = dynamic(() => import('@/components/LoteMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-[#0b1329]/60 flex items-center justify-center border border-white/5 rounded-2xl">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500 mx-auto"></div>
        <p className="text-xs text-slate-400 font-mono mt-4">Inicializando Mapa de Coordenadas...</p>
      </div>
    </div>
  )
});

export default function LoteMapWrapper() {
  return <LoteMap />;
}
