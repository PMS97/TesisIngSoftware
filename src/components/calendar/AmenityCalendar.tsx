'use client';

import React, { useState } from 'react';
import { Amenity, Booking, ShiftType } from '@/types';
import { BookingStore, getShiftInfo, getTodayDateString } from '@/lib/store';
import { Calendar, Sun, Moon, Flame, Users, CheckCircle2, Lock, Plus, MapPin } from 'lucide-react';

interface AmenityCalendarProps {
  bookings: Booking[];
  onOpenBookingModal: (amenityId?: string, date?: string, shift?: ShiftType) => void;
  onOpenPhotos: (booking: Booking) => void;
}

export const AmenityCalendar: React.FC<AmenityCalendarProps> = ({
  bookings,
  onOpenBookingModal,
  onOpenPhotos,
}) => {
  const amenities = BookingStore.getAmenities();
  const today = getTodayDateString();
  const [selectedDate, setSelectedDate] = useState<string>(today);

  // Generate next 7 days for quick date selector
  const daysList = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('es-ES', { weekday: 'short' });
    const dayNum = d.getDate();
    return { dateStr, dayName, dayNum };
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      {/* Calendar Header & Date Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-sky-400" />
            <span>Disponibilidad en Tiempo Real</span>
          </h2>
          <p className="text-xs text-slate-400">Sincronizado con los calendarios de Google Calendar del edificio</p>
        </div>

        {/* 7-Day Quick Picker */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
          {daysList.map(({ dateStr, dayName, dayNum }) => {
            const isSelected = selectedDate === dateStr;
            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(dateStr)}
                className={`px-3 py-2 rounded-2xl flex flex-col items-center min-w-14 border text-xs transition ${
                  isSelected
                    ? 'bg-sky-500 border-sky-400 text-white font-bold shadow-lg shadow-sky-500/20'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <span className="uppercase text-[10px] opacity-80">{dayName}</span>
                <span className="text-sm font-extrabold">{dayNum}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Amenities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {amenities.map((amenity) => {
          const lunchShift = getShiftInfo(selectedDate, 'LUNCH');
          const nightShift = getShiftInfo(selectedDate, 'NIGHT');

          const lunchBooking = bookings.find(
            (b) =>
              b.amenityId === amenity.id &&
              b.date === selectedDate &&
              b.shift === 'LUNCH' &&
              b.status !== 'CANCELLED_RESIDENT' &&
              b.status !== 'REVOKED_ADMIN' &&
              b.status !== 'NO_SHOW'
          );

          const nightBooking = bookings.find(
            (b) =>
              b.amenityId === amenity.id &&
              b.date === selectedDate &&
              b.shift === 'NIGHT' &&
              b.status !== 'CANCELLED_RESIDENT' &&
              b.status !== 'REVOKED_ADMIN' &&
              b.status !== 'NO_SHOW'
          );

          return (
            <div
              key={amenity.id}
              className="bg-slate-950 border border-slate-800/80 hover:border-slate-700 rounded-3xl overflow-hidden transition flex flex-col justify-between shadow-lg"
            >
              {/* Image & Header */}
              <div className="relative h-40 overflow-hidden">
                <img
                  src={amenity.image}
                  alt={amenity.name}
                  className="w-full h-full object-cover brightness-75 hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-[11px] bg-slate-900/80 backdrop-blur-md border border-slate-700 text-slate-200 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                    <Users className="w-3 h-3 text-sky-400" /> Max {amenity.maxCapacity} pers.
                  </span>
                  {amenity.hasGrill && (
                    <span className="text-[11px] bg-orange-500/80 backdrop-blur-md text-white font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
                      <Flame className="w-3 h-3" /> Parrilla
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 left-4">
                  <h3 className="font-bold text-lg text-white drop-shadow">{amenity.name}</h3>
                  <p className="text-xs text-slate-300 flex items-center gap-1 drop-shadow">
                    <MapPin className="w-3 h-3 text-sky-400" /> {amenity.location}
                  </p>
                </div>
              </div>

              {/* Shifts Card */}
              <div className="p-4 space-y-3 flex-1">
                {/* LUNCH SHIFT */}
                <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-amber-500/20 text-amber-300 rounded-xl">
                      <Sun className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-slate-200">{lunchShift.label}</div>
                      {lunchBooking ? (
                        <div className="text-[11px] text-amber-400 font-medium">
                          Reservado por <b>{lunchBooking.userName}</b> (Dpto {lunchBooking.apartment})
                          {lunchBooking.useGrill && ' 🔥'}
                        </div>
                      ) : (
                        <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Horario Disponible
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    {lunchBooking ? (
                      <button
                        onClick={() => onOpenPhotos(lunchBooking)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold rounded-xl border border-slate-700 transition"
                      >
                        Fotos
                      </button>
                    ) : (
                      <button
                        onClick={() => onOpenBookingModal(amenity.id, selectedDate, 'LUNCH')}
                        className="px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Reservar
                      </button>
                    )}
                  </div>
                </div>

                {/* NIGHT SHIFT */}
                <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-500/20 text-indigo-300 rounded-xl">
                      <Moon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-slate-200">{nightShift.label}</div>
                      {nightBooking ? (
                        <div className="text-[11px] text-indigo-300 font-medium">
                          Reservado por <b>{nightBooking.userName}</b> (Dpto {nightBooking.apartment})
                          {nightBooking.useGrill && ' 🔥'}
                        </div>
                      ) : (
                        <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Horario Disponible
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    {nightBooking ? (
                      <button
                        onClick={() => onOpenPhotos(nightBooking)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold rounded-xl border border-slate-700 transition"
                      >
                        Fotos
                      </button>
                    ) : (
                      <button
                        onClick={() => onOpenBookingModal(amenity.id, selectedDate, 'NIGHT')}
                        className="px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Reservar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
