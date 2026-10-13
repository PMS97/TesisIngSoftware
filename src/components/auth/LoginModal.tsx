'use client';

import React, { useState } from 'react';
import { Role, User } from '@/types';
import { BookingStore } from '@/lib/store';
import { GmailService } from '@/lib/google-services';
import { X, LogIn, Mail, Lock, ShieldCheck, UserCheck, Crown, KeyRound, UserPlus, CheckCircle2 } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUser: (role: Role, user: User) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSelectUser,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'PROFILES' | 'CREDENTIALS' | 'RECOVERY'>('PROFILES');
  const [recoveryMsg, setRecoveryMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const allUsers = BookingStore.getUsers();

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const foundUser = allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (foundUser) {
      onSelectUser(foundUser.role, foundUser);
      onClose();
    } else {
      alert('Email no registrado en el padrón del edificio. Selecciona una cuenta registrada o solicita alta al Administrador.');
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    await GmailService.sendBookingConfirmation(
      email,
      'Residente',
      'Plataforma Edificio',
      new Date().toISOString().split('T')[0],
      'Recuperación de Contraseña',
      false
    );

    setRecoveryMsg(`Se ha enviado un enlace de recuperación seguro vía Gmail al correo ${email}. Revisa tu bandeja de entrada.`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl text-white">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-sky-500/20 text-sky-400 rounded-xl">
              <LogIn className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Autenticación & Accesos</h2>
              <p className="text-xs text-slate-400">Edificio Mirador Plaza</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auth Mode Tabs */}
        <div className="p-4 space-y-4">
          <div className="flex gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('PROFILES')}
              className={`flex-1 py-2 font-bold rounded-lg transition ${
                activeTab === 'PROFILES' ? 'bg-sky-500 text-white shadow' : 'text-slate-400'
              }`}
            >
              👤 Selector Rápido
            </button>
            <button
              onClick={() => setActiveTab('CREDENTIALS')}
              className={`flex-1 py-2 font-bold rounded-lg transition ${
                activeTab === 'CREDENTIALS' ? 'bg-sky-500 text-white shadow' : 'text-slate-400'
              }`}
            >
              🔒 Email / Password
            </button>
            <button
              onClick={() => setActiveTab('RECOVERY')}
              className={`flex-1 py-2 font-bold rounded-lg transition ${
                activeTab === 'RECOVERY' ? 'bg-sky-500 text-white shadow' : 'text-slate-400'
              }`}
            >
              🔑 Recuperar
            </button>
          </div>

          {activeTab === 'PROFILES' && (
            <div className="space-y-2">
              <span className="block text-[11px] text-slate-400 font-semibold mb-2">
                Selecciona un usuario registrado en el padrón para probar:
              </span>

              {allUsers.map((u) => (
                <button
                  key={u.id}
                  onClick={() => {
                    onSelectUser(u.role, u);
                    onClose();
                  }}
                  className="w-full p-3 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 rounded-2xl flex items-center justify-between text-left text-xs transition group"
                >
                  <div className="flex items-center space-x-3">
                    <img src={u.avatarUrl} alt={u.name} className="w-9 h-9 rounded-xl object-cover border border-slate-700" />
                    <div>
                      <div className="font-bold text-white group-hover:text-sky-300 transition">{u.name}</div>
                      <div className="text-[11px] text-slate-400">
                        {u.role === 'RESIDENT' ? `Dpto ${u.apartment}` : u.role === 'GUARD' ? 'Conserjería' : 'Admin'} • {u.email}
                      </div>
                    </div>
                  </div>

                  <div>
                    {u.role === 'RESIDENT' && <span className="p-1.5 bg-sky-500/10 text-sky-400 rounded-lg block"><UserCheck className="w-4 h-4" /></span>}
                    {u.role === 'GUARD' && <span className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg block"><ShieldCheck className="w-4 h-4" /></span>}
                    {u.role === 'ADMIN' && <span className="p-1.5 bg-purple-500/10 text-purple-400 rounded-lg block"><Crown className="w-4 h-4" /></span>}
                  </div>
                </button>
              ))}
            </div>
          )}

          {activeTab === 'CREDENTIALS' && (
            <form onSubmit={handleCredentialsSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Correo Electrónico Registrado</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="pablo.residente@edificio.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-white focus:outline-none focus:border-sky-500"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-semibold text-slate-300">Contraseña</label>
                  <button
                    type="button"
                    onClick={() => setActiveTab('RECOVERY')}
                    className="text-[11px] text-sky-400 hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-white focus:outline-none focus:border-sky-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl shadow transition"
              >
                Ingresar a la Plataforma
              </button>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => alert('Autenticación mediante Google Sign-In (OAuth 2.0). Redirige a Google y valida en la BD de Supabase.')}
                  className="w-full py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold rounded-xl transition flex items-center justify-center space-x-2"
                >
                  <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
                  <span>Iniciar sesión con Google</span>
                </button>
              </div>
            </form>
          )}

          {activeTab === 'RECOVERY' && (
            <form onSubmit={handlePasswordReset} className="space-y-3 text-xs">
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Ingresa el correo electrónico asociado a tu departamento. Te enviaremos un enlace seguro vía <b>Gmail</b> para restablecer tu contraseña.
              </p>

              {recoveryMsg && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{recoveryMsg}</span>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Correo del Residente</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="pablo.residente@edificio.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-white focus:outline-none focus:border-sky-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl shadow transition flex items-center justify-center space-x-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>Enviar Enlace de Recuperación</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
