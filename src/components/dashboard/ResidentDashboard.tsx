'use client';

import React from 'react';
import { Booking, User } from '@/types';
import { BookingStore, getTodayDateString } from '@/lib/store';
import { CheckInBanner } from '@/components/checkin/CheckInBanner';
import { AmenityCalendar } from '@/components/calendar/AmenityCalendar';
import { Calendar, QrCode, Plus, CheckCircle2, Clock, Trash2, Camera, AlertOctagon, Flame } from 'lucide-react';

interface ResidentDashboardProps {
  user: User;
  bookings: Booking[];
  onOpenBookingModal: (amenityId?: string, date?: string) => void;
  onOpenQRModal: () => void;
  onOpenPhotosModal: (booking: Booking) => void;
  onCheckIn: (bookingId: string) => void;
  onCancelBooking: (bookingId: string) => void;
}

export const ResidentDashboard: React.FC<ResidentDashboardProps> = ({
  user,
  bookings,
  onOpenBookingModal,
  onOpenQRModal,
  onOpenPhotosModal,
  onCheckIn,
  onCancelBooking,
}) => {
  const today = getTodayDateString();
  const myBookings = bookings.filter((b) => b.userId === user.id);
  const weeklyCount = BookingStore.getWeeklyCount(user.apartment, today);
  const activePenalty = BookingStore.getUserActivePenalty(user.id);

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-3">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-12 h-12 rounded-2xl object-cover border-2 border-sky-500 shadow-md"
            />
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span>¡Hola, {user.name}!</span>
                {activePenalty && (
                  <span className="text-xs bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2.5 py-0.5 rounded-full font-bold">
                    ⚠️ Sancionado
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400">Departamento {user.apartment} • Mirador Plaza</p>
            </div>
          </div>

          {/* Quota Progress Bar */}
          <div className="mt-4 flex items-center space-x-4">
            <div className="space-y-1 min-w-48">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-semibold">Reservas gratuitas esta semana:</span>
                <span className="font-bold text-sky-400">
                  {weeklyCount} / {activePenalty?.type === 'QUOTA_REDUCTION' ? 1 : 3}
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    weeklyCount >= (activePenalty?.type === 'QUOTA_REDUCTION' ? 1 : 3) ? 'bg-amber-500' : 'bg-sky-500'
                  }`}
                  style={{
                    width: `${Math.min((weeklyCount / (activePenalty?.type === 'QUOTA_REDUCTION' ? 1 : 3)) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => onOpenBookingModal()}
            disabled={activePenalty?.type === 'SUSPENSION'}
            className={`flex-1 md:flex-none px-5 py-3 font-bold text-xs rounded-2xl transition flex items-center justify-center space-x-2 ${
              activePenalty?.type === 'SUSPENSION'
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-sky-500 hover:bg-sky-400 text-white shadow-lg shadow-sky-500/20'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Reserva</span>
          </button>

          <button
            onClick={onOpenQRModal}
            className="flex-1 md:flex-none px-5 py-3 bg-slate-800 hover:bg-slate-700 text-emerald-300 font-bold text-xs rounded-2xl border border-slate-700 transition flex items-center justify-center space-x-2"
          >
            <QrCode className="w-4 h-4" />
            <span>Pase QR para Visitas</span>
          </button>
        </div>
      </div>

      {/* ACTIVE SANCTION WARNING CARD */}
      {activePenalty && (
        <div className="bg-rose-950/40 border border-rose-500/50 rounded-3xl p-5 text-rose-200 shadow-xl flex items-start space-x-4">
          <div className="p-3 bg-rose-500/20 text-rose-400 rounded-2xl border border-rose-500/30 shrink-0">
            <AlertOctagon className="w-7 h-7" />
          </div>
          <div className="space-y-1 text-xs">
            <div className="font-extrabold text-sm text-rose-100 flex items-center gap-2">
              <span>SANCIÓN EMITIDA POR LA ADMINISTRACIÓN</span>
              <span className="bg-rose-500 text-slate-950 px-2 py-0.5 rounded text-[10px] uppercase font-bold">
                {activePenalty.type}
              </span>
            </div>
            <p className="font-semibold text-rose-200">{activePenalty.typeLabel}</p>
            <p className="text-rose-300/90">Motivo registrado: "{activePenalty.reason}"</p>
            <p className="text-[11px] text-rose-400 font-mono">Vigencia hasta: {activePenalty.endDate}</p>
          </div>
        </div>
      )}

      {/* Active Check-in Banner */}
      <CheckInBanner bookings={myBookings} onCheckIn={onCheckIn} />

      {/* Resident My Bookings List */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-sky-400" />
          <span>Mis Reservas Registradas</span>
        </h3>

        {myBookings.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs font-mono">
            No posees reservas registradas actualmente.
          </div>
        ) : (
          <div className="space-y-3">
            {myBookings.map((b) => (
              <div
                key={b.id}
                className="bg-slate-950 border border-slate-800/80 p-4 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs hover:border-slate-700 transition"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-white">{b.amenityName}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                      {b.shiftLabel}
                    </span>
                    {b.useGrill && (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-orange-500/20 text-orange-300 font-bold">
                        🔥 Parrilla
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 mt-1">
                    Fecha: <span className="text-slate-200 font-semibold">{b.date}</span> • ID Reserva: <span className="font-mono text-slate-400">{b.id}</span>
                  </p>
                </div>

                {/* Status & Actions */}
                <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end">
                  <div>
                    {b.status === 'CONFIRMED' && (
                      <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                        ✓ Confirmada
                      </span>
                    )}
                    {b.status === 'PENDING_GUARD' && (
                      <span className="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                        ⏳ Pendiente Guardia (+3 sem)
                      </span>
                    )}
                    {b.status === 'CHECKED_IN' && (
                      <span className="px-2.5 py-1 rounded-xl bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Checked-In
                      </span>
                    )}
                    {b.status === 'NO_SHOW' && (
                      <span className="px-2.5 py-1 rounded-xl bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                        🚫 NO-SHOW (Liberada)
                      </span>
                    )}
                    {b.status === 'REVOKED_ADMIN' && (
                      <span className="px-2.5 py-1 rounded-xl bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                        ❌ Revocada por Admin
                      </span>
                    )}
                    {b.status === 'CANCELLED_RESIDENT' && (
                      <span className="px-2.5 py-1 rounded-xl bg-slate-800 text-slate-400 font-bold">
                        Cancelada
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => onOpenPhotosModal(b)}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition"
                    title="Subir/Revisar fotos en Google Drive"
                  >
                    <Camera className="w-4 h-4" />
                  </button>

                  {(b.status === 'CONFIRMED' || b.status === 'PENDING_GUARD') && (
                    <button
                      onClick={() => onCancelBooking(b.id)}
                      className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-semibold rounded-xl border border-rose-500/30 transition flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Cancelar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AmenityCalendar
        bookings={bookings}
        onOpenBookingModal={onOpenBookingModal}
        onOpenPhotos={onOpenPhotosModal}
      />
    </div>
  );
};
