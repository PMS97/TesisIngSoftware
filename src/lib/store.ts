import { Amenity, Booking, BookingStatus, GuestInvite, Penalty, PenaltyType, ShiftType, User, VisitorAccessLog } from '@/types';
import { GmailService, GoogleCalendarService, GoogleDriveService } from './google-services';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-res-1',
    name: 'Pablo Gómez',
    email: 'pablo.residente@edificio.com',
    role: 'RESIDENT',
    apartment: '4B',
    phone: '+54 9 11 4567-8901',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    status: 'ACTIVE',
  },
  {
    id: 'usr-res-2',
    name: 'Mariana López',
    email: 'mariana.8a@edificio.com',
    role: 'RESIDENT',
    apartment: '8A',
    phone: '+54 9 11 9876-5432',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    status: 'ACTIVE',
  },
  {
    id: 'usr-res-3',
    name: 'Roberto Fernández',
    email: 'roberto.2c@edificio.com',
    role: 'RESIDENT',
    apartment: '2C',
    phone: '+54 9 11 1122-3344',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    status: 'ACTIVE',
  },
  {
    id: 'usr-guard-1',
    name: 'Carlos Ramírez (Conserjería)',
    email: 'guardia.noche@edificio.com',
    role: 'GUARD',
    apartment: 'Recepción',
    phone: 'Int. 101',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    status: 'ACTIVE',
  },
  {
    id: 'usr-admin-1',
    name: 'Admin Consorcio (Laura Ruiz)',
    email: 'administracion@edificio.com',
    role: 'ADMIN',
    apartment: 'Administración',
    phone: 'Int. 200',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    status: 'ACTIVE',
  },
];

export const INITIAL_AMENITIES: Amenity[] = [
  {
    id: 'amenity-quincho-1',
    name: 'Quincho Principal',
    description: 'Espacio totalmente equipado con vajilla, aire acondicionado y TV 65". Incluye parrilla tradicional a carbón/leña.',
    maxCapacity: 25,
    location: 'Planta Baja - Sector Jardín',
    requiresPhotos: true,
    hasGrill: true,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
    rules: [
      'Dejar el espacio limpio y ordenado.',
      'Cargar foto del estado antes de iniciar y al finalizar en la app (Google Drive).',
      'Horario de silencio riguroso a partir de las 00:00 hs (se extiende a 03:00 am los fines de semana).',
    ],
    active: true,
  },
  {
    id: 'amenity-parrilla-terraza',
    name: 'Parrilla Terraza Norte',
    description: 'Parrilla al aire libre en la terraza del piso 14 con pérgola y vista panorámica a la ciudad.',
    maxCapacity: 12,
    location: 'Piso 14 - Terraza',
    requiresPhotos: true,
    hasGrill: true,
    image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600&auto=format&fit=crop&q=80',
    rules: [
      'Uso exclusivo de parrilla.',
      'Apagar completamente brasas al finalizar.',
      'Subir foto de estado inicial y final.',
    ],
    active: true,
  },
  {
    id: 'amenity-sum',
    name: 'SUM Eventos y Cumpleaños',
    description: 'Salón de usos múltiples climatizado con cocina equipada, livings y mesas modulares.',
    maxCapacity: 40,
    location: 'Piso 1 - Mezzanine',
    requiresPhotos: false,
    hasGrill: false,
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&auto=format&fit=crop&q=80',
    rules: [
      'Prohibido el uso de pirotecnia.',
      'Música a volumen moderado respetando el reglamento del consorcio.',
    ],
    active: true,
  },
  {
    id: 'amenity-piscina',
    name: 'Solarium & Piscina',
    description: 'Área de reposeras y piscina climatizada al aire libre.',
    maxCapacity: 15,
    location: 'Piso 14 - Terraza Sur',
    requiresPhotos: false,
    hasGrill: false,
    image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=600&auto=format&fit=crop&q=80',
    rules: [
      'Ducharse antes de ingresar a la piscina.',
      'No ingresar con vajilla de vidrio.',
    ],
    active: true,
  },
];

let usersStore: User[] = [...INITIAL_USERS];
let amenitiesStore: Amenity[] = [...INITIAL_AMENITIES];
let penaltiesStore: Penalty[] = [
  {
    id: 'pen-1',
    userId: 'usr-res-3',
    residentName: 'Roberto Fernández',
    apartment: '2C',
    reason: 'Entrega del quincho sin limpieza posterior y acumulación de 2 ausentismos (NO-SHOW).',
    type: 'SUSPENSION',
    typeLabel: 'Suspensión temporal de reservas (14 días)',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    active: true,
    createdAt: new Date().toISOString(),
  },
];

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getShiftInfo(dateStr: string, shift: ShiftType): { label: string; startTime: string; endTime: string } {
  const d = new Date(`${dateStr}T00:00:00`);
  const dayOfWeek = d.getDay();
  const isWeekendNight = dayOfWeek === 5 || dayOfWeek === 6;

  if (shift === 'LUNCH') {
    return {
      label: 'Almuerzo (12:00 hs - 18:00 hs)',
      startTime: `${dateStr}T12:00:00`,
      endTime: `${dateStr}T18:00:00`,
    };
  } else {
    const endStr = isWeekendNight ? '03:00 (Fin de semana)' : '00:00';
    return {
      label: `Noche (19:00 hs - ${endStr})`,
      startTime: `${dateStr}T19:00:00`,
      endTime: isWeekendNight ? `${dateStr}T03:00:00` : `${dateStr}T23:59:59`,
    };
  }
}

let bookingsStore: Booking[] = [
  {
    id: 'res-101',
    amenityId: 'amenity-quincho-1',
    amenityName: 'Quincho Principal',
    userId: 'usr-res-1',
    userName: 'Pablo Gómez',
    apartment: '4B',
    userEmail: 'pablo.residente@edificio.com',
    date: getTodayDateString(),
    shift: 'LUNCH',
    shiftLabel: 'Almuerzo (12:00 hs - 18:00 hs)',
    startTime: `${getTodayDateString()}T12:00:00`,
    endTime: `${getTodayDateString()}T18:00:00`,
    useGrill: true,
    status: 'CONFIRMED',
    isOverWeeklyQuota: false,
    googleCalendarEventId: 'gcal-evt-101',
    googleDriveFolderUrl: 'https://drive.google.com/drive/folders/quincho_4b_101',
    photosBefore: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400'],
    photosAfter: [],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'res-102',
    amenityId: 'amenity-parrilla-terraza',
    amenityName: 'Parrilla Terraza Norte',
    userId: 'usr-res-2',
    userName: 'Mariana López',
    apartment: '8A',
    userEmail: 'mariana.8a@edificio.com',
    date: getTodayDateString(),
    shift: 'NIGHT',
    shiftLabel: 'Noche (19:00 hs - 00:00 hs)',
    startTime: `${getTodayDateString()}T19:00:00`,
    endTime: `${getTodayDateString()}T23:59:59`,
    useGrill: true,
    status: 'CHECKED_IN',
    isOverWeeklyQuota: false,
    checkedInAt: `${getTodayDateString()}T19:12:00`,
    googleCalendarEventId: 'gcal-evt-102',
    googleDriveFolderUrl: 'https://drive.google.com/drive/folders/parrilla_8a_102',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

let invitesStore: GuestInvite[] = [
  {
    id: 'inv-1',
    bookingId: 'res-101',
    residentName: 'Pablo Gómez',
    apartment: '4B',
    guestName: 'Lucía Fernández',
    guestDni: '38.452.119',
    date: getTodayDateString(),
    shiftLabel: 'Almuerzo (12:00 hs - 18:00 hs)',
    qrCodeData: 'QR-RES101-GUEST-38452119',
    expirationDate: getTodayDateString(),
    status: 'VALID',
  },
];

// Visitor Access Log Store (Bitácora de Accesos)
let visitorLogsStore: VisitorAccessLog[] = [
  {
    id: 'vlog-1',
    inviteId: 'inv-sample-0',
    guestName: 'Esteban Quito',
    guestDni: '35.123.456',
    residentName: 'Pablo Gómez',
    apartment: '4B',
    date: getTodayDateString(),
    entryTimestamp: new Date(Date.now() - 7200000).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
    guardName: 'Carlos Ramírez (Conserjería)',
    status: 'PERMITTED',
  },
];

export const BookingStore = {
  getAmenities(): Amenity[] {
    return amenitiesStore.filter((a) => a.active !== false);
  },

  getAllAmenitiesAdmin(): Amenity[] {
    return [...amenitiesStore];
  },

  saveAmenity(amenityData: Partial<Amenity>): Amenity {
    if (amenityData.id) {
      const index = amenitiesStore.findIndex((a) => a.id === amenityData.id);
      if (index !== -1) {
        amenitiesStore[index] = { ...amenitiesStore[index], ...amenityData };
        return amenitiesStore[index];
      }
    }

    const newAmenity: Amenity = {
      id: `amenity-${Date.now().toString().slice(-4)}`,
      name: amenityData.name || 'Nuevo Amenity',
      description: amenityData.description || '',
      maxCapacity: amenityData.maxCapacity || 10,
      location: amenityData.location || 'Planta Baja',
      requiresPhotos: amenityData.requiresPhotos ?? true,
      hasGrill: amenityData.hasGrill ?? false,
      image: amenityData.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600',
      rules: amenityData.rules || ['Cumplir el reglamento del consorcio'],
      active: true,
    };
    amenitiesStore = [newAmenity, ...amenitiesStore];
    return newAmenity;
  },

  toggleAmenityActive(amenityId: string): void {
    const item = amenitiesStore.find((a) => a.id === amenityId);
    if (item) item.active = !item.active;
  },

  deleteAmenity(amenityId: string): void {
    amenitiesStore = amenitiesStore.filter((a) => a.id !== amenityId);
  },

  getUsers(): User[] {
    return [...usersStore];
  },

  saveUser(userData: Partial<User>): User {
    if (userData.id) {
      const index = usersStore.findIndex((u) => u.id === userData.id);
      if (index !== -1) {
        usersStore[index] = { ...usersStore[index], ...userData };
        return usersStore[index];
      }
    }

    const newUser: User = {
      id: `usr-res-${Date.now().toString().slice(-4)}`,
      name: userData.name || 'Nuevo Residente',
      email: userData.email || 'residente@edificio.com',
      role: userData.role || 'RESIDENT',
      apartment: userData.apartment || '1A',
      phone: userData.phone || '',
      avatarUrl: userData.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      status: 'ACTIVE',
    };
    usersStore = [newUser, ...usersStore];
    return newUser;
  },

  deleteUser(userId: string): void {
    usersStore = usersStore.filter((u) => u.id !== userId);
  },

  getPenalties(): Penalty[] {
    return [...penaltiesStore];
  },

  getUserActivePenalty(userId: string): Penalty | null {
    const todayStr = getTodayDateString();
    return (
      penaltiesStore.find(
        (p) => p.userId === userId && p.active && p.endDate >= todayStr
      ) || null
    );
  },

  async issuePenalty(params: {
    userId: string;
    reason: string;
    type: PenaltyType;
    durationDays: number;
  }): Promise<Penalty> {
    const { userId, reason, type, durationDays } = params;
    const user = usersStore.find((u) => u.id === userId);
    if (!user) throw new Error('Usuario no encontrado');

    const startDate = getTodayDateString();
    const endDateObj = new Date();
    endDateObj.setDate(endDateObj.getDate() + durationDays);
    const endDate = endDateObj.toISOString().split('T')[0];

    const typeLabel =
      type === 'SUSPENSION'
        ? `Suspensión total de reservas (${durationDays} días)`
        : `Reducción de cupo semanal a 1 reserva (${durationDays} días)`;

    const penalty: Penalty = {
      id: `pen-${Date.now().toString().slice(-4)}`,
      userId: user.id,
      residentName: user.name,
      apartment: user.apartment,
      reason,
      type,
      typeLabel,
      startDate,
      endDate,
      active: true,
      createdAt: new Date().toISOString(),
    };

    penaltiesStore = [penalty, ...penaltiesStore];

    if (type === 'SUSPENSION') {
      user.status = 'SUSPENDED';
    }

    await GmailService.sendPenaltyNotice(user.email, user.name, reason, typeLabel, endDate);
    return penalty;
  },

  revokePenalty(penaltyId: string): void {
    const pen = penaltiesStore.find((p) => p.id === penaltyId);
    if (pen) {
      pen.active = false;
      const user = usersStore.find((u) => u.id === pen.userId);
      if (user) user.status = 'ACTIVE';
    }
  },

  getAllBookings(): Booking[] {
    return [...bookingsStore];
  },

  getUserBookings(userId: string): Booking[] {
    return bookingsStore.filter((b) => b.userId === userId);
  },

  getWeeklyCount(apartment: string, targetDateStr: string): number {
    const target = new Date(`${targetDateStr}T00:00:00`);
    const day = target.getDay() || 7;
    const monday = new Date(target);
    monday.setDate(target.getDate() - day + 1);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const mondayStr = monday.toISOString().split('T')[0];
    const sundayStr = sunday.toISOString().split('T')[0];

    return bookingsStore.filter((b) => {
      return (
        b.apartment === apartment &&
        b.date >= mondayStr &&
        b.date <= sundayStr &&
        b.status !== 'CANCELLED_RESIDENT' &&
        b.status !== 'REVOKED_ADMIN' &&
        b.status !== 'NO_SHOW'
      );
    }).length;
  },

  isSlotOccupied(amenityId: string, date: string, shift: ShiftType): boolean {
    return bookingsStore.some(
      (b) =>
        b.amenityId === amenityId &&
        b.date === date &&
        b.shift === shift &&
        b.status !== 'CANCELLED_RESIDENT' &&
        b.status !== 'REVOKED_ADMIN' &&
        b.status !== 'NO_SHOW'
    );
  },

  async createBooking(params: {
    amenityId: string;
    userId: string;
    date: string;
    shift: ShiftType;
    useGrill: boolean;
  }): Promise<{ booking: Booking; message: string }> {
    const { amenityId, userId, date, shift, useGrill } = params;

    const amenity = amenitiesStore.find((a) => a.id === amenityId);
    const user = usersStore.find((u) => u.id === userId);

    if (!amenity || !user) {
      throw new Error('Amenity o Usuario no encontrado');
    }

    const activePenalty = this.getUserActivePenalty(userId);
    if (activePenalty && activePenalty.type === 'SUSPENSION') {
      throw new Error(
        `⛔ RESERVA BLOQUEADA POR SANCIÓN: Posees una suspensión activa emitida por la Administración (${activePenalty.reason}). Vigente hasta el ${activePenalty.endDate}.`
      );
    }

    if (this.isSlotOccupied(amenityId, date, shift)) {
      throw new Error('El horario seleccionado ya se encuentra reservado por otro vecino.');
    }

    const currentWeeklyCount = this.getWeeklyCount(user.apartment, date);
    const maxFreeQuota = activePenalty && activePenalty.type === 'QUOTA_REDUCTION' ? 1 : 3;
    const isOverQuota = currentWeeklyCount >= maxFreeQuota;
    const initialStatus: BookingStatus = isOverQuota ? 'PENDING_GUARD' : 'CONFIRMED';

    const shiftInfo = getShiftInfo(date, shift);
    const bookingId = `res-${Date.now().toString().slice(-5)}`;

    const gcalId = await GoogleCalendarService.createEvent(
      amenity.name,
      date,
      shiftInfo.label,
      user.name,
      user.apartment
    );

    const driveFolder = await GoogleDriveService.createReservationFolder(bookingId, amenity.name, date);

    const newBooking: Booking = {
      id: bookingId,
      amenityId: amenity.id,
      amenityName: amenity.name,
      userId: user.id,
      userName: user.name,
      apartment: user.apartment,
      userEmail: user.email,
      date,
      shift,
      shiftLabel: shiftInfo.label,
      startTime: shiftInfo.startTime,
      endTime: shiftInfo.endTime,
      useGrill,
      status: initialStatus,
      isOverWeeklyQuota: isOverQuota,
      googleCalendarEventId: gcalId,
      googleDriveFolderUrl: driveFolder,
      photosBefore: [],
      photosAfter: [],
      createdAt: new Date().toISOString(),
    };

    bookingsStore = [newBooking, ...bookingsStore];

    if (isOverQuota) {
      await GmailService.sendQuotaWarningGuardNotification(
        'guardia@edificio.com',
        user.name,
        user.apartment,
        amenity.name,
        date
      );
    } else {
      await GmailService.sendBookingConfirmation(
        user.email,
        user.name,
        amenity.name,
        date,
        shiftInfo.label,
        useGrill
      );
    }

    const msg = isOverQuota
      ? '¡Solicitud registrada! Superaste tu cupo semanal disponible y la reserva quedó pendiente de aprobación por el Guardia.'
      : '¡Reserva confirmada con éxito! Sincronizada con Google Calendar y notificada por correo.';

    return { booking: newBooking, message: msg };
  },

  async checkIn(bookingId: string): Promise<Booking> {
    const booking = bookingsStore.find((b) => b.id === bookingId);
    if (!booking) throw new Error('Reserva no encontrada');

    booking.status = 'CHECKED_IN';
    booking.checkedInAt = new Date().toISOString();

    await GoogleCalendarService.updateEvent(
      booking.googleCalendarEventId || '',
      `Reserva CHECKED-IN por ${booking.userName} a las ${new Date().toLocaleTimeString()}`
    );

    return { ...booking };
  },

  async cancelByResident(bookingId: string): Promise<void> {
    const booking = bookingsStore.find((b) => b.id === bookingId);
    if (!booking) throw new Error('Reserva no encontrada');

    booking.status = 'CANCELLED_RESIDENT';

    if (booking.googleCalendarEventId) {
      await GoogleCalendarService.deleteEvent(
        booking.googleCalendarEventId,
        booking.amenityName,
        'Cancelada directamente por el residente'
      );
    }
  },

  async revokeByAdmin(bookingId: string, reason: string): Promise<void> {
    const booking = bookingsStore.find((b) => b.id === bookingId);
    if (!booking) throw new Error('Reserva no encontrada');

    booking.status = 'REVOKED_ADMIN';
    booking.adminNote = reason;

    if (booking.googleCalendarEventId) {
      await GoogleCalendarService.deleteEvent(
        booking.googleCalendarEventId,
        booking.amenityName,
        `Revocada por Administrador: ${reason}`
      );
    }

    await GmailService.sendRevocationNotice(booking.userEmail, booking.userName, booking.amenityName, booking.date, reason);
  },

  async approveByGuard(bookingId: string): Promise<void> {
    const booking = bookingsStore.find((b) => b.id === bookingId);
    if (!booking) throw new Error('Reserva no encontrada');

    booking.status = 'CONFIRMED';
    await GmailService.sendBookingConfirmation(
      booking.userEmail,
      booking.userName,
      booking.amenityName,
      booking.date,
      booking.shiftLabel,
      booking.useGrill
    );
  },

  async rejectByGuard(bookingId: string, reason: string): Promise<void> {
    const booking = bookingsStore.find((b) => b.id === bookingId);
    if (!booking) throw new Error('Reserva no encontrada');

    booking.status = 'REVOKED_ADMIN';
    booking.adminNote = `Rechazada por Guardia: ${reason}`;

    if (booking.googleCalendarEventId) {
      await GoogleCalendarService.deleteEvent(booking.googleCalendarEventId, booking.amenityName, 'Excepción semanal rechazada por Guardia');
    }
  },

  async addPhoto(bookingId: string, type: 'before' | 'after', photoUrl: string): Promise<void> {
    const booking = bookingsStore.find((b) => b.id === bookingId);
    if (!booking) throw new Error('Reserva no encontrada');

    const driveUrl = await GoogleDriveService.uploadInspectionPhoto(
      booking.googleDriveFolderUrl || '',
      type,
      `foto_${type}_${Date.now()}.jpg`
    );

    if (type === 'before') {
      booking.photosBefore = [...(booking.photosBefore || []), photoUrl || driveUrl];
    } else {
      booking.photosAfter = [...(booking.photosAfter || []), photoUrl || driveUrl];
    }
  },

  async triggerNoShowScan(): Promise<{ processedCount: number }> {
    const now = new Date();
    let count = 0;

    for (const b of bookingsStore) {
      if ((b.status === 'CONFIRMED' || b.status === 'PENDING_GUARD') && !b.checkedInAt) {
        const startTime = new Date(b.startTime);
        const elapsedMinutes = (now.getTime() - startTime.getTime()) / (1000 * 60);

        if (elapsedMinutes > 30) {
          b.status = 'NO_SHOW';
          count++;

          if (b.googleCalendarEventId) {
            await GoogleCalendarService.deleteEvent(b.googleCalendarEventId, b.amenityName, 'Liberación automática por NO-SHOW (30 min sin check-in)');
          }

          await GmailService.sendNoShowCancellationNotice(b.userEmail, b.userName, b.amenityName, b.date);
        }
      }
    }

    return { processedCount: count };
  },

  getInvites(): GuestInvite[] {
    return [...invitesStore];
  },

  async createGuestInvite(bookingId: string, guestName: string, guestDni: string): Promise<GuestInvite> {
    const booking = bookingsStore.find((b) => b.id === bookingId);
    if (!booking) throw new Error('Reserva no encontrada');

    const qrData = `QR-${booking.id}-GUEST-${guestDni.replace(/\./g, '')}-${Date.now().toString().slice(-4)}`;
    const invite: GuestInvite = {
      id: `inv-${Date.now().toString().slice(-5)}`,
      bookingId: booking.id,
      residentName: booking.userName,
      apartment: booking.apartment,
      guestName,
      guestDni,
      date: booking.date,
      shiftLabel: booking.shiftLabel,
      qrCodeData: qrData,
      expirationDate: booking.date, // QR is valid ONLY for booking date
      status: 'VALID',
    };

    invitesStore = [invite, ...invitesStore];

    await GmailService.sendGuestInvitePass(
      booking.userEmail,
      guestName,
      booking.userName,
      booking.date,
      qrData
    );

    return invite;
  },

  // EXPIRATION & RE-USE CHECK IN QR VALIDATION
  validateGuestInvite(qrData: string): { success: boolean; invite?: GuestInvite; message: string } {
    const invite = invitesStore.find((i) => i.qrCodeData === qrData || i.id === qrData);
    const todayStr = getTodayDateString();

    if (!invite) {
      return { success: false, message: 'Código QR no reconocido en la base de datos del edificio.' };
    }

    // CHECK EXPIRATION DATE
    if (invite.expirationDate < todayStr || invite.date !== todayStr) {
      invite.status = 'EXPIRED';

      // Log denied attempt in Visitor Access Log
      this.recordVisitorAccessLog({
        inviteId: invite.id,
        guestName: invite.guestName,
        guestDni: invite.guestDni,
        residentName: invite.residentName,
        apartment: invite.apartment,
        date: todayStr,
        status: 'DENIED_EXPIRED',
      });

      return {
        success: false,
        invite,
        message: `🔴 CÓDIGO QR CADUCADO: Este pase expiró el ${invite.expirationDate} y no es válido para hoy (${todayStr}).`,
      };
    }

    // CHECK RE-USE
    if (invite.status === 'USED') {
      this.recordVisitorAccessLog({
        inviteId: invite.id,
        guestName: invite.guestName,
        guestDni: invite.guestDni,
        residentName: invite.residentName,
        apartment: invite.apartment,
        date: todayStr,
        status: 'DENIED_REUSED',
      });

      return {
        success: false,
        invite,
        message: `⚠️ REENTRADA DENEGADA: Este pase QR de visita ya fue utilizado el ${invite.usedAt}.`,
      };
    }

    // VALID ACCESS: MARK USED AND LOG ACCESS
    invite.status = 'USED';
    invite.usedAt = new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

    this.recordVisitorAccessLog({
      inviteId: invite.id,
      guestName: invite.guestName,
      guestDni: invite.guestDni,
      residentName: invite.residentName,
      apartment: invite.apartment,
      date: todayStr,
      status: 'PERMITTED',
    });

    return {
      success: true,
      invite,
      message: `¡ACCESO PERMITIDO Y ASENTADO! Invitado/a ${invite.guestName} (DNI ${invite.guestDni}) autorizados por Dpto ${invite.apartment}.`,
    };
  },

  // VISITOR ACCESS LOGS (BITÁCORA DE VISITAS)
  getVisitorLogs(): VisitorAccessLog[] {
    return [...visitorLogsStore];
  },

  recordVisitorAccessLog(params: {
    inviteId: string;
    guestName: string;
    guestDni: string;
    residentName: string;
    apartment: string;
    date: string;
    status: 'PERMITTED' | 'DENIED_EXPIRED' | 'DENIED_REUSED';
  }): VisitorAccessLog {
    const newLog: VisitorAccessLog = {
      id: `vlog-${Date.now().toString().slice(-4)}`,
      inviteId: params.inviteId,
      guestName: params.guestName,
      guestDni: params.guestDni,
      residentName: params.residentName,
      apartment: params.apartment,
      date: params.date,
      entryTimestamp: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
      guardName: 'Carlos Ramírez (Conserjería)',
      status: params.status,
    };
    visitorLogsStore = [newLog, ...visitorLogsStore];
    return newLog;
  }
};
