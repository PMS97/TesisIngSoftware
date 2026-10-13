import { GoogleServiceLog } from '@/types';

let serviceLogs: GoogleServiceLog[] = [
  {
    id: 'log-1',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    service: 'CALENDAR',
    action: 'CREATE_EVENT',
    details: 'Evento creado en Google Calendar "Quincho Principal" (Turno Noche 19:00 - 00:00)',
    status: 'SUCCESS',
  },
  {
    id: 'log-2',
    timestamp: new Date(Date.now() - 3500000).toISOString(),
    service: 'DRIVE',
    action: 'CREATE_FOLDER',
    details: 'Carpeta creada en Drive: /Amenities_Edificio/Reservas/2026-09/Reserva_RES-101',
    status: 'SUCCESS',
  },
  {
    id: 'log-3',
    timestamp: new Date(Date.now() - 3400000).toISOString(),
    service: 'GMAIL',
    action: 'SEND_EMAIL',
    details: 'Correo enviado a residente@edificio.com: Confirmación de reserva Quincho con QR de acceso',
    status: 'SUCCESS',
  },
];

export function getGoogleLogs(): GoogleServiceLog[] {
  return [...serviceLogs];
}

function addLog(service: 'CALENDAR' | 'DRIVE' | 'GMAIL', action: string, details: string, status: 'SUCCESS' | 'WARNING' | 'ERROR' = 'SUCCESS') {
  const newLog: GoogleServiceLog = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    service,
    action,
    details,
    status,
  };
  serviceLogs = [newLog, ...serviceLogs];
}

export const GoogleCalendarService = {
  async createEvent(amenityName: string, date: string, shiftLabel: string, residentName: string, apartment: string): Promise<string> {
    const eventId = `gcal-evt-${Date.now()}`;
    addLog('CALENDAR', 'CREATE_EVENT', `Sincronizado evento en Google Calendar "${amenityName}" para ${residentName} (Dpto ${apartment}) - ${date} [${shiftLabel}]`);
    return eventId;
  },

  async deleteEvent(eventId: string, amenityName: string, reason: string): Promise<void> {
    addLog('CALENDAR', 'DELETE_EVENT', `Evento de Google Calendar [${eventId}] liberado/eliminado para "${amenityName}". Motivo: ${reason}`);
  },

  async updateEvent(eventId: string, newDetails: string): Promise<void> {
    addLog('CALENDAR', 'UPDATE_EVENT', `Evento Google Calendar [${eventId}] actualizado. Detalles: ${newDetails}`);
  }
};

export const GoogleDriveService = {
  async createReservationFolder(bookingId: string, amenityName: string, date: string): Promise<string> {
    const folderUrl = `https://drive.google.com/drive/folders/edificio_amenities_${bookingId}`;
    addLog('DRIVE', 'CREATE_FOLDER', `Carpeta creada en Google Drive: /Amenities_Edificio/${amenityName}/${date}/Reserva_${bookingId}`);
    return folderUrl;
  },

  async uploadInspectionPhoto(folderUrl: string, type: 'before' | 'after', fileName: string): Promise<string> {
    const photoUrl = `${folderUrl}/${type}_${Date.now()}_${fileName}`;
    addLog('DRIVE', 'UPLOAD_FILE', `Foto de estado (${type === 'before' ? 'ANTES/ENTREGA' : 'DESPUÉS/LIMPIEZA'}) guardada en Drive: ${fileName}`);
    return photoUrl;
  }
};

export const GmailService = {
  async sendBookingConfirmation(toEmail: string, residentName: string, amenityName: string, date: string, shiftLabel: string, useGrill: boolean): Promise<void> {
    addLog('GMAIL', 'SEND_CONFIRMATION', `Correo enviado a ${toEmail} (${residentName}): Confirmación directa de reserva en ${amenityName} para el ${date} (${shiftLabel}). Uso de Parrilla: ${useGrill ? 'SÍ' : 'NO'}.`);
  },

  async sendQuotaWarningGuardNotification(guardEmail: string, residentName: string, apartment: string, amenityName: string, date: string): Promise<void> {
    addLog('GMAIL', 'GUARD_ALERT', `Notificación enviada a Guardia (${guardEmail}): El residente ${residentName} (Dpto ${apartment}) solicitó su 4ta reserva semanal.`);
  },

  async sendRevocationNotice(toEmail: string, residentName: string, amenityName: string, date: string, reason: string): Promise<void> {
    addLog('GMAIL', 'REVOCATION_NOTICE', `Notificación enviada a ${toEmail}: Reserva de ${amenityName} REVOCADA por la Administración. Motivo: "${reason}".`, 'WARNING');
  },

  async sendNoShowCancellationNotice(toEmail: string, residentName: string, amenityName: string, date: string): Promise<void> {
    addLog('GMAIL', 'NO_SHOW_NOTICE', `Alerta enviada a ${toEmail}: Reserva de ${amenityName} cancelada por NO-SHOW (30 min sin Check-in).`, 'WARNING');
  },

  async sendPenaltyNotice(toEmail: string, residentName: string, reason: string, penaltyType: string, endDate: string): Promise<void> {
    addLog('GMAIL', 'PENALTY_NOTICE', `SANCIÓN EMITIDA enviada a ${toEmail} (${residentName}): ${penaltyType}. Motivo: "${reason}". Vigente hasta: ${endDate}`, 'ERROR');
  },

  async sendGuestInvitePass(toEmail: string, guestName: string, residentName: string, date: string, qrCodeData: string): Promise<void> {
    addLog('GMAIL', 'SEND_GUEST_PASS', `Pase de visita digital con QR temporal enviado a ${toEmail} para el invitado ${guestName} (Referenciado por ${residentName}) - Válido fecha: ${date}`);
  }
};
