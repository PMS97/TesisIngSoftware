'use client';

import React, { useState } from 'react';
import { Amenity, ShiftType, User } from '@/types';
import { BookingStore, getShiftInfo, getTodayDateString } from '@/lib/store';
import { X, Calendar, Clock, Flame, Info, AlertTriangle, Sparkles, Check } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSuccess: (msg: string) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  user,
  onSuccess,
}) => {
  const amenities = BookingStore.getAmenities();
  const today = getTodayDateString();

  const [selectedAmenityId, setSelectedAmenityId] = useState<string>(amenities[0].id);
  const [date, setDate] = useState<string>(today);
  const [shift, setShift] = useState<ShiftType>('NIGHT');
  const [useGrill, setUseGrill] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedAmenity = amenities.find((a) => a.id === selectedAmenityId) || amenities[0];
  const weeklyCount = BookingStore.getWeeklyCount(user.apartment, date);
  const isOverQuota = weeklyCount >= 3;
  const isSlotTaken = BookingStore.isSlotOccupied(selectedAmenityId, date, shift);
  const shiftInfo = getShiftInfo(date, shift);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await BookingStore.createBooking({
        amenityId: selectedAmenityId,
        userId: user.id,
        date,
        shift,
        useGrill: selectedAmenity.hasGrill ? useGrill : false,
      });

      onSuccess(res.message);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al procesar la reserva.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl text-white overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-sky-500/20 text-sky-400 rounded-xl">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Nueva Reserva de Amenity</h2>
              <p className="text-xs text-slate-400">Edificio Mirador Plaza • Dpto {user.apartment}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {error && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Weekly Quota Status Pill */}
          <div className={`p-3.5 rounded-2xl border text-xs flex items-start space-x-3 ${
            isOverQuota
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              : 'bg-sky-500/10 border-sky-500/30 text-sky-300'
          }`}>
            <div className="mt-0.5">
              {isOverQuota ? <AlertTriangle className="w-4 h-4" /> : <Info className="w-4 h-4" />}
            </div>
            <div>
              <div className="font-semibold flex items-center gap-2">
                <span>Cupo Semanal Dpto {user.apartment}:</span>
                <span className="font-bold bg-slate-900/60 px-2 py-0.5 rounded-md border border-white/10">
                  {weeklyCount} de 3 reservas directas usadas
                </span>
              </div>
              <p className="mt-1 text-[11px] opacity-90 leading-relaxed">
                {isOverQuota
                  ? '⚠️ Has alcanzado el límite semanal de 3 reservas. Esta 4ta solicitud requerirá aprobación explícita del Guardia de turno.'
                  : '✓ Reserva directa e inmediata. No requiere aprobación previa.'}
              </p>
            </div>
          </div>

          {/* Amenity Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Seleccionar Amenity</label>
            <div className="grid grid-cols-2 gap-2">
              {amenities.map((a) => (
                <button
                  type="button"
                  key={a.id}
                  onClick={() => setSelectedAmenityId(a.id)}
                  className={`p-3 rounded-2xl text-left border transition flex flex-col justify-between ${
                    selectedAmenityId === a.id
                      ? 'bg-sky-500/20 border-sky-500 text-white shadow-md'
                      : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs">{a.name}</span>
                    {selectedAmenityId === a.id && <Check className="w-4 h-4 text-sky-400" />}
                  </div>
                  <span className="text-[10px] text-slate-400">Cap. Máx: {a.maxCapacity} pers.</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Fecha de la Reserva</label>
            <input
              type="date"
              min={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500 transition"
              required
            />
          </div>

          {/* Shift Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Turno Horario</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShift('LUNCH')}
                className={`p-3 rounded-xl border text-xs text-left transition ${
                  shift === 'LUNCH'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-200 font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-slate-200">☀️ Turno Almuerzo</div>
                <div className="text-[11px] text-slate-400 mt-1">12:00 hs a 18:00 hs</div>
                <div className="text-[10px] text-amber-400/80 mt-1">Check-in Web obligatorio</div>
              </button>

              <button
                type="button"
                onClick={() => setShift('NIGHT')}
                className={`p-3 rounded-xl border text-xs text-left transition ${
                  shift === 'NIGHT'
                    ? 'bg-indigo-500/20 border-indigo-500 text-indigo-200 font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-slate-200">🌙 Turno Noche</div>
                <div className="text-[11px] text-slate-400 mt-1">19:00 hs en adelante</div>
                <div className="text-[10px] text-indigo-400/80 mt-1">Hasta 03:00 am en fines de semana</div>
              </button>
            </div>
          </div>

          {/* Grill Option Checkbox */}
          {selectedAmenity.hasGrill && (
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-500/20 text-orange-400 rounded-lg">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <label htmlFor="useGrill" className="text-xs font-semibold text-white block cursor-pointer">
                    ¿Utilizarás la Parrilla / Asador?
                  </label>
                  <span className="text-[11px] text-slate-400">Notifica al conserje para habilitar insumos</span>
                </div>
              </div>
              <input
                id="useGrill"
                type="checkbox"
                checked={useGrill}
                onChange={(e) => setUseGrill(e.target.checked)}
                className="w-5 h-5 accent-sky-500 rounded cursor-pointer"
              />
            </div>
          )}

          {/* Slot Taken Warning */}
          {isSlotTaken && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-medium text-center">
              🚫 El turno seleccionado ya se encuentra Ocupado. Elige otra fecha o turno.
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSlotTaken || loading}
              className={`w-full py-3 px-5 rounded-xl font-bold text-xs transition shadow-lg flex items-center justify-center space-x-2 ${
                isSlotTaken || loading
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : isOverQuota
                  ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20'
                  : 'bg-sky-500 hover:bg-sky-400 text-white shadow-sky-500/20'
              }`}
            >
              {loading ? (
                <span>Sincronizando con Google Calendar & Drive...</span>
              ) : isOverQuota ? (
                <span>Enviar Solicitud a Guardia (4ta reserva)</span>
              ) : (
                <span>Confirmar Reserva Inmediata</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
