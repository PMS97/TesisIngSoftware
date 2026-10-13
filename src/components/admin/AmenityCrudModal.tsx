'use client';

import React, { useState, useEffect } from 'react';
import { Amenity } from '@/types';
import { BookingStore } from '@/lib/store';
import { X, Building2, Save, Plus } from 'lucide-react';

interface AmenityCrudModalProps {
  isOpen: boolean;
  onClose: () => void;
  amenity: Amenity | null;
  onSaved: () => void;
}

export const AmenityCrudModal: React.FC<AmenityCrudModalProps> = ({
  isOpen,
  onClose,
  amenity,
  onSaved,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [maxCapacity, setMaxCapacity] = useState(20);
  const [location, setLocation] = useState('');
  const [requiresPhotos, setRequiresPhotos] = useState(true);
  const [hasGrill, setHasGrill] = useState(true);
  const [image, setImage] = useState('');
  const [rulesStr, setRulesStr] = useState('');

  useEffect(() => {
    if (amenity) {
      setName(amenity.name);
      setDescription(amenity.description);
      setMaxCapacity(amenity.maxCapacity);
      setLocation(amenity.location);
      setRequiresPhotos(amenity.requiresPhotos);
      setHasGrill(amenity.hasGrill);
      setImage(amenity.image);
      setRulesStr(amenity.rules?.join('\n') || '');
    } else {
      setName('');
      setDescription('');
      setMaxCapacity(20);
      setLocation('Planta Baja');
      setRequiresPhotos(true);
      setHasGrill(false);
      setImage('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600');
      setRulesStr('Dejar limpio y ordenado.\nRespetar el reglamento del edificio.');
    }
  }, [amenity, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    BookingStore.saveAmenity({
      id: amenity?.id,
      name,
      description,
      maxCapacity: Number(maxCapacity),
      location,
      requiresPhotos,
      hasGrill,
      image,
      rules: rulesStr.split('\n').filter((r) => r.trim() !== ''),
    });
    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl text-white">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-sky-500/20 text-sky-400 rounded-xl">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">{amenity ? 'Editar Amenity' : 'Crear Nuevo Amenity'}</h2>
              <p className="text-xs text-slate-400">Configuración de espacios comunes del edificio</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Nombre del Amenity</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Quincho VIP"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-sky-500"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Descripción</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalles de equipamiento..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Capacidad Máxima (personas)</label>
              <input
                type="number"
                value={maxCapacity}
                onChange={(e) => setMaxCapacity(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-sky-500"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Ubicación</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ej. Piso 14"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-sky-500"
                required
              />
            </div>
          </div>

          <div className="flex gap-4 p-3 bg-slate-950/80 rounded-xl border border-slate-800">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasGrill}
                onChange={(e) => setHasGrill(e.target.checked)}
                className="w-4 h-4 accent-orange-500 rounded"
              />
              <span>🔥 Posee Parrilla / Asador</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={requiresPhotos}
                onChange={(e) => setRequiresPhotos(e.target.checked)}
                className="w-4 h-4 accent-sky-500 rounded"
              />
              <span>📸 Requiere Fotos de Estado (Drive)</span>
            </label>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">URL Imagen de Portada</label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-sky-500 font-mono text-[11px]"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Reglas del Amenity (1 regla por línea)</label>
            <textarea
              rows={3}
              value={rulesStr}
              onChange={(e) => setRulesStr(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="pt-2 flex gap-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-slate-800 text-slate-300 font-bold rounded-xl">
              Cancelar
            </button>
            <button type="submit" className="flex-1 py-2.5 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl flex items-center justify-center gap-1.5">
              <Save className="w-4 h-4" /> Guardar Amenity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
