'use client';

import React, { useState, useEffect } from 'react';
import { Amenity, Booking, Penalty, Role, User } from '@/types';
import { BookingStore, INITIAL_USERS } from '@/lib/store';
import { getGoogleLogs } from '@/lib/google-services';
import { Navbar } from '@/components/layout/Navbar';
import { ResidentDashboard } from '@/components/dashboard/ResidentDashboard';
import { GuardDashboard } from '@/components/dashboard/GuardDashboard';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';
import { BookingModal } from '@/components/booking/BookingModal';
import { QRInviteModal } from '@/components/qr/QRInviteModal';
import { QRScannerModal } from '@/components/qr/QRScannerModal';
import { PhotoInspectionModal } from '@/components/photos/PhotoInspectionModal';
import { RevokeBookingModal } from '@/components/admin/RevokeBookingModal';
import { GoogleLogsModal } from '@/components/google/GoogleLogsModal';
import { AmenityCrudModal } from '@/components/admin/AmenityCrudModal';
import { UserCrudModal } from '@/components/admin/UserCrudModal';
import { PenaltyModal } from '@/components/admin/PenaltyModal';
import { LoginModal } from '@/components/auth/LoginModal';
import { CheckCircle2 } from 'lucide-react';

export default function Home() {
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]);
  const [currentRole, setCurrentRole] = useState<Role>('RESIDENT');
  
  // Dynamic State Stores
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [penalties, setPenalties] = useState<Penalty[]>([]);

  // Modals state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [isPhotosModalOpen, setIsPhotosModalOpen] = useState(false);
  const [selectedPhotoBooking, setSelectedPhotoBooking] = useState<Booking | null>(null);
  const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);
  const [selectedRevokeBooking, setSelectedRevokeBooking] = useState<Booking | null>(null);
  const [isGoogleLogsOpen, setIsGoogleLogsOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Admin CRUD Modals
  const [isAmenityModalOpen, setIsAmenityModalOpen] = useState(false);
  const [selectedAmenityToEdit, setSelectedAmenityToEdit] = useState<Amenity | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedUserToEdit, setSelectedUserToEdit] = useState<User | null>(null);
  const [isPenaltyModalOpen, setIsPenaltyModalOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const refreshAllData = () => {
    setBookings(BookingStore.getAllBookings());
    setUsers(BookingStore.getUsers());
    setAmenities(BookingStore.getAllAmenitiesAdmin());
    setPenalties(BookingStore.getPenalties());
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleRoleChange = (role: Role, user: User) => {
    setCurrentRole(role);
    setCurrentUser(user);
    showToast(`Iniciado sesión como: ${user.name} (${role === 'RESIDENT' ? `Dpto ${user.apartment}` : role === 'GUARD' ? 'Guardia' : 'Admin'})`);
  };

  const handleCheckIn = async (bookingId: string) => {
    try {
      await BookingStore.checkIn(bookingId);
      refreshAllData();
      showToast('¡Check-in registrado exitosamente! Sincronizado en tiempo real.');
    } catch (err: any) {
      alert(err.message || 'Error en check-in');
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (confirm('¿Estás seguro de cancelar esta reserva? Liberará el espacio inmediatamente.')) {
      try {
        await BookingStore.cancelByResident(bookingId);
        refreshAllData();
        showToast('Reserva cancelada y horario liberado en Google Calendar.');
      } catch (err: any) {
        alert(err.message || 'Error al cancelar');
      }
    }
  };

  const handleApproveException = async (bookingId: string) => {
    try {
      await BookingStore.approveByGuard(bookingId);
      refreshAllData();
      showToast('Excepción aprobada por la Guardia. Reserva confirmada.');
    } catch (err: any) {
      alert(err.message || 'Error al aprobar');
    }
  };

  const handleRejectException = async (bookingId: string) => {
    const reason = prompt('Indica el motivo del rechazo:') || 'Cupo semanal excedido.';
    try {
      await BookingStore.rejectByGuard(bookingId, reason);
      refreshAllData();
      showToast('Excepción rechazada.');
    } catch (err: any) {
      alert(err.message || 'Error al rechazar');
    }
  };

  const handleTriggerNoShowCheck = async () => {
    const res = await BookingStore.triggerNoShowScan();
    refreshAllData();
    if (res.processedCount > 0) {
      showToast(`⚠️ Cron NO-SHOW ejecutado: ${res.processedCount} reservas sin check-in liberadas automáticamente.`);
    } else {
      showToast('✓ Escaneo de NO-SHOW completado: No se detectaron reservas abandonadas.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        currentRole={currentRole}
        currentUser={currentUser}
        onRoleChange={handleRoleChange}
        onOpenGoogleLogs={() => setIsGoogleLogsOpen(true)}
        onTriggerNoShowCheck={handleTriggerNoShowCheck}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        googleLogsCount={getGoogleLogs().length}
      />

      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-sky-500 text-slate-950 font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-sky-300 animate-bounce">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="text-xs">{toastMessage}</span>
        </div>
      )}

      {/* Main Role Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentRole === 'RESIDENT' && (
          <ResidentDashboard
            user={currentUser}
            bookings={bookings}
            onOpenBookingModal={() => setIsBookingModalOpen(true)}
            onOpenQRModal={() => setIsQRModalOpen(true)}
            onOpenPhotosModal={(b) => {
              setSelectedPhotoBooking(b);
              setIsPhotosModalOpen(true);
            }}
            onCheckIn={handleCheckIn}
            onCancelBooking={handleCancelBooking}
          />
        )}

        {currentRole === 'GUARD' && (
          <GuardDashboard
            user={currentUser}
            bookings={bookings}
            onOpenQRScanner={() => setIsQRScannerOpen(true)}
            onApproveException={handleApproveException}
            onRejectException={handleRejectException}
            onCheckIn={handleCheckIn}
            onOpenPhotosModal={(b) => {
              setSelectedPhotoBooking(b);
              setIsPhotosModalOpen(true);
            }}
          />
        )}

        {currentRole === 'ADMIN' && (
          <AdminDashboard
            user={currentUser}
            bookings={bookings}
            users={users}
            amenities={amenities}
            penalties={penalties}
            onRevokeBooking={(b) => {
              setSelectedRevokeBooking(b);
              setIsRevokeModalOpen(true);
            }}
            onOpenPhotosModal={(b) => {
              setSelectedPhotoBooking(b);
              setIsPhotosModalOpen(true);
            }}
            onOpenGoogleLogs={() => setIsGoogleLogsOpen(true)}
            onOpenCreateAmenity={(amenityToEdit) => {
              setSelectedAmenityToEdit(amenityToEdit || null);
              setIsAmenityModalOpen(true);
            }}
            onOpenCreateUser={(userToEdit) => {
              setSelectedUserToEdit(userToEdit || null);
              setIsUserModalOpen(true);
            }}
            onOpenIssuePenalty={() => setIsPenaltyModalOpen(true)}
            onRefresh={refreshAllData}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <span>Edificio Mirador Plaza • Sistema Reactivo de Amenities v2.0</span>
          <span>Google Calendar • Drive • Gmail APIs Integrated</span>
        </div>
      </footer>

      {/* Modals */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        user={currentUser}
        onSuccess={(msg) => {
          refreshAllData();
          showToast(msg);
        }}
      />

      <QRInviteModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        user={currentUser}
        bookings={bookings}
      />

      <QRScannerModal
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
      />

      <PhotoInspectionModal
        isOpen={isPhotosModalOpen}
        onClose={() => {
          setIsPhotosModalOpen(false);
          setSelectedPhotoBooking(null);
        }}
        booking={selectedPhotoBooking}
        onUpdated={refreshAllData}
      />

      <RevokeBookingModal
        isOpen={isRevokeModalOpen}
        onClose={() => {
          setIsRevokeModalOpen(false);
          setSelectedRevokeBooking(null);
        }}
        booking={selectedRevokeBooking}
        onUpdated={() => {
          refreshAllData();
          showToast('Reserva revocada por Administración. Sincronizado en Google Calendar & Gmail.');
        }}
      />

      <GoogleLogsModal
        isOpen={isGoogleLogsOpen}
        onClose={() => setIsGoogleLogsOpen(false)}
      />

      {/* Admin CRUD Modals */}
      <AmenityCrudModal
        isOpen={isAmenityModalOpen}
        onClose={() => setIsAmenityModalOpen(false)}
        amenity={selectedAmenityToEdit}
        onSaved={() => {
          refreshAllData();
          showToast('Amenity guardado exitosamente.');
        }}
      />

      <UserCrudModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        userToEdit={selectedUserToEdit}
        onSaved={() => {
          refreshAllData();
          showToast('Residente / Usuario guardado en el padrón.');
        }}
      />

      <PenaltyModal
        isOpen={isPenaltyModalOpen}
        onClose={() => setIsPenaltyModalOpen(false)}
        users={users}
        onSaved={() => {
          refreshAllData();
          showToast('Sanción emitida y registrada en la base de datos con aviso por Gmail.');
        }}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSelectUser={handleRoleChange}
      />
    </div>
  );
}
