'use client';

import React, { useState, useEffect } from 'react';
import { Role, User } from '@/types';
import { BookingStore } from '@/lib/store';
import { X, UserPlus, Save } from 'lucide-react';

interface UserCrudModalProps {
  isOpen: boolean;
  onClose: () => void;
  userToEdit: User | null;
  onSaved: () => void;
}

export const UserCrudModal: React.FC<UserCrudModalProps> = ({
  isOpen,
  onClose,
  userToEdit,
  onSaved,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [apartment, setApartment] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<Role>('RESIDENT');

  useEffect(() => {
    if (userToEdit) {
      setName(userToEdit.name);
      setEmail(userToEdit.email);
      setApartment(userToEdit.apartment);
      setPhone(userToEdit.phone || '');
      setRole(userToEdit.role);
    } else {
      setName('');
      setEmail('');
      setApartment('1A');
      setPhone('');
      setRole('RESIDENT');
    }
  }, [userToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    BookingStore.saveUser({
      id: userToEdit?.id,
      name,
      email,
      apartment,
      phone,
      role,
    });
    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl text-white">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-sky-500/20 text-sky-400 rounded-xl">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">{userToEdit ? 'Editar Residente' : 'Registrar Residente'}</h2>
              <p className="text-xs text-slate-400">Padrón de vecinos y conserjería del edificio</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Nombre Completo</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Roberto Fernández"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-sky-500"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@edificio.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-sky-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Departamento / Unidad</label>
              <input
                type="text"
                value={apartment}
                onChange={(e) => setApartment(e.target.value)}
                placeholder="Ej. 4B"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-sky-500 font-bold"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Teléfono</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+54 9 11..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Rol en el Sistema</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-sky-500"
            >
              <option value="RESIDENT">Residente</option>
              <option value="GUARD">Guardia / Conserjería</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </div>

          <div className="pt-2 flex gap-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-slate-800 text-slate-300 font-bold rounded-xl">
              Cancelar
            </button>
            <button type="submit" className="flex-1 py-2.5 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl flex items-center justify-center gap-1.5">
              <Save className="w-4 h-4" /> Guardar Residente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
