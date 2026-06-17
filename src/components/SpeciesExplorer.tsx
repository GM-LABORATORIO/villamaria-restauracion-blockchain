'use client';

import React, { useState } from 'react';

interface Species {
  name: string;
  scientificName: string;
  role: string;
  desc: string;
  category: 'Árbol Noble' | 'Arbusto / Pionera';
  status: 'Preocupación Menor' | 'Vulnerable' | 'Casi Amenazada' | 'En Peligro';
  icon: string;
}

const SPECIES_DATA: Species[] = [
  {
    name: 'Roble',
    scientificName: 'Quercus humboldtii',
    role: 'Almacenamiento masivo de carbono y retención de suelos.',
    desc: 'Es el pilar de los bosques altoandinos. Sus raíces robustas evitan la erosión de laderas empinadas en la cuenca del Chupaderos. Provee un dosel denso que protege la microfauna.',
    category: 'Árbol Noble',
    status: 'Vulnerable',
    icon: '🌳',
  },
  {
    name: 'Pino Colombiano',
    scientificName: 'Retrophyllum rospigliosii',
    role: 'Captación de agua de niebla y patrimonio forestal.',
    desc: 'Única conífera nativa de Colombia, actualmente catalogada en peligro por sobreexplotación histórica. Capta humedad directamente de la neblina andina, recargando los acuíferos locales.',
    category: 'Árbol Noble',
    status: 'En Peligro',
    icon: '🌲',
  },
  {
    name: 'Cedro',
    scientificName: 'Cedrela montana',
    role: 'Restauración del dosel forestal superior.',
    desc: 'Árbol de gran porte y lento crecimiento. Clave para restaurar la estructura del bosque maduro. Sus flores atraen una gran variedad de insectos y sus frutos alimentan loros y tucanes andinos.',
    category: 'Árbol Noble',
    status: 'Vulnerable',
    icon: '🪵',
  },
  {
    name: 'Nigüito',
    scientificName: 'Miconia theaezans',
    role: 'Alimento clave para avifauna y dispersores de semillas.',
    desc: 'Especie pionera sumamente resistente. Produce frutos pequeños y dulces de forma constante durante todo el año, lo que la convierte en la principal fuente de alimento para aves e insectos de la zona.',
    category: 'Arbusto / Pionera',
    status: 'Preocupación Menor',
    icon: '🍇',
  },
  {
    name: 'Mano de Oso',
    scientificName: 'Oreopanax floribundus',
    role: 'Regulación del microclima y retención de humedad.',
    desc: 'Sus grandes hojas en forma de mano actúan como paraguas naturales, amortiguando el impacto de la lluvia sobre el suelo y evitando la compactación del terreno. Aporta abundante materia orgánica.',
    category: 'Arbusto / Pionera',
    status: 'Preocupación Menor',
    icon: '🍁',
  },
  {
    name: 'Arboloco',
    scientificName: 'Montanoa quadrangularis',
    role: 'Crecimiento rápido para recuperación de suelos degradados.',
    desc: 'Crece a gran velocidad en zonas descubiertas, creando sombra que permite a otras especies de crecimiento lento establecerse. Sus raíces retienen agua de manera sobresaliente.',
    category: 'Arbusto / Pionera',
    status: 'Preocupación Menor',
    icon: '🌿',
  },
  {
    name: 'Encenillo',
    scientificName: 'Weinmannia tomentosa',
    role: 'Protección de nacimientos de agua y captador hídrico.',
    desc: 'Especie adaptada a la alta montaña. Sus hojas pequeñas y vellosas atrapan la neblina del páramo, condensándola en gotas de agua que recargan el caudal de la Quebrada Chupaderos.',
    category: 'Árbol Noble',
    status: 'Preocupación Menor',
    icon: '🌱',
  },
  {
    name: 'Cucharo',
    scientificName: 'Myrsine guianensis',
    role: 'Barrera cortaviento y resistencia climática.',
    desc: 'Muy resistente a heladas andinas y vientos fuertes. Protege a los individuos más jóvenes y actúa como catalizador de regeneración natural gracias a sus frutos altamente apetecidos por aves.',
    category: 'Arbusto / Pionera',
    status: 'Preocupación Menor',
    icon: '🍒',
  },
  {
    name: 'Siete Cueros',
    scientificName: 'Tibouchina lepidota',
    role: 'Polinización activa y estabilización de taludes.',
    desc: 'Destaca por su abundante floración fucsia que atrae masivamente abejas y abejorros nativos. Su sistema radicular denso y superficial fija las capas del suelo en laderas inestables.',
    category: 'Arbusto / Pionera',
    status: 'Preocupación Menor',
    icon: '🌸',
  },
];

export default function SpeciesExplorer() {
  const [selected, setSelected] = useState<Species | null>(null);

  return (
    <div className="space-y-8">
      {/* 3x3 Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {SPECIES_DATA.map((sp) => (
          <div
            key={sp.name}
            onClick={() => setSelected(sp)}
            className="group relative bg-[#0b1329]/70 hover:bg-[#0e1a38] border border-white/5 hover:border-emerald-500/30 p-6 rounded-2xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
          >
            {/* Hover glow line */}
            <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <span className={`inline-block text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  sp.category === 'Árbol Noble'
                    ? 'bg-blue-950/40 text-blue-400 border-blue-500/20'
                    : 'bg-emerald-950/40 text-emerald-400 border-emerald-500/20'
                }`}>
                  {sp.category}
                </span>
                <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {sp.name}
                </h3>
                <p className="text-xs italic text-slate-400 font-mono">{sp.scientificName}</p>
                <p className="text-sm text-slate-300 leading-relaxed pt-1 line-clamp-2">
                  {sp.role}
                </p>
              </div>

              <span className="bg-[#020617] p-3 rounded-xl border border-white/5 group-hover:border-emerald-500/20 transition-colors flex items-center justify-center">
                {sp.category === 'Árbol Noble' ? (
                  <svg className="w-7 h-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20V10M18 10a6 6 0 00-12 0M12 4v6M12 14l-4-4m4 4l4-4" />
                  </svg>
                ) : (
                  <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20V10m0 0a4 4 0 014-4h2m-6 4a4 4 0 00-4-4H6m6 14a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                )}
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
              <span className="font-mono">Estado: {sp.status}</span>
              <span className="text-emerald-400/80 group-hover:translate-x-1 transition-transform font-medium">
                Ver detalle →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-[#020617]/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300">
          <div
            className="bg-[#0b1329] border border-white/10 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header glow */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-500 via-blue-600 to-emerald-500" />
            
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors text-lg"
            >
              ✕
            </button>

            <div className="p-8 space-y-6">
              <div className="flex items-center gap-5">
                <span className="bg-[#020617] p-4 rounded-2xl border border-white/5 flex items-center justify-center">
                  {selected.category === 'Árbol Noble' ? (
                    <svg className="w-10 h-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 20V10M18 10a6 6 0 00-12 0M12 4v6M12 14l-4-4m4 4l4-4" />
                    </svg>
                  ) : (
                    <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 20V10m0 0a4 4 0 014-4h2m-6 4a4 4 0 00-4-4H6m6 14a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                  )}
                </span>
                <div className="space-y-1">
                  <h4 className="text-2xl font-bold text-white">{selected.name}</h4>
                  <p className="text-sm italic text-slate-400 font-mono">{selected.scientificName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#020617] p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] text-slate-500 block uppercase font-mono tracking-wider">Categoría</span>
                  <span className="text-sm font-semibold text-white">{selected.category}</span>
                </div>
                <div className="bg-[#020617] p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] text-slate-500 block uppercase font-mono tracking-wider">Estado de Conservación</span>
                  <span className={`text-sm font-semibold ${
                    selected.status === 'En Peligro' ? 'text-red-400' : selected.status === 'Vulnerable' ? 'text-amber-400' : 'text-emerald-400'
                  }`}>{selected.status}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider block">Papel Ecológico</span>
                  <p className="text-slate-200 text-sm leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
                    {selected.desc}
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelected(null)}
                  className="bg-brand-green hover:bg-brand-green-light border border-emerald-400/20 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
