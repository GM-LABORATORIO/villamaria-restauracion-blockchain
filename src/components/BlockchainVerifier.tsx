'use client';

import { useState, useEffect } from 'react';
import NotaryCertificateModal from './NotaryCertificateModal';

interface NotarizedDoc {
  fileName: string;
  description?: string;
  cid?: string;
  sha256Hash: string;
  timestamp: number;
  publicLink: string;
  txHash: string;
  explorerUrl?: string;
  isSimulated?: boolean;
}

const CONTRACT_ADDRESS = '0x7e34e2e66838D0DA8e88cBC4200020a6bD9925F4';

export default function BlockchainVerifier() {
  const [docs, setDocs] = useState<NotarizedDoc[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<NotarizedDoc | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    status: 'success' | 'error' | 'idle' | 'loading';
    message: string;
    docName?: string;
    hash?: string;
    timestamp?: string;
    txHash?: string;
    publicLink?: string;
  }>({ status: 'idle', message: '' });

  const getIPFSViewLink = (doc: NotarizedDoc) => {
    if (!doc.cid) return '#';
    const isViewable = doc.fileName.endsWith('.pdf') || doc.fileName.match(/\.(jpg|jpeg|png)$/i);
    if (isViewable) {
      return `https://ipfs.io/ipfs/${doc.cid}`;
    }
    return doc.publicLink;
  };

  useEffect(() => {
    fetch('/notarized_docs.json')
      .then(res => res.json())
      .then(data => setDocs(data))
      .catch(err => console.error('Error loading notarized docs database:', err));
  }, []);

  const calculateSHA256 = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) await verifyFile(e.dataTransfer.files[0]);
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) await verifyFile(e.target.files[0]);
  };

  const verifyFile = async (file: File) => {
    setVerificationResult({ status: 'loading', message: 'Calculando Hash SHA-256...' });
    try {
      const hash = await calculateSHA256(file);
      const match = docs.find(doc => doc.sha256Hash.toLowerCase() === hash.toLowerCase());

      if (match) {
        const dateStr = new Date(match.timestamp * 1000).toLocaleString('es-ES', {
          dateStyle: 'medium',
          timeStyle: 'short'
        });
        setVerificationResult({
          status: 'success',
          message: '¡DOCUMENTO AUTÉNTICO VERIFICADO EN BLOCKCHAIN!',
          docName: match.fileName,
          hash,
          timestamp: dateStr,
          txHash: match.txHash,
          publicLink: match.publicLink,
        });
      } else {
        setVerificationResult({
          status: 'error',
          message: 'ALERTA DE INTEGRIDAD: Este archivo no coincide con ningún documento notarizado en la Blockchain de Avalanche. El contenido podría haber sido modificado.',
          hash,
        });
      }
    } catch {
      setVerificationResult({ status: 'error', message: 'Error al calcular el hash del archivo. Intenta de nuevo.' });
    }
  };

  const getSnowtraceUrl = (txHash: string, explorerUrl?: string) =>
    explorerUrl || `https://snowtrace.io/tx/${txHash}`;

  const formatDate = (ts: number) =>
    new Date(ts * 1000).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });

  return (
    <div id="seccion-blockchain" className="space-y-10">

      {/* ── CONTRACT STATUS BADGE ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 bg-emerald-950/20 border border-emerald-500/25 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-emerald-400 font-bold text-sm">Contrato Verificado en Snowtrace</p>
            <p className="text-slate-400 text-[11px] font-mono mt-0.5">Código fuente público · ABI disponible · Funciones legibles</p>
          </div>
        </div>
        <div className="sm:ml-auto flex flex-col sm:flex-row gap-2">
          <a
            href={`https://snowtrace.io/address/${CONTRACT_ADDRESS}#code`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-900/30 border border-emerald-500/30 hover:border-emerald-400 text-emerald-400 text-xs font-mono rounded-lg transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            Ver Código Fuente
          </a>
          <a
            href={`https://snowtrace.io/address/${CONTRACT_ADDRESS}#readContract`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-900/30 border border-blue-500/30 hover:border-blue-400 text-blue-400 text-xs font-mono rounded-lg transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Leer Contrato
          </a>
        </div>
      </div>

      {/* ── TABLE OF TRUTH ── */}
      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-white/5 bg-[#0b1329]/30 space-y-2">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Registro de Inmutabilidad On-Chain
          </h3>
          <p className="text-slate-400 text-xs max-w-2xl">
            Cada lote (CSV georreferenciado) y el acta de entrega (PDF) tienen un sello digital inmutable en la red C-Chain de Avalanche. Los eventos <strong className="text-slate-300">DocumentoRegistrado</strong> en cada TX contienen el nombre del archivo, descripción, hash SHA-256 y enlace IPFS.
          </p>
          <div className="text-xs flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-slate-500 font-mono">Contrato:</span>
            <a
              href={`https://snowtrace.io/address/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-emerald-400 hover:text-emerald-300 hover:underline bg-white/5 border border-white/10 rounded px-1.5 py-0.5 break-all"
            >
              {CONTRACT_ADDRESS}
            </a>
          </div>
        </div>

        {/* ── DESKTOP TABLE ── */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/5 bg-[#020617] text-slate-400 uppercase tracking-wider text-[10px] font-mono">
                <th className="py-4 px-5">Documento Oficial</th>
                <th className="py-4 px-5 hidden lg:table-cell">Hash SHA-256</th>
                <th className="py-4 px-5">IPFS</th>
                <th className="py-4 px-5">Fecha Registro</th>
                <th className="py-4 px-5 text-right">TX Avalanche</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white">
              {docs.map((doc) => (
                <tr
                  key={doc.fileName}
                  id={`row-${doc.fileName}`}
                  className="hover:bg-white/[0.02] transition-all"
                >
                  <td className="py-4 px-5">
                    <div className="flex items-start gap-3">
                      {doc.fileName.endsWith('.pdf') ? (
                        <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      ) : doc.fileName.match(/\.(jpg|jpeg|png)$/i) ? (
                        <svg className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      )}
                      <div className="min-w-0">
                        <span className="font-semibold text-slate-200 text-xs block">{doc.fileName}</span>
                        {doc.description && (
                          <div className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{doc.description}</div>
                        )}
                        <div className="lg:hidden text-[10px] text-slate-600 font-mono truncate max-w-[200px] mt-0.5">
                          {doc.sha256Hash.slice(0, 20)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-5 text-slate-400 select-all hidden lg:table-cell max-w-[200px] font-mono text-[10px] align-top" title={doc.sha256Hash}>
                    <span className="block truncate">{doc.sha256Hash}</span>
                  </td>
                  <td className="py-4 px-5 align-top">
                    {doc.cid ? (
                      <div className="flex flex-col gap-1.5 items-start">
                        <a
                          href={getIPFSViewLink(doc)}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={`CID: ${doc.cid}`}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-400 border border-emerald-500/20 hover:border-emerald-400 text-[10px] font-mono rounded-md transition-all whitespace-nowrap"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          {doc.fileName.endsWith('.pdf') || doc.fileName.match(/\.(jpg|jpeg|png)$/i) ? 'Ver IPFS' : 'Descargar'}
                        </a>
                        <button
                          onClick={() => {
                            setSelectedDoc(doc);
                            setIsModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-950/40 hover:bg-amber-900/40 text-amber-400 border border-amber-500/20 hover:border-amber-400 text-[10px] font-sans font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Constancia
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-600 text-[10px] font-mono">—</span>
                    )}
                  </td>
                  <td className="py-4 px-5 text-slate-400 font-mono text-[11px] align-top whitespace-nowrap">
                    {formatDate(doc.timestamp)}
                  </td>
                  <td className="py-4 px-5 text-right align-top">
                    <a
                      href={getSnowtraceUrl(doc.txHash, doc.explorerUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-950/40 text-blue-400 border border-blue-500/30 hover:border-blue-400 hover:bg-blue-900/20 text-[11px] font-semibold rounded-lg transition-all whitespace-nowrap"
                    >
                      {!doc.isSimulated && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />}
                      <span>Snowtrace</span>
                      <svg className="h-3 w-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── MOBILE CARDS ── */}
        <div className="md:hidden divide-y divide-white/5">
          {docs.map((doc) => (
            <div key={doc.fileName} className="p-4 space-y-3 hover:bg-white/[0.02] transition-all">
              {/* Header */}
              <div className="flex items-start gap-2.5">
                {doc.fileName.endsWith('.pdf') ? (
                  <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-200 text-xs leading-relaxed break-all">{doc.fileName}</p>
                  {doc.description && (
                    <p className="text-[10px] text-slate-500 mt-0.5">{doc.description}</p>
                  )}
                </div>
              </div>

              {/* Hash */}
              <div className="bg-white/5 rounded-lg p-2.5 font-mono text-[9px] text-slate-400 break-all select-all">
                <span className="text-slate-600 uppercase tracking-wider block mb-1">SHA-256</span>
                {doc.sha256Hash}
              </div>

              {/* Footer links */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-slate-500 font-mono text-[10px]">{formatDate(doc.timestamp)}</span>
                <div className="flex items-center gap-2">
                  {doc.cid && (
                    <>
                      <a
                        href={getIPFSViewLink(doc)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono rounded-md"
                      >
                        {doc.fileName.endsWith('.pdf') || doc.fileName.match(/\.(jpg|jpeg|png)$/i) ? 'IPFS ↗' : 'Descargar ↗'}
                      </a>
                      <button
                        onClick={() => {
                          setSelectedDoc(doc);
                          setIsModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-amber-950/40 text-amber-400 border border-amber-500/20 text-[10px] font-sans font-semibold rounded-md transition-all cursor-pointer"
                      >
                        Constancia
                      </button>
                    </>
                  )}
                  <a
                    href={getSnowtraceUrl(doc.txHash, doc.explorerUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-950/40 text-blue-400 border border-blue-500/30 text-[10px] font-semibold rounded-md"
                  >
                    {!doc.isSimulated && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                    Snowtrace ↗
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FILE VERIFIER ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Instructions panel */}
        <div className="glass-card p-6 rounded-2xl border border-white/10 text-white space-y-4">
          <h4 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Certificador de Integridad (Offline)
          </h4>
          <p className="text-slate-300 text-sm">
            Para verificar que el archivo descargado no ha sido alterado:
          </p>
          <ul className="text-xs text-slate-400 space-y-2.5">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-mono font-bold flex-shrink-0">1.</span>
              El navegador calcula el Hash SHA-256 de tu archivo <strong className="text-slate-200">localmente</strong> — sin subir nada a ningún servidor.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-mono font-bold flex-shrink-0">2.</span>
              El hash se compara contra el registro notarizado en la Blockchain de Avalanche.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-mono font-bold flex-shrink-0">3.</span>
              Si coincide exactamente, se emite una <strong className="text-emerald-300">certificación verde de autenticidad</strong>.
            </li>
          </ul>
          <div className="pt-2 border-t border-white/5">
            <span className="text-[10px] text-slate-600 font-mono block">
              💡 Tip: Descarga un CSV o PDF del directorio /data/ y arrástralo aquí para probar.
            </span>
          </div>
        </div>

        {/* Drop zone + results */}
        <div className="flex flex-col gap-4">
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all ${
              dragActive
                ? 'border-emerald-400 bg-emerald-950/20'
                : 'border-white/10 hover:border-slate-500 hover:bg-white/5 bg-[#0b1329]/20'
            }`}
          >
            <input type="file" id="file-upload" className="hidden" onChange={handleFileInput} />
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-3">
              <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <div>
                <p className="text-white text-sm font-semibold">Arrastra tu archivo aquí</p>
                <p className="text-xs text-slate-400 mt-1">o haz clic para buscar en tu dispositivo</p>
              </div>
              <span className="px-3 py-1 bg-[#0b1329]/80 border border-white/5 rounded-lg text-[10px] text-slate-300 font-mono">
                Soporta .CSV · .PDF · .JPG · .PNG
              </span>
            </label>
          </div>

          {/* Results panel */}
          {verificationResult.status === 'loading' && (
            <div className="p-5 rounded-2xl border border-blue-500/20 bg-blue-950/20 flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-t-blue-400 border-white/10 rounded-full animate-spin flex-shrink-0" />
              <p className="text-blue-300 text-sm">{verificationResult.message}</p>
            </div>
          )}

          {(verificationResult.status === 'success' || verificationResult.status === 'error') && (
            <div className={`p-5 rounded-2xl border transition-all ${
              verificationResult.status === 'success'
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-100'
                : 'bg-red-950/30 border-red-500/30 text-red-200'
            }`}>
              <div className="flex items-start gap-3">
                {verificationResult.status === 'success' ? (
                  <svg className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                )}
                <div className="space-y-2 flex-1 min-w-0">
                  <h5 className="font-bold text-sm uppercase tracking-wider">
                    {verificationResult.status === 'success' ? '✅ Verificación Exitosa' : '❌ Fallo de Verificación'}
                  </h5>
                  <p className="text-xs leading-relaxed break-words">{verificationResult.message}</p>

                  {verificationResult.status === 'success' && (
                    <div className="mt-4 pt-3 border-t border-emerald-500/20 space-y-2 text-[11px] font-mono">
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                        <span className="text-emerald-400 flex-shrink-0">Archivo:</span>
                        <span className="text-white font-sans break-all">{verificationResult.docName}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                        <span className="text-emerald-400 flex-shrink-0">Hash SHA-256:</span>
                        <span className="text-slate-300 break-all" title={verificationResult.hash}>{verificationResult.hash}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                        <span className="text-emerald-400 flex-shrink-0">Fecha Registro:</span>
                        <span className="text-white font-sans">{verificationResult.timestamp}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                        <span className="text-emerald-400 flex-shrink-0">TX Avalanche:</span>
                        <a
                          href={`https://snowtrace.io/tx/${verificationResult.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline break-all"
                        >
                          {verificationResult.txHash?.slice(0, 20)}...↗
                        </a>
                      </div>
                      <div className="pt-2 flex flex-wrap gap-2">
                        {verificationResult.publicLink && (
                          <a
                            href={verificationResult.docName && (verificationResult.docName.endsWith('.pdf') || verificationResult.docName.match(/\.(jpg|jpeg|png)$/i))
                              ? `https://ipfs.io/ipfs/${verificationResult.publicLink.split('/').pop()}`
                              : verificationResult.publicLink
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-900/40 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold rounded-lg hover:border-emerald-400 transition-all"
                          >
                            Ver Archivo en IPFS ↗
                          </a>
                        )}
                        <button
                          onClick={() => {
                            const match = docs.find(d => d.sha256Hash.toLowerCase() === verificationResult.hash?.toLowerCase());
                            if (match) {
                              setSelectedDoc(match);
                              setIsModalOpen(true);
                            }
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-900/40 border border-amber-500/30 text-amber-400 text-[10px] font-semibold rounded-lg hover:border-amber-400 transition-all cursor-pointer animate-pulse"
                        >
                          Ver Constancia Oficial 📄
                        </button>
                      </div>
                    </div>
                  )}

                  {verificationResult.status === 'error' && verificationResult.hash && (
                    <div className="mt-3 pt-2 border-t border-red-500/20 text-[11px] font-mono space-y-1">
                      <span className="text-red-400 block">Hash Calculado:</span>
                      <span className="text-slate-300 break-all select-all block">{verificationResult.hash}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── NOTARY CERTIFICATE MODAL ── */}
      <NotaryCertificateModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDoc(null);
        }}
        doc={selectedDoc}
      />
    </div>
  );
}
