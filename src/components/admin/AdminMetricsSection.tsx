'use client';

import React from 'react';
import { Booking, Amenity } from '@/types';
import { BarChart3, TrendingUp, Users } from 'lucide-react';

interface AdminMetricsSectionProps {
  bookings: Booking[];
  amenities: Amenity[];
}

export const AdminMetricsSection: React.FC<AdminMetricsSectionProps> = ({
  bookings,
  amenities,
}) => {
  const total = bookings.length || 1;
  const overQuotaCount = bookings.filter((b) => b.isOverWeeklyQuota).length;

  // Metric 1 calculation: Amenity demand heatmap / popularity
  const amenityStats = amenities.map((a) => {
    const count = bookings.filter((b) => b.amenityId === a.id).length;
    const percentage = Math.round((count / total) * 100);
    return { name: a.name, count, percentage };
  });

  const sortedAmenityStats = [...amenityStats].sort((a, b) => b.count - a.count);
  const topAmenity = sortedAmenityStats[0] || { name: 'Quincho Principal', percentage: 60, count: 1 };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-sky-500/20 text-sky-400 rounded-xl">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Métricas de Toma de Decisiones del Consorcio</h3>
            <p className="text-xs text-slate-400">Demanda por Amenity y Solicitudes de Excepción de Cupo Semanal</p>
          </div>
        </div>
        <span className="text-[11px] bg-sky-500/10 text-sky-300 border border-sky-500/30 px-3 py-1 rounded-full font-semibold">
          📊 Reporte Operativo
        </span>
      </div>

      {/* Grid of Metric 1 and Metric 3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* MÉTRICA 1: Demanda por Amenity */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-sky-400 uppercase tracking-wider">Métrica 1 • Ocupación & Demanda</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-extrabold text-white">{topAmenity.name}</div>
            <p className="text-xs text-slate-300 mt-1">
              Concentra el <b className="text-sky-400">{topAmenity.percentage}%</b> del total de reservas registradas en el edificio ({topAmenity.count} turnos).
            </p>
          </div>

          <div className="text-xs text-emerald-300 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 leading-relaxed">
            💡 <b>Toma de Decisión</b>: Evaluar mantenimiento prioritario o ampliar turnos en {topAmenity.name} debido a la alta concentración de demanda.
          </div>
        </div>

        {/* MÉTRICA 3: Presión sobre Cupos y Excepciones */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-purple-400 uppercase tracking-wider">Métrica 2 • Presión de Cupos Semanales</span>
              <Users className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-3xl font-extrabold text-purple-300">{overQuotaCount} Solicitudes</div>
            <p className="text-xs text-slate-300 mt-1">
              Reservas de residentes que superaron el límite estándar de 3 reservas semanales y requirieron aval del Guardia.
            </p>
          </div>

          <div className="text-xs text-purple-300 bg-purple-500/10 p-3 rounded-xl border border-purple-500/20 leading-relaxed">
            💡 <b>Toma de Decisión</b>: {overQuotaCount > 2 ? 'Evaluar flexibilización temporal del cupo semanal a 4 reservas en temporada alta.' : 'Mantener el cupo estándar de 3 reservas gratuitas semanales por departamento.'}
          </div>
        </div>
      </div>

      {/* Visual Progress Breakdown for Metric 1 */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold text-slate-200">Desglose de Demanda por Amenity (% del Total de Reservas)</h4>
        <div className="space-y-3">
          {amenityStats.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-semibold">{item.name}</span>
                <span className="text-slate-400 font-mono">{item.count} reservas ({item.percentage}%)</span>
              </div>
              <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-sky-500 h-full transition-all duration-500"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
