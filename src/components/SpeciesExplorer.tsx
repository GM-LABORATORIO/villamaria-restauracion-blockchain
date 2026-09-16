'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface Species {
  name: string;
  scientificName: string;
  role: string;
  desc: string;
  ecoImportance: string;
  category: 'Árbol Noble' | 'Arbusto / Pionera';
  status: 'Preocupación Menor' | 'Vulnerable' | 'Casi Amenazada' | 'En Peligro';
  image: string;
  altText: string;
}

const SPECIES_DATA: Species[] = [
  {
    name: 'Roble Negro / de Montaña',
    scientificName: 'Quercus humboldtii',
    role: 'Anclaje profundo de laderas y prevención de desprendimientos.',
    desc: 'Especie insignia de los bosques de niebla andinos. Desarrolla un sistema de raíces pivotantes que penetran la roca madre, actuando como pilares naturales contra deslizamientos en la cuenca Chupaderos.',
    ecoImportance: 'Un solo roble adulto puede almacenar más de 2.5 toneladas de carbono y filtrar miles de litros de agua de escorrentía hacia el acuífero subterráneo de Villamaría.',
    category: 'Árbol Noble',
    status: 'Vulnerable',
    image: '/fotos/roble-1.jpg',
    altText: 'Fotografía real de monitoreo de campo: Roble de Montaña (Quercus humboldtii) en Villamaría',
  },
  {
    name: 'Pino Colombiano',
    scientificName: 'Retrophyllum rospigliosii',
    role: 'Captura masiva de agua de niebla y recarga hídrica.',
    desc: 'Única conífera nativa de Colombia y especie amenazada. Su copa densa intercepta la neblina andina constante, condensándola en gotas que alimentan de forma continua el caudal del río.',
    ecoImportance: 'Sus acículas retienen hasta un 40% más de humedad atmosférica que otras especies, actuando como una esponja viva esencial para la seguridad hídrica regional.',
    category: 'Árbol Noble',
    status: 'En Peligro',
    image: '/fotos/pino-colombiano-1.jpg',
    altText: 'Fotografía real de monitoreo de campo: Pino Colombiano (Retrophyllum rospigliosii)',
  },
  {
    name: 'Cedro de Montaña',
    scientificName: 'Cedrela montana',
    role: 'Restauración del dosel alto y refugio de avifauna.',
    desc: 'Alcanza alturas superiores a los 25 metros. Su madera noble y follaje espacioso proporcionan hábitat y sitios de nidificación para el Loro Orejiamarillo y el Tucán Andino.',
    ecoImportance: 'Regula la temperatura del microclima forestal y enriquece el suelo a través de la hojarasca nitrogenada que cae estacionalmente.',
    category: 'Árbol Noble',
    status: 'Vulnerable',
    image: '/fotos/cedro-1.jpg',
    altText: 'Fotografía real de monitoreo de campo: Cedro de Montaña (Cedrela montana)',
  },
  {
    name: 'Encenillo',
    scientificName: 'Weinmannia tomentosa',
    role: 'Protección de nacimientos de agua y franja de páramo.',
    desc: 'Especie clave en la transición entre el bosque de niebla y el páramo del Nevado del Ruiz. Hojas coriáceas cubiertas de vello peltado adaptadas a bajas temperaturas y vientos fuertes.',
    ecoImportance: 'Crea una densa capa de mantillo orgánico que retiene sedimentos, garantizando la pureza cristalina del agua que llega a la bocatoma.',
    category: 'Árbol Noble',
    status: 'Preocupación Menor',
    image: '/fotos/encenillo-1.jpg',
    altText: 'Fotografía real de monitoreo de campo: Encenillo (Weinmannia tomentosa)',
  },
  {
    name: 'Siete Cueros',
    scientificName: 'Tibouchina lepidota',
    role: 'Polinización masiva y fijación rápida de taludes.',
    desc: 'Reconocido por su espectacular floración morada y corteza hojosa. Atrae intensamente a polinizadores nativos, acelerando la fecundación del ecosistema circundante.',
    ecoImportance: 'Sus raíces leñosas entrelazadas estabilizan cortes de carretera y bordes de quebradas en tiempo récord.',
    category: 'Arbusto / Pionera',
    status: 'Preocupación Menor',
    image: '/fotos/siete-cueros-1.jpg',
    altText: 'Fotografía real de monitoreo de campo: Siete Cueros (Tibouchina lepidota)',
  },
  {
    name: 'Nigüito',
    scientificName: 'Miconia theaezans',
    role: 'Despensa alimenticia permanente para la fauna silvestre.',
    desc: 'Fructifica ininterrumpidamente durante todo el año. Sus pequeñas bayas moradas son el alimento básico de más de 35 especies de aves dispersoras de semillas.',
    ecoImportance: 'Catalizador de la regeneración natural espontánea: las aves digieren sus frutos y siembran nuevas especies nativas por todo el ecosistema.',
    category: 'Arbusto / Pionera',
    status: 'Preocupación Menor',
    image: '/fotos/niguito-1.jpg',
    altText: 'Fotografía real de monitoreo de campo: Nigüito (Miconia theaezans)',
  },
  {
    name: 'Mano de Oso',
    scientificName: 'Oreopanax floribundus',
    role: 'Sombrilla natural y amortiguador de lluvias intensas.',
    desc: 'Presenta grandes hojas palmeadas que dispersan la fuerza de las lluvias torrenciales de montaña, reduciendo la erosión hídrica superficial sobre el suelo del bosque.',
    ecoImportance: 'Genera un microclima húmedo y sombreado propicio para el establecimiento de musgos, orquídeas y helechos epífitos.',
    category: 'Arbusto / Pionera',
    status: 'Preocupación Menor',
    image: '/fotos/mano-de-oso-1.jpg',
    altText: 'Fotografía real de monitoreo de campo: Mano de Oso (Oreopanax floribundus)',
  },
  {
    name: 'Cucharo',
    scientificName: 'Myrsine guianensis',
    role: 'Barrera cortavientos y nodriza ambiental.',
    desc: 'Resistente a heladas y ráfagas de viento frío provenientes del pico del volcán. Resguarda a los brotes y plántulas más jóvenes durante sus primeros años de crecimiento.',
    ecoImportance: 'Fija minerales en el suelo y previene la desecación del terreno durante épocas de menor precipitación.',
    category: 'Arbusto / Pionera',
    status: 'Preocupación Menor',
    image: '/fotos/cucharo-1.jpg',
    altText: 'Fotografía real de monitoreo de campo: Cucharo (Myrsine guianensis)',
  },
  {
    name: 'Arboloco',
    scientificName: 'Montanoa quadrangularis',
    role: 'Recuperador veloz de suelos degradados y fijador de humedad.',
    desc: 'Crece hasta 3 metros por año. Su tallo esponjoso almacena grandes volúmenes de agua durante la temporada de lluvias y los libera gradualmente al suelo seco.',
    ecoImportance: 'Pionero por excelencia: su rápida cobertura vegetal crea el colchón de sombra necesario para el posterior retorno de los Robles y Cedros.',
    category: 'Arbusto / Pionera',
    status: 'Preocupación Menor',
    image: '/fotos/arboloco_oficial_villamaria.jpg',
    altText: 'Fotografía oficial de monitoreo de campo: Arboloco (Montanoa quadrangularis) en Villamaría',
  },
];

export default function SpeciesExplorer() {
  const [selected, setSelected] = useState<Species | null>(null);

  return (
    <div className="space-y-8">
      {/* Grid Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {SPECIES_DATA.map((sp) => (
          <div
            key={sp.name}
            onClick={() => setSelected(sp)}
            className="group bg-[#0c1222]/90 hover:bg-[#0f1830] border border-white/10 hover:border-emerald-500/40 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 transform hover:-translate-y-1 shadow-xl flex flex-col justify-between"
          >
            {/* Adult Tree Photo Header */}
            <div className="relative h-48 w-full overflow-hidden bg-slate-900">
              <Image
                src={sp.image}
                alt={sp.altText}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c1222] via-transparent to-black/30" />
              
              {/* Category Badge */}
              <div className="absolute top-3 left-3 flex gap-2">
                <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border backdrop-blur-md ${
                  sp.category === 'Árbol Noble'
                    ? 'bg-blue-950/80 text-blue-300 border-blue-500/40'
                    : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                }`}>
                  {sp.category.toUpperCase()}
                </span>
              </div>

              {/* UICN Badge */}
              <div className="absolute top-3 right-3">
                <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border backdrop-blur-md ${
                  sp.status === 'En Peligro'
                    ? 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                    : sp.status === 'Vulnerable'
                    ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                    : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                }`}>
                  UICN · {sp.status}
                </span>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors font-heading">
                  {sp.name}
                </h3>
                <p className="text-xs italic text-slate-400 font-mono mt-0.5">{sp.scientificName}</p>
                <p className="text-xs text-slate-300 leading-relaxed mt-2 line-clamp-3">
                  {sp.role}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span className="text-[10px] text-emerald-400/90 font-bold uppercase tracking-wider">Ver Ficha Ecológica</span>
                <span className="text-emerald-400 group-hover:translate-x-1 transition-transform font-bold">
                  →
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal View for Detailed Ecological Impact */}
      {selected && (
        <div
          className="fixed inset-0 bg-[#020617]/90 backdrop-blur-md z-[99999] flex items-start sm:items-center justify-center p-4 pt-24 sm:pt-28 overflow-y-auto"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-[#0b1329] border border-white/10 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl animate-fadeIn text-white my-auto max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image Header */}
            <div className="relative h-64 w-full bg-slate-900">
              <Image
                src={selected.image}
                alt={selected.altText}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b1329] via-black/20 to-black/40" />

              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/70 border border-white/20 text-white flex items-center justify-center font-bold hover:bg-rose-600 transition-all cursor-pointer z-10"
              >
                ✕
              </button>

              <div className="absolute bottom-4 left-6 right-6">
                <span className="text-[10px] font-mono font-bold text-emerald-300 bg-[#060a15]/90 border border-emerald-500/40 px-3 py-1 rounded-full uppercase tracking-wider">
                  ESPECIE ADULTA NATIVA EN HABITAT DE MONTAÑA
                </span>
                <h3 className="text-3xl font-extrabold text-white mt-1 font-heading">{selected.name}</h3>
                <p className="text-xs text-slate-300 italic font-mono">{selected.scientificName}</p>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5">
              <div className="flex flex-wrap gap-2 text-xs font-mono">
                <span className={`px-3 py-1 rounded-md font-bold ${
                  selected.category === 'Árbol Noble'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}>
                  {selected.category}
                </span>
                <span className={`px-3 py-1 rounded-md font-bold ${
                  selected.status === 'En Peligro'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : selected.status === 'Vulnerable'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}>
                  UICN · {selected.status}
                </span>
              </div>

              {/* Role & Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">Función Biológica Principales</h4>
                <p className="text-sm text-slate-200 leading-relaxed font-sans bg-[#020617] p-4 rounded-xl border border-white/5">
                  {selected.desc}
                </p>
              </div>

              {/* Environmental Impact Details */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400">Importancia Ambiental en la Cuenca Chupaderos</h4>
                <div className="bg-gradient-to-r from-emerald-950/30 to-blue-950/30 p-4 rounded-xl border border-emerald-500/20 text-xs text-slate-200 leading-relaxed space-y-2">
                  <p>{selected.ecoImportance}</p>
                  <p className="text-[11px] text-slate-400 font-mono pt-2 border-t border-white/5">
                    ✓ Especie monitoreada e inventariada bajo el convenio SGR-SC-001-2025 en Villamaría, Caldas.
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelected(null)}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-sm transition-all cursor-pointer shadow-lg shadow-emerald-950/50"
                >
                  Cerrar Ficha Ecológica
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
