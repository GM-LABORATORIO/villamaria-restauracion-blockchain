'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface NotarizedDoc {
  fileName: string;
  description?: string;
  cid?: string;
  sha256Hash: string;
  timestamp: number;
  publicLink: string;
  txHash: string;
  explorerUrl?: string;
}

interface NotaryCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  doc: NotarizedDoc | null;
}

const CONTRACT_ADDRESS = '0x7e34e2e66838D0DA8e88cBC4200020a6bD9925F4';

export default function NotaryCertificateModal({ isOpen, onClose, doc }: NotaryCertificateModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !doc || !mounted) return null;

  const dateObject = new Date(doc.timestamp * 1000);
  const formattedDate = dateObject.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }) + ` (notarizado a las ${dateObject.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} UTC)`;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
    doc.explorerUrl || `https://snowtrace.io/tx/${doc.txHash}`
  )}`;

  const handlePrint = () => {
    window.print();
  };

  return createPortal(
    <div className="printable-cert-modal-parent fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      
      {/* Bulletproof print stylesheet to hide browser margins/headers and collapse layout height to exactly 1 page */}
      <style jsx global>{`
        @media print {
          /* Hide all general page wrappers and sections */
          body > * {
            display: none !important;
          }
          
          /* Show Next.js root layout div */
          body > #__next, body > div {
            display: block !important;
            background: #ffffff !important;
            height: auto !important;
          }

          /* Force display and reset layout ancestors of the modal */
          main, #blockchain, .printable-cert-modal-parent {
            display: block !important;
            position: static !important;
            padding: 0 !important;
            margin: 0 !important;
            background: transparent !important;
            backdrop-filter: none !important;
            height: auto !important;
            width: auto !important;
            overflow: visible !important;
          }

          /* Strip down modal box wrappers to print only the content card */
          .printable-cert-modal-parent > div {
            border: none !important;
            box-shadow: none !important;
            background: transparent !important;
            max-height: none !important;
            margin: 0 !important;
            padding: 0 !important;
            display: block !important;
            width: 100% !important;
            height: auto !important;
          }
          
          /* Hide modal box header, footer and close buttons */
          .printable-cert-modal-parent > div > div:not(.p-6) {
            display: none !important;
          }
          
          /* Hide action buttons and close buttons inside print container */
          .no-print-element {
            display: none !important;
          }

          /* Set margin of page */
          @page {
            size: A4 portrait;
            margin: 0;
          }

          /* Position the certificate card perfectly as a flat A4 block */
          .printable-cert-area {
            display: block !important;
            position: relative !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 2.2cm !important;
            border: 12px double #065f46 !important; /* Elegant green border */
            box-shadow: none !important;
            background-color: #ffffff !important;
            color: #000000 !important;
            border-radius: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Modal Header (print-hidden) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="font-bold text-white text-sm tracking-wide">Constancia de Integridad y Trazabilidad</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            title="Cerrar"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Content / Certificate Area */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1 bg-slate-950/40 flex flex-col items-center">
          
          {/* Action Bar (print-hidden) */}
          <div className="w-full max-w-[800px] flex justify-end gap-3 mb-6 no-print-element">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-emerald-900/30 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Guardar como PDF / Imprimir
            </button>
          </div>

          {/* PRINTABLE CERTIFICATE CARD */}
          <div className="printable-cert-area w-full max-w-[800px] bg-[#fbfbfa] text-slate-800 rounded-xl shadow-2xl p-8 sm:p-12 md:p-16 border-[12px] border-double border-emerald-950 relative overflow-hidden select-text font-serif shrink-0 my-4">
            
            {/* Background Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.015] pointer-events-none z-0">
              <svg className="w-[85%] h-[85%]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.53c-.26-.81-1-1.4-1.9-1.4h-1v-3c0-.55-.45-1-1-1h-6v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.4z"/>
              </svg>
            </div>

            {/* Inner Border */}
            <div className="absolute inset-2 border border-amber-600/20 pointer-events-none z-0" />

            <div className="relative z-10 space-y-8">
              
              {/* Header Logos (Alcaldía + Más Progreso side-by-side) */}
              <div className="flex flex-row items-center justify-between gap-4 border-b border-slate-200 pb-6">
                <div className="flex items-center gap-3">
                  <img src="/escudo-municipio.png" alt="Escudo Alcaldía de Villamaría" className="h-14 w-auto object-contain" />
                  <div className="h-10 w-px bg-slate-300" />
                  <span className="text-[11px] font-sans font-bold tracking-widest text-slate-800 uppercase">
                    Más Progreso E.S.P.
                  </span>
                </div>
                
                <div className="text-right">
                  <p className="text-[10px] tracking-widest font-sans font-bold text-slate-500 uppercase">República de Colombia</p>
                  <p className="text-[11px] tracking-wider font-sans font-bold text-slate-800 uppercase mt-0.5">Departamento de Caldas</p>
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="text-center space-y-2">
                <h2 className="text-lg sm:text-xl font-bold tracking-wide text-slate-900 uppercase">
                  Constancia de Integridad y Trazabilidad Digital
                </h2>
                <p className="text-xs font-sans tracking-[0.15em] font-bold text-emerald-800 uppercase">
                  Proyecto de Restauración Ecológica - Contrato SGR-SC-001-2025
                </p>
              </div>

              {/* Main Body Text */}
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify indent-8">
                Por medio de la presente se da constancia que la información técnica correspondiente al Inventario Forestal y Georreferenciación de los predios <strong className="text-slate-900">La Albania</strong>, <strong className="text-slate-900">La Carpeta</strong> y <strong className="text-slate-900">La Carpetica</strong>, ha sido registrada bajo un esquema de inmutabilidad digital en la red de Blockchain Avalanche (C-Chain).
              </p>

              {/* Registration Table */}
              <div className="border border-slate-200 rounded-lg overflow-hidden font-sans text-xs">
                <div className="bg-slate-50 border-b border-slate-200 px-4 py-2">
                  <span className="font-bold text-slate-600 uppercase tracking-wider text-[10px]">Detalles de Registro y Prueba de Autenticidad</span>
                </div>
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-1.5 pb-2 border-b border-slate-100">
                    <span className="font-bold text-slate-500 uppercase tracking-wider text-[9px] md:col-span-1">Nombre del Archivo:</span>
                    <span className="text-slate-800 font-semibold md:col-span-3 break-all">{doc.fileName}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-1.5 pb-2 border-b border-slate-100">
                    <span className="font-bold text-slate-500 uppercase tracking-wider text-[9px] md:col-span-1">Huella Digital (SHA-256):</span>
                    <span className="text-slate-800 font-mono font-bold select-all break-all md:col-span-3 uppercase">
                      {doc.sha256Hash}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-1.5 pb-2 border-b border-slate-100">
                    <span className="font-bold text-slate-500 uppercase tracking-wider text-[9px] md:col-span-1">ID Transacción (TXID):</span>
                    <a
                      href={doc.explorerUrl || `https://snowtrace.io/tx/${doc.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-mono font-bold break-all underline md:col-span-3"
                    >
                      {doc.txHash} ↗
                    </a>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-1.5">
                    <span className="font-bold text-slate-500 uppercase tracking-wider text-[9px] md:col-span-1">Fecha de Registro:</span>
                    <span className="text-slate-800 font-semibold md:col-span-3">{formattedDate}</span>
                  </div>
                </div>
              </div>

              {/* Blockchain Evidence Subtext */}
              <div className="bg-slate-50 border border-slate-200 rounded p-3 space-y-1.5 text-[10px] font-sans">
                <div className="flex justify-between">
                  <span className="text-slate-500">Contrato Inteligente Notario:</span>
                  <span className="font-mono text-slate-800 font-bold select-all">{CONTRACT_ADDRESS}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Red de Consenso:</span>
                  <span className="text-slate-800 font-bold">Avalanche C-Chain Mainnet (ID: 43114)</span>
                </div>
              </div>

              {/* Footer Section */}
              <div className="border-t border-slate-200 pt-6 flex flex-row items-end justify-between gap-6">
                
                {/* Responsible entities list */}
                <div className="space-y-4 max-w-lg font-sans text-xs">
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">Participantes del Proyecto</span>
                    <p className="text-slate-800 font-bold leading-tight">Alcaldía de Villamaría</p>
                    <p className="text-slate-800 font-bold leading-tight">Espacio y Gestión Verde S.A.S.</p>
                    <p className="text-slate-800 font-bold leading-tight">Más Progreso S.A.S. E.S.P.</p>
                  </div>
                  <div className="pt-2 border-t border-slate-100">
                    <p className="text-[9px] text-slate-400 italic leading-relaxed">
                      Consultoría Tecnológica: Servicio de trazabilidad e integridad digital implementado por <a href="https://www.gmholding.info" target="_blank" rel="noopener noreferrer" className="underline hover:text-emerald-700 font-semibold transition-colors">GM Holding</a>.
                    </p>
                  </div>
                </div>

                {/* QR Code and audit verification */}
                <div className="flex flex-col items-center gap-1 shrink-0 select-none">
                  <div className="bg-white p-1.5 border border-slate-200 rounded shadow-md">
                    <img 
                      src={qrCodeUrl}
                      alt="Verificar en Snowtrace" 
                      className="w-20 h-20"
                    />
                  </div>
                  <span className="text-[7px] font-sans font-bold text-slate-400 uppercase tracking-wider text-center block">
                    Auditar Registro
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
        
        {/* Modal Footer (print-hidden) */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/50 flex justify-end no-print-element">
          <button 
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition-all cursor-pointer"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}
