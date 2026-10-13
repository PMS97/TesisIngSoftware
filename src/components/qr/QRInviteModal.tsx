'use client';

import React, { useState, useEffect } from 'react';
import { Booking, GuestInvite, User } from '@/types';
import { BookingStore } from '@/lib/store';
import QRCode from 'qrcode';
import { X, QrCode, UserPlus, Download, CheckCircle2, ShieldCheck } from 'lucide-react';

interface QRInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  bookings: Booking[];
}

export const QRInviteModal: React.FC<QRInviteModalProps> = ({
  isOpen,
  onClose,
  user,
  bookings,
}) => {
  const activeBookings = bookings.filter(
    (b) => b.status === 'CONFIRMED' || b.status === 'CHECKED_IN'
  );

  const [selectedBookingId, setSelectedBookingId] = useState<string>(
    activeBookings[0]?.id || ''
  );
  const [guestName, setGuestName] = useState<string>('');
  const [guestDni, setGuestDni] = useState<string>('');
  const [generatedInvite, setGeneratedInvite] = useState<GuestInvite | null>(null);
  const [qrImageUrl, setQrImageUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (activeBookings.length > 0 && !selectedBookingId) {
      setSelectedBookingId(activeBookings[0].id);
    }
  }, [activeBookings, selectedBookingId]);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !guestDni || !selectedBookingId) return;

    setLoading(true);
    try {
      const invite = await BookingStore.createGuestInvite(
        selectedBookingId,
        guestName,
        guestDni
      );

      // Generate Data URL for QR Code
      const url = await QRCode.toDataURL(invite.qrCodeData, { width: 300, margin: 2 });
      setQrImageUrl(url);
      setGeneratedInvite(invite);
    } catch (err: any) {
      alert(err.message || 'Error al generar invitacion');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setGeneratedInvite(null);
    setGuestName('');
    setGuestDni('');
    setQrImageUrl('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl text-white">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Generar Pase QR para Visitas</h2>
              <p className="text-xs text-slate-400">Acceso rápido e instantáneo por Conserjería</p>
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

        {/* Content */}
        <div className="p-6">
          {!generatedInvite ? (
            <form onSubmit={handleGenerate} className="space-y-4">
              {activeBookings.length === 0 ? (
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-300 text-xs text-center">
                  ⚠️ No tienes reservas activas confirmadas para vincular invitaciones. Realiza una reserva primero.
                </div>
              ) : (
                <>
                  {/* Select Linked Booking */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Vincular a Reserva</label>
                    <select
                      value={selectedBookingId}
                      onChange={(e) => setSelectedBookingId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    >
                      {activeBookings.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.amenityName} - {b.date} ({b.shiftLabel})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Guest Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Nombre Completo de la Visita</label>
                    <input
                      type="text"
                      placeholder="Ej. Lucía Fernández"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>

                  {/* Guest DNI */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">DNI / Documento de Identidad</label>
                    <input
                      type="text"
                      placeholder="Ej. 38.452.119"
                      value={guestDni}
                      onChange={(e) => setGuestDni(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 py-3 px-5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition flex items-center justify-center space-x-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>{loading ? 'Generando Pase...' : 'Generar Pase de Acceso QR'}</span>
                  </button>
                </>
              )}
            </form>
          ) : (
            /* Digital QR Pass Result */
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-white rounded-2xl shadow-xl border-4 border-emerald-500/30">
                {qrImageUrl && <img src={qrImageUrl} alt="QR Code Visita" className="w-52 h-52 object-contain" />}
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center justify-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> Pase Válido de Visita
                </span>
                <h3 className="font-bold text-lg text-white">{generatedInvite.guestName}</h3>
                <p className="text-xs text-slate-400">DNI: {generatedInvite.guestDni} • Referido por Dpto {generatedInvite.apartment}</p>
                <p className="text-[11px] text-slate-500 font-mono mt-1">Código: {generatedInvite.qrCodeData}</p>
              </div>

              <div className="w-full flex gap-2 pt-2">
                <a
                  href={qrImageUrl}
                  download={`Pase_QR_${generatedInvite.guestName.replace(/\s+/g, '_')}.png`}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 transition flex items-center justify-center space-x-2"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Guardar QR</span>
                </a>
                <button
                  onClick={handleReset}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition"
                >
                  Crear Otro
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
