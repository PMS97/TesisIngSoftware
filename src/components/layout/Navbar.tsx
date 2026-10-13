'use client';

import React from 'react';
import { Role, User } from '@/types';
import { INITIAL_USERS } from '@/lib/store';
import { Building2, ShieldCheck, UserCheck, Crown, Cloud, Clock, LogIn } from 'lucide-react';

interface NavbarProps {
  currentRole: Role;
  currentUser: User;
  onRoleChange: (role: Role, user: User) => void;
  onOpenGoogleLogs: () => void;
  onTriggerNoShowCheck: () => void;
  onOpenLoginModal: () => void;
  googleLogsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  currentUser,
  onRoleChange,
  onOpenGoogleLogs,
  onTriggerNoShowCheck,
  onOpenLoginModal,
  googleLogsCount,
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-sky-500 text-white rounded-xl shadow-md">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight tracking-tight flex items-center gap-2">
                Edificio Mirador Plaza
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  v2.0 Reactive
                </span>
              </h1>
              <p className="text-xs text-slate-400">Reserva de Amenities & Google Services Sync</p>
            </div>
          </div>

          {/* Quick Actions & Role Switcher */}
          <div className="flex items-center space-x-3">
            {/* Google Services Logs Button */}
            <button
              onClick={onOpenGoogleLogs}
              className="hidden md:flex items-center space-x-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-lg border border-slate-700 transition"
              title="Ver registros de Google Calendar, Drive y Gmail"
            >
              <Cloud className="w-4 h-4 text-sky-400" />
              <span>Google Sync</span>
              <span className="bg-sky-500 text-slate-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {googleLogsCount}
              </span>
            </button>

            {/* Simulated NO-SHOW Cron Scanner */}
            <button
              onClick={onTriggerNoShowCheck}
              className="hidden lg:flex items-center space-x-1.5 text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 px-3 py-2 rounded-lg border border-amber-500/30 transition"
              title="Simular escaneo de 30 minutos sin check-in"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Cron NO-SHOW</span>
            </button>

            {/* Login / Profile Selector Button */}
            <button
              onClick={onOpenLoginModal}
              className="flex items-center space-x-2 text-xs bg-sky-600 hover:bg-sky-500 text-white font-bold px-3.5 py-2 rounded-xl transition shadow"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">Log In ({currentUser.name.split(' ')[0]})</span>
              <span className="sm:hidden">Log In</span>
            </button>

            {/* Role Switcher Pills */}
            <div className="bg-slate-800 p-1 rounded-xl hidden md:flex items-center border border-slate-700">
              <button
                onClick={() => onRoleChange('RESIDENT', INITIAL_USERS[0])}
                className={`flex items-center space-x-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition ${
                  currentRole === 'RESIDENT'
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Residente</span>
              </button>

              <button
                onClick={() => onRoleChange('GUARD', INITIAL_USERS[3])}
                className={`flex items-center space-x-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition ${
                  currentRole === 'GUARD'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Guardia</span>
              </button>

              <button
                onClick={() => onRoleChange('ADMIN', INITIAL_USERS[4])}
                className={`flex items-center space-x-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition ${
                  currentRole === 'ADMIN'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Crown className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
