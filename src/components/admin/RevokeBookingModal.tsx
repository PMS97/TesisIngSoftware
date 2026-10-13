'use client';

import React, { useState } from 'react';
import { Booking } from '@/types';
import { BookingStore } from '@/lib/store';
import { X, ShieldAlert, AlertTriangle } from 'lucide-react';

interface RevokeBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onUpdated: () => void;
}

export const RevokeBookingModal: React.FC<RevokeBookingModalProps> = ({
  isOpen,
  onClose,
  booking,
  onUpdated,
}) => {
  const [reason, setReason] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen || !booking) return null;

  const handleRevoke = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) return;

    setLoading(true);
    try {
      await BookingStore.revokeByAdmin(booking.id, reason);
      onUpdated();
      onClose();
    } catch (err: any) {
      alert(err.message || 'Error al revocar reserva');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl text-white">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-rose-950/20">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-rose-500/20 text-rose-400 rounded-xl">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Revocar Reserva (Administrador)</h2>
              <p className="text-xs text-slate-400">Reserva {booking.id} • Dpto {booking.apartment}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleRevoke} className="p-6 space-y-4">
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              La revocación eliminará el evento del <b>Google Calendar</b> del edificio y enviará un correo automático vía <b>Gmail</b> al residente ({booking.userEmail}).
            </span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
            <div><span className="text-slate-400">Amenity:</span> <span className="font-bold text-white">{booking.amenityName}</span></div>
            <div><span className="text-slate-400">Fecha y Turno:</span> <span className="text-white">{booking.date} ({booking.shiftLabel})</span></div>
            <div><span className="text-slate-400">Titular:</span> <span className="text-sky-400">{booking.userName} (Dpto {booking.apartment})</span></div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Motivo o Justificación de la Revocación
            </label>
            <textarea
              rows={3}
              placeholder="Ej. Mantenimiento programado de urgencia en el sector de parrillas."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500"
              required
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !reason}
              className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-600/20 transition"
            >
              {loading ? 'Revocando...' : 'Confirmar Revocación'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
