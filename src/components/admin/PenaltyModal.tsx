'use client';

import React, { useState } from 'react';
import { PenaltyType, User } from '@/types';
import { BookingStore } from '@/lib/store';
import { X, ShieldAlert, AlertTriangle, Gavel } from 'lucide-react';

interface PenaltyModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  onSaved: () => void;
}

export const PenaltyModal: React.FC<PenaltyModalProps> = ({
  isOpen,
  onClose,
  users,
  onSaved,
}) => {
  const residents = users.filter((u) => u.role === 'RESIDENT');

  const [selectedUserId, setSelectedUserId] = useState<string>(residents[0]?.id || '');
  const [reason, setReason] = useState<string>('');
  const [type, setType] = useState<PenaltyType>('SUSPENSION');
  const [durationDays, setDurationDays] = useState<number>(14);
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !reason) return;

    setLoading(true);
    try {
      await BookingStore.issuePenalty({
        userId: selectedUserId,
        reason,
        type,
        durationDays: Number(durationDays),
      });

      onSaved();
      onClose();
    } catch (err: any) {
      alert(err.message || 'Error al aplicar sanción');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl text-white">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-rose-950/30">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-rose-500/20 text-rose-400 rounded-xl">
              <Gavel className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Emitir Penalidad / Sanción</h2>
              <p className="text-xs text-slate-400">Aplicación del reglamento interno del consorcio</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              La sanción emitida se registrará en la base de datos, bloqueará o limitará las reservas del residente y le enviará una notificación formal por <b>Gmail</b>.
            </span>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Seleccionar Residente / Departamento</label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-rose-500 font-bold"
            >
              {residents.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} (Dpto {r.apartment}) - {r.email}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Tipo de Sanción</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType('SUSPENSION')}
                className={`p-3 rounded-xl border text-left transition ${
                  type === 'SUSPENSION'
                    ? 'bg-rose-500/20 border-rose-500 text-rose-200 font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <div className="font-bold">⛔ Suspensión Total</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Bloquea todas las reservas durante el período</div>
              </button>

              <button
                type="button"
                onClick={() => setType('QUOTA_REDUCTION')}
                className={`p-3 rounded-xl border text-left transition ${
                  type === 'QUOTA_REDUCTION'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-200 font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <div className="font-bold">📉 Reducción de Cupo</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Reduce límite a solo 1 reserva por semana</div>
              </button>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Duración de la Sanción</label>
            <select
              value={durationDays}
              onChange={(e) => setDurationDays(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-rose-500"
            >
              <option value={7}>7 Días (1 Semana)</option>
              <option value={14}>14 Días (2 Semanas)</option>
              <option value={30}>30 Días (1 Mes)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Motivo / Justificación Formal</label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ej. Dejar el quincho sucio tras evento el fin de semana sin cargar foto final de limpieza."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-rose-500"
              required
            />
          </div>

          <div className="pt-2 flex gap-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-slate-800 text-slate-300 font-bold rounded-xl">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !reason}
              className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl shadow flex items-center justify-center gap-1.5"
            >
              <Gavel className="w-4 h-4" /> {loading ? 'Aplicando...' : 'Confirmar Sanción'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
