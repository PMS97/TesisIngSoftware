'use client';

import React from 'react';
import { Booking, User, VisitorAccessLog } from '@/types';
import { BookingStore } from '@/lib/store';
import { ShieldCheck, Scan, CheckCircle2, XCircle, Camera, Flame, Sun, Moon, Clock, UserCheck, History, ShieldAlert } from 'lucide-react';

interface GuardDashboardProps {
  user: User;
  bookings: Booking[];
  onOpenQRScanner: () => void;
  onApproveException: (bookingId: string) => void;
  onRejectException: (bookingId: string) => void;
  onCheckIn: (bookingId: string) => void;
  onOpenPhotosModal: (booking: Booking) => void;
}

export const GuardDashboard: React.FC<GuardDashboardProps> = ({
  user,
  bookings,
  onOpenQRScanner,
  onApproveException,
  onRejectException,
  onCheckIn,
  onOpenPhotosModal,
}) => {
  const pendingExceptions = bookings.filter((b) => b.status === 'PENDING_GUARD');
  const activeBookings = bookings.filter(
    (b) => b.status === 'CONFIRMED' || b.status === 'CHECKED_IN'
  );
  const visitorLogs: VisitorAccessLog[] = BookingStore.getVisitorLogs();

  return (
    <div className="space-y-6">
      {/* Concierge Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border border-emerald-500/40 rounded-3xl p-6 shadow-xl text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl text-emerald-400 shadow-inner">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Conserjería & Control de Accesos</h2>
            <p className="text-xs text-slate-400">Puesto de Guardia activo • Verificación QR con caducidad e historial de visitas</p>
          </div>
        </div>

        {/* QR Scanner Action Button */}
        <button
          onClick={onOpenQRScanner}
          className="w-full md:w-auto px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs rounded-2xl shadow-xl shadow-emerald-500/20 flex items-center justify-center space-x-2 transition transform active:scale-95 animate-pulse-subtle"
        >
          <Scan className="w-5 h-5" />
          <span>Abrir Escáner de Visitas (QR)</span>
        </button>
      </div>

      {/* Pending Weekly Quota Exception Requests (>3 bookings/week) */}
      {pendingExceptions.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-3xl p-6 shadow-xl text-amber-200 space-y-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-amber-400 animate-pulse" />
            <h3 className="font-bold text-base text-amber-300">
              Solicitudes Excepcionales Pendientes de Aprobación ({pendingExceptions.length})
            </h3>
          </div>
          <p className="text-xs text-amber-200/80">
            Los siguientes residentes superaron su cupo de 3 reservas gratuitas semanales y solicitaron un turno adicional.
          </p>

          <div className="space-y-3">
            {pendingExceptions.map((b) => (
              <div
                key={b.id}
                className="bg-slate-900 border border-amber-500/30 p-4 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs"
              >
                <div>
                  <div className="font-bold text-sm text-white">
                    {b.userName} <span className="text-sky-400">(Dpto {b.apartment})</span>
                  </div>
                  <div className="text-slate-300 mt-1">
                    Amenity: <b>{b.amenityName}</b> • Fecha: <b>{b.date}</b> ({b.shiftLabel})
                  </div>
                  {b.useGrill && (
                    <span className="inline-block mt-1 text-[10px] bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded font-semibold">
                      🔥 Solicita uso de Parrilla
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2 w-full md:w-auto">
                  <button
                    onClick={() => onApproveException(b.id)}
                    className="flex-1 md:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow transition flex items-center gap-1 justify-center"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Aprobar Excepción
                  </button>
                  <button
                    onClick={() => onRejectException(b.id)}
                    className="flex-1 md:flex-none px-4 py-2 bg-rose-600/80 hover:bg-rose-500 text-white font-bold rounded-xl shadow transition flex items-center gap-1 justify-center"
                  >
                    <XCircle className="w-4 h-4" /> Rechazar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bitácora de Accesos de Visitas (Historial del Día) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <History className="w-4 h-4 text-emerald-400" />
          <span>Bitácora de Registro de Visitas Asentadas ({visitorLogs.length})</span>
        </h3>

        {visitorLogs.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs font-mono">
            No hay registros de ingresos de visitas en la bitácora del día.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-950/50">
                  <th className="p-3">Hora / Fecha</th>
                  <th className="p-3">Visitante</th>
                  <th className="p-3">DNI</th>
                  <th className="p-3">Autorizado Por</th>
                  <th className="p-3">Resultado Validación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {visitorLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-950/40 transition">
                    <td className="p-3 font-mono text-slate-400">
                      <span className="font-bold text-white">{log.entryTimestamp}</span>
                      <span className="text-[10px] block text-slate-500">{log.date}</span>
                    </td>
                    <td className="p-3 font-bold text-white">{log.guestName}</td>
                    <td className="p-3 font-mono text-slate-300">{log.guestDni}</td>
                    <td className="p-3">
                      <span className="font-bold text-sky-400">Dpto {log.apartment}</span>
                      <span className="text-[11px] block text-slate-400">({log.residentName})</span>
                    </td>
                    <td className="p-3">
                      {log.status === 'PERMITTED' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          ✓ Acceso Permitido
                        </span>
                      )}
                      {log.status === 'DENIED_EXPIRED' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          🔴 QR Caducado
                        </span>
                      )}
                      {log.status === 'DENIED_REUSED' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          ⚠️ Reentrada Denegada
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Active Bookings Concierge Checklist */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-emerald-400" />
          <span>Control de Ingresos y Entregas de Amenities</span>
        </h3>

        {activeBookings.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs font-mono">
            No hay reservas confirmadas o activas para el día de hoy.
          </div>
        ) : (
          <div className="space-y-3">
            {activeBookings.map((b) => (
              <div
                key={b.id}
                className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs hover:border-slate-700 transition"
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
                    Titular: <b className="text-white">{b.userName}</b> (Dpto <b className="text-sky-400">{b.apartment}</b>) • Fecha: {b.date}
                  </p>
                </div>

                <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end">
                  {b.status === 'CHECKED_IN' ? (
                    <span className="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-xl border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Ingreso Registrado
                    </span>
                  ) : (
                    <button
                      onClick={() => onCheckIn(b.id)}
                      className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl shadow transition flex items-center gap-1"
                    >
                      <UserCheck className="w-4 h-4" /> Registrar Ingreso (Check-in)
                    </button>
                  )}

                  <button
                    onClick={() => onOpenPhotosModal(b)}
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition flex items-center gap-1.5"
                    title="Fotos de inspección en Google Drive"
                  >
                    <Camera className="w-4 h-4 text-amber-400" />
                    <span className="hidden sm:inline">Ver Fotos Drive</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
