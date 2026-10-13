'use client';

import React, { useState } from 'react';
import { GuestInvite } from '@/types';
import { BookingStore } from '@/lib/store';
import { X, QrCode, CheckCircle, AlertOctagon, Scan, Search } from 'lucide-react';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({ isOpen, onClose }) => {
  const [qrInput, setQrInput] = useState<string>('');
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    invite?: GuestInvite;
    message: string;
  } | null>(null);

  if (!isOpen) return null;

  const invites = BookingStore.getInvites();

  const handleScan = (codeToScan?: string) => {
    const code = codeToScan || qrInput;
    if (!code) return;

    const res = BookingStore.validateGuestInvite(code);
    setScanResult(res);
  };

  const handleReset = () => {
    setQrInput('');
    setScanResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl text-white">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <Scan className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Escáner de Accesos en Conserjería</h2>
              <p className="text-xs text-slate-400">Validación instantánea de QR de visitas y residentes</p>
            </div>
          </div>
          <button
            onClick={() => {
              handleReset();
              onClose();
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scanner Simulation */}
        <div className="p-6 space-y-5">
          {!scanResult ? (
            <>
              {/* Simulated Camera Viewfinder */}
              <div className="relative bg-slate-950 border-2 border-dashed border-emerald-500/50 rounded-2xl h-56 flex flex-col items-center justify-center p-4 text-center overflow-hidden shadow-inner">
                <div className="absolute inset-0 bg-emerald-500/5 animate-pulse" />
                <QrCode className="w-16 h-16 text-emerald-400 mb-2 animate-pulse-subtle" />
                <p className="text-xs font-semibold text-slate-300">Cámara activa lista para escanear</p>
                <p className="text-[11px] text-slate-500 max-w-xs mt-1">
                  Apunta la cámara del dispositivo al código QR del visitante o ingresa el código manual abajo.
                </p>
              </div>

              {/* Manual Entry */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Ingresar Código Manual</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ej. QR-RES101-GUEST-38452119"
                    value={qrInput}
                    onChange={(e) => setQrInput(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                  <button
                    onClick={() => handleScan()}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                  >
                    <Search className="w-4 h-4" />
                    <span>Validar</span>
                  </button>
                </div>
              </div>

              {/* Quick Sample Invitations to click */}
              {invites.length > 0 && (
                <div>
                  <span className="block text-[11px] font-semibold text-slate-400 mb-2">Simular escaneo de invitación activa:</span>
                  <div className="space-y-1.5">
                    {invites.map((inv) => (
                      <button
                        key={inv.id}
                        onClick={() => handleScan(inv.qrCodeData)}
                        className="w-full p-2.5 bg-slate-950/60 hover:bg-slate-800 border border-slate-800 rounded-xl text-left text-xs flex items-center justify-between transition"
                      >
                        <div>
                          <span className="font-bold text-slate-200">{inv.guestName}</span>
                          <span className="text-slate-400 text-[11px] ml-2">(DNI: {inv.guestDni} • Dpto {inv.apartment})</span>
                        </div>
                        <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          Escanear QR
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Result Screen */
            <div className="space-y-4">
              <div
                className={`p-6 rounded-2xl border text-center flex flex-col items-center space-y-3 ${
                  scanResult.success
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200'
                    : 'bg-rose-500/10 border-rose-500/40 text-rose-200'
                }`}
              >
                {scanResult.success ? (
                  <CheckCircle className="w-16 h-16 text-emerald-400" />
                ) : (
                  <AlertOctagon className="w-16 h-16 text-rose-400" />
                )}

                <div className="space-y-1">
                  <h3 className="font-extrabold text-xl">
                    {scanResult.success ? '¡ACCESO PERMITIDO!' : 'ACCESO RECHAZADO'}
                  </h3>
                  <p className="text-xs opacity-90">{scanResult.message}</p>
                </div>

                {scanResult.invite && (
                  <div className="w-full bg-slate-950/80 p-3 rounded-xl border border-white/10 text-left text-xs space-y-1 mt-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Invitado/a:</span>
                      <span className="font-bold text-white">{scanResult.invite.guestName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">DNI:</span>
                      <span className="font-semibold text-white">{scanResult.invite.guestDni}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Autorizado por:</span>
                      <span className="font-bold text-sky-400">Dpto {scanResult.invite.apartment} ({scanResult.invite.residentName})</span>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleReset}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition"
              >
                Escanear Otro Código
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
