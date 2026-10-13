'use client';

import React from 'react';
import { getGoogleLogs } from '@/lib/google-services';
import { X, Calendar, HardDrive, Mail, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';

interface GoogleLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleLogsModal: React.FC<GoogleLogsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const logs = getGoogleLogs();

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl text-white">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-sky-500/20 text-sky-400 rounded-lg">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Google Cloud Integration Logs</h2>
              <p className="text-xs text-slate-400">Auditoría en tiempo real de Calendar, Drive y Gmail APIs</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Logs Container */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1 font-mono text-xs">
          {logs.length === 0 ? (
            <p className="text-center text-slate-500 py-8 font-sans">No hay eventos registrados aún en Google Services.</p>
          ) : (
            logs.map((log) => {
              const dateFormatted = new Date(log.timestamp).toLocaleTimeString();
              return (
                <div
                  key={log.id}
                  className="bg-slate-950/80 border border-slate-800/80 p-3 rounded-xl flex items-start space-x-3 hover:border-slate-700 transition"
                >
                  {/* Service Icon */}
                  <div className="mt-0.5">
                    {log.service === 'CALENDAR' && (
                      <span className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg block">
                        <Calendar className="w-4 h-4" />
                      </span>
                    )}
                    {log.service === 'DRIVE' && (
                      <span className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg block">
                        <HardDrive className="w-4 h-4" />
                      </span>
                    )}
                    {log.service === 'GMAIL' && (
                      <span className="p-1.5 bg-purple-500/20 text-purple-400 rounded-lg block">
                        <Mail className="w-4 h-4" />
                      </span>
                    )}
                  </div>

                  {/* Log Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-200">[{log.service}]</span>
                        <span className="text-slate-400 font-semibold">{log.action}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-sans">{dateFormatted}</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed font-sans text-xs">{log.details}</p>
                  </div>

                  {/* Status Indicator */}
                  <div>
                    {log.status === 'SUCCESS' && <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />}
                    {log.status === 'WARNING' && <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5" />}
                    {log.status === 'ERROR' && <ShieldAlert className="w-4 h-4 text-rose-400 mt-0.5" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/50 flex justify-between items-center text-xs text-slate-400">
          <span>Total de eventos registrados: {logs.length}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition font-sans text-xs"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
