'use client';

import React, { useState } from 'react';
import { Amenity, Booking, Penalty, User } from '@/types';
import { BookingStore } from '@/lib/store';
import { AdminMetricsSection } from '@/components/admin/AdminMetricsSection';
import { Crown, HardDrive, ShieldAlert, Plus, Edit, Trash2, Camera, Flame, Gavel, Users, Building2, CheckCircle2, AlertOctagon, RotateCcw, BarChart3 } from 'lucide-react';

interface AdminDashboardProps {
  user: User;
  bookings: Booking[];
  users: User[];
  amenities: Amenity[];
  penalties: Penalty[];
  onRevokeBooking: (booking: Booking) => void;
  onOpenPhotosModal: (booking: Booking) => void;
  onOpenGoogleLogs: () => void;
  onOpenCreateAmenity: (amenity?: Amenity) => void;
  onOpenCreateUser: (userToEdit?: User) => void;
  onOpenIssuePenalty: () => void;
  onRefresh: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  bookings,
  users,
  amenities,
  penalties,
  onRevokeBooking,
  onOpenPhotosModal,
  onOpenGoogleLogs,
  onOpenCreateAmenity,
  onOpenCreateUser,
  onOpenIssuePenalty,
  onRefresh,
}) => {
  const [activeTab, setActiveTab] = useState<'METRICS' | 'BOOKINGS' | 'AMENITIES' | 'USERS' | 'PENALTIES'>('METRICS');

  const activePenalties = penalties.filter((p) => p.active);
  const activeAmenitiesCount = amenities.filter((a) => a.active !== false).length;

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-slate-950 border border-purple-500/40 rounded-3xl p-6 shadow-xl text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-purple-500/20 border border-purple-500/30 rounded-2xl text-purple-400 shadow-inner">
            <Crown className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Panel de Control de la Administración</h2>
            <p className="text-xs text-slate-400">Toma de decisiones con métricas clave, CRUD de amenities y sanciones</p>
          </div>
        </div>

        <button
          onClick={onOpenGoogleLogs}
          className="w-full md:w-auto px-5 py-3 bg-slate-800 hover:bg-slate-700 text-sky-300 font-bold text-xs rounded-2xl border border-slate-700 transition flex items-center justify-center space-x-2 shadow-lg"
        >
          <HardDrive className="w-4 h-4 text-sky-400" />
          <span>Ver Auditoría Google Services</span>
        </button>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="bg-slate-900 p-1.5 rounded-2xl border border-slate-800 flex items-center space-x-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('METRICS')}
          className={`flex-1 min-w-36 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 ${
            activeTab === 'METRICS'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>📊 Métricas & Toma de Decisiones</span>
        </button>

        <button
          onClick={() => setActiveTab('BOOKINGS')}
          className={`flex-1 min-w-36 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 ${
            activeTab === 'BOOKINGS'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Auditoría Reservas ({bookings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('AMENITIES')}
          className={`flex-1 min-w-36 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 ${
            activeTab === 'AMENITIES'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Gestión Amenities ({amenities.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('USERS')}
          className={`flex-1 min-w-36 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 ${
            activeTab === 'USERS'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Residentes ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('PENALTIES')}
          className={`flex-1 min-w-36 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 ${
            activeTab === 'PENALTIES'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Gavel className="w-4 h-4" />
          <span>Penalidades ({penalties.length})</span>
        </button>
      </div>

      {/* TAB 0: DECISION MAKING METRICS (METRICA 1 & METRICA 3) */}
      {activeTab === 'METRICS' && (
        <AdminMetricsSection bookings={bookings} amenities={amenities} />
      )}

      {/* TAB 1: RESERVAS AUDIT */}
      {activeTab === 'BOOKINGS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-purple-400" />
            <span>Gestión Global de Reservas del Edificio</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-950/50">
                  <th className="p-3">Reserva / Fecha</th>
                  <th className="p-3">Amenity</th>
                  <th className="p-3">Residente / Dpto</th>
                  <th className="p-3">Turno</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3 text-right">Acciones Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-950/40 transition">
                    <td className="p-3">
                      <div className="font-mono font-bold text-white">{b.id}</div>
                      <div className="text-[11px] text-slate-400">{b.date}</div>
                    </td>
                    <td className="p-3">
                      <span className="font-semibold text-slate-200">{b.amenityName}</span>
                      {b.useGrill && <span className="ml-1 text-orange-400">🔥</span>}
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-sky-400">{b.userName}</div>
                      <div className="text-[11px] text-slate-400">Dpto {b.apartment}</div>
                    </td>
                    <td className="p-3 text-[11px] text-slate-300">{b.shiftLabel}</td>
                    <td className="p-3">
                      {b.status === 'CONFIRMED' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Confirmada
                        </span>
                      )}
                      {b.status === 'CHECKED_IN' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                          Checked-In
                        </span>
                      )}
                      {b.status === 'PENDING_GUARD' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Pendiente Guardia
                        </span>
                      )}
                      {b.status === 'NO_SHOW' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          NO-SHOW
                        </span>
                      )}
                      {b.status === 'REVOKED_ADMIN' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          Revocada por Admin
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => onOpenPhotosModal(b)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition"
                          title="Ver fotos Drive"
                        >
                          <Camera className="w-3.5 h-3.5 text-amber-400" />
                        </button>
                        {(b.status === 'CONFIRMED' || b.status === 'CHECKED_IN' || b.status === 'PENDING_GUARD') && (
                          <button
                            onClick={() => onRevokeBooking(b)}
                            className="px-2.5 py-1 bg-rose-600/80 hover:bg-rose-500 text-white font-bold text-[11px] rounded-lg transition"
                          >
                            Revocar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: AMENITIES CRUD */}
      {activeTab === 'AMENITIES' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-purple-400" />
                <span>Configuración de Amenities del Edificio (CRUD)</span>
              </h3>
              <p className="text-xs text-slate-400">Administra los espacios comunes disponibles para reservar</p>
            </div>
            <button
              onClick={() => onOpenCreateAmenity()}
              className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Crear Amenity
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {amenities.map((a) => (
              <div key={a.id} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex items-start space-x-4">
                <img src={a.image} alt={a.name} className="w-24 h-24 object-cover rounded-xl border border-slate-800" />
                <div className="flex-1 min-w-0 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white truncate">{a.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${a.active !== false ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                      {a.active !== false ? 'Activo' : 'Baja'}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] line-clamp-2">{a.description}</p>
                  <div className="text-slate-300 text-[11px] flex gap-3 pt-1">
                    <span>👥 Cap: {a.maxCapacity} pers.</span>
                    <span>📍 {a.location}</span>
                    {a.hasGrill && <span>🔥 Parrilla</span>}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => onOpenCreateAmenity(a)}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-sky-300 font-semibold rounded-lg flex items-center gap-1"
                    >
                      <Edit className="w-3 h-3" /> Editar
                    </button>
                    <button
                      onClick={() => {
                        BookingStore.toggleAmenityActive(a.id);
                        onRefresh();
                      }}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg"
                    >
                      {a.active !== false ? 'Desactivar' : 'Activar'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: RESIDENTS CRUD */}
      {activeTab === 'USERS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-400" />
                <span>Padrón de Residentes y Unidades (CRUD)</span>
              </h3>
              <p className="text-xs text-slate-400">Registra y administra los departamentos habilitados</p>
            </div>
            <button
              onClick={() => onOpenCreateUser()}
              className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Registrar Residente
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-950/50">
                  <th className="p-3">Residente</th>
                  <th className="p-3">Departamento</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Teléfono</th>
                  <th className="p-3">Rol</th>
                  <th className="p-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-950/40 transition">
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <img src={u.avatarUrl} alt={u.name} className="w-7 h-7 rounded-full object-cover border border-slate-700" />
                        <span className="font-bold text-white">{u.name}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                        Dpto {u.apartment}
                      </span>
                    </td>
                    <td className="p-3 text-slate-300">{u.email}</td>
                    <td className="p-3 text-slate-400">{u.phone || '-'}</td>
                    <td className="p-3">
                      <span className="font-semibold px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => onOpenCreateUser(u)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-sky-300 font-semibold rounded-lg flex items-center gap-1"
                        >
                          <Edit className="w-3 h-3" /> Editar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: SANCTIONS & PENALTIES */}
      {activeTab === 'PENALTIES' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Gavel className="w-4 h-4 text-rose-400" />
                <span>Régimen de Penalidades y Sanciones</span>
              </h3>
              <p className="text-xs text-slate-400">Emisión de suspensiones por faltas, entrega sucia o ausentismo (No-Show)</p>
            </div>
            <button
              onClick={onOpenIssuePenalty}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
            >
              <Gavel className="w-4 h-4" /> Aplicar Nueva Sanción
            </button>
          </div>

          {penalties.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs font-mono">
              No hay sanciones registradas actualmente.
            </div>
          ) : (
            <div className="space-y-3">
              {penalties.map((p) => (
                <div
                  key={p.id}
                  className={`p-4 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs transition ${
                    p.active
                      ? 'bg-rose-950/20 border-rose-500/40 text-rose-200'
                      : 'bg-slate-950 border-slate-800 text-slate-400 opacity-60'
                  }`}
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-white">{p.residentName}</span>
                      <span className="font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                        Dpto {p.apartment}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${p.active ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-slate-800 text-slate-400'}`}>
                        {p.active ? 'Sanción Vigente' : 'Revocada / Expirada'}
                      </span>
                    </div>
                    <p className="text-slate-300 mt-1 font-semibold">{p.typeLabel}</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">Motivo: "{p.reason}"</p>
                    <p className="text-[10px] text-slate-500 mt-1">
                      Vigencia: {p.startDate} al {p.endDate}
                    </p>
                  </div>

                  {p.active && (
                    <button
                      onClick={() => {
                        BookingStore.revokePenalty(p.id);
                        onRefresh();
                      }}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl border border-slate-700 transition flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-amber-400" /> Revocar Sanción
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
