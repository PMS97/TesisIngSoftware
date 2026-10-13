'use client';

import React, { useState } from 'react';
import { Booking } from '@/types';
import { BookingStore } from '@/lib/store';
import { X, Camera, Upload, ExternalLink, CheckCircle, Image as ImageIcon } from 'lucide-react';

interface PhotoInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onUpdated: () => void;
}

export const PhotoInspectionModal: React.FC<PhotoInspectionModalProps> = ({
  isOpen,
  onClose,
  booking,
  onUpdated,
}) => {
  const [photoType, setPhotoType] = useState<'before' | 'after'>('before');
  const [sampleUrl, setSampleUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen || !booking) return null;

  const samplePhotoPresets = [
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500',
    'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=500',
    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=500',
  ];

  const handleUpload = async (urlToUpload?: string) => {
    const url = urlToUpload || sampleUrl || samplePhotoPresets[0];
    setLoading(true);

    try {
      await BookingStore.addPhoto(booking.id, photoType, url);
      onUpdated();
      setSampleUrl('');
    } catch (err: any) {
      alert(err.message || 'Error al subir foto a Google Drive');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl text-white">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Inspección Fotográfica (Google Drive)</h2>
              <p className="text-xs text-slate-400">
                Reserva {booking.id} • {booking.amenityName} (Dpto {booking.apartment})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Drive Folder Link */}
          {booking.googleDriveFolderUrl && (
            <a
              href={booking.googleDriveFolderUrl}
              target="_blank"
              rel="noreferrer"
              className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center justify-between hover:bg-emerald-500/20 transition"
            >
              <span className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                <span>Carpeta oficial sincronizada en Google Drive</span>
              </span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}

          {/* Photo Grids: Before vs After */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* BEFORE (ENTREGA) */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-sky-400">📸 Estado Inicial (Antes)</span>
                <span className="text-[10px] bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded font-mono">
                  {booking.photosBefore?.length || 0} fotos
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 min-h-28 items-center">
                {booking.photosBefore && booking.photosBefore.length > 0 ? (
                  booking.photosBefore.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt="Antes"
                      className="w-full h-24 object-cover rounded-xl border border-slate-800 shadow"
                    />
                  ))
                ) : (
                  <p className="col-span-2 text-center text-slate-600 text-xs py-6 font-mono">Sin fotos iniciales</p>
                )}
              </div>
            </div>

            {/* AFTER (LIMPIEZA/DEVOLUCION) */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-emerald-400">✨ Estado Final (Después)</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">
                  {booking.photosAfter?.length || 0} fotos
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 min-h-28 items-center">
                {booking.photosAfter && booking.photosAfter.length > 0 ? (
                  booking.photosAfter.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt="Después"
                      className="w-full h-24 object-cover rounded-xl border border-slate-800 shadow"
                    />
                  ))
                ) : (
                  <p className="col-span-2 text-center text-slate-600 text-xs py-6 font-mono">Sin fotos de limpieza</p>
                )}
              </div>
            </div>
          </div>

          {/* Upload Controls */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-200">Subir Nueva Foto de Inspección</h4>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPhotoType('before')}
                className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition ${
                  photoType === 'before'
                    ? 'bg-sky-500/20 border-sky-500 text-sky-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                1. Foto Inicial (Antes)
              </button>
              <button
                type="button"
                onClick={() => setPhotoType('after')}
                className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition ${
                  photoType === 'after'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                2. Foto Final (Después)
              </button>
            </div>

            <div className="space-y-2">
              <span className="block text-[11px] text-slate-400">Selecciona o simula la foto capturada:</span>
              <div className="flex gap-2">
                {samplePhotoPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleUpload(preset)}
                    className="flex-1 p-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl overflow-hidden group transition"
                  >
                    <img src={preset} alt="preset" className="w-full h-14 object-cover rounded-lg group-hover:scale-105 transition" />
                    <span className="block text-[10px] text-center text-slate-400 mt-1">Cargar Foto {idx + 1}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
