'use client';

import React from 'react';
import { Booking } from '@/types';
import { Clock, CheckCircle, ShieldAlert, Sparkles, Sun, Moon } from 'lucide-react';

interface CheckInBannerProps {
  bookings: Booking[];
  onCheckIn: (bookingId: string) => void;
}

export const CheckInBanner: React.FC<CheckInBannerProps> = ({ bookings, onCheckIn }) => {
  // Filter bookings that are CONFIRMED and need checkin
  const activeBookings = bookings.filter(
    (b) => b.status === 'CONFIRMED' && !b.checkedInAt
  );

  if (activeBookings.length === 0) return null;

  return (
    <div className="mb-6 space-y-3">
      {activeBookings.map((booking) => {
        const isLunch = booking.shift === 'LUNCH';
        return (
          <div
            key={booking.id}
            className="bg-gradient-to-r from-sky-900/90 via-slate-900 to-indigo-900 border border-sky-500/40 rounded-2xl p-5 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden"
          >
            {/* Ambient Background Blur */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-xl shadow-lg mt-0.5 ${isLunch ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'}`}>
                {isLunch ? <Sun className="w-6 h-6 animate-pulse" /> : <Moon className="w-6 h-6 animate-pulse" />}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-base text-white">{booking.amenityName}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    {booking.shiftLabel}
                  </span>
                  {booking.useGrill && (
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-orange-500/20 text-orange-300 font-semibold border border-orange-500/30">
                      🔥 Parrilla Incluida
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-sky-400" />
                  <span>Ventana de Check-in activa (Tienes 30 minutos desde el inicio).</span>
                </p>
                {isLunch && (
                  <p className="text-[11px] text-amber-300/90 mt-0.5 font-medium">
                    ⚠️ Turno Mediodía: Sin guardia en conserjería. Debes hacer <b>Check-in Web</b> en este botón para evitar la liberación por NO-SHOW.
                  </p>
                )}
              </div>
            </div>

            {/* Action Button */}
            <div className="w-full md:w-auto flex items-center gap-3">
              <button
                onClick={() => onCheckIn(booking.id)}
                className="w-full md:w-auto px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 flex items-center justify-center space-x-2 transition transform active:scale-95"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Confirmar Asistencia (Check-in Web)</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
