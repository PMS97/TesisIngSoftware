export type Role = 'RESIDENT' | 'GUARD' | 'ADMIN';

export type ShiftType = 'LUNCH' | 'NIGHT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  apartment: string;
  phone?: string;
  avatarUrl?: string;
  status?: 'ACTIVE' | 'SUSPENDED';
}

export interface Amenity {
  id: string;
  name: string;
  description: string;
  maxCapacity: number;
  location: string;
  requiresPhotos: boolean;
  hasGrill: boolean;
  image: string;
  rules: string[];
  active?: boolean;
}

export type BookingStatus =
  | 'CONFIRMED'
  | 'PENDING_GUARD'
  | 'CHECKED_IN'
  | 'COMPLETED'
  | 'NO_SHOW'
  | 'REVOKED_ADMIN'
  | 'CANCELLED_RESIDENT';

export interface Booking {
  id: string;
  amenityId: string;
  amenityName: string;
  userId: string;
  userName: string;
  apartment: string;
  userEmail: string;
  date: string; // YYYY-MM-DD
  shift: ShiftType;
  shiftLabel: string;
  startTime: string;
  endTime: string;
  useGrill: boolean;
  status: BookingStatus;
  isOverWeeklyQuota: boolean;
  checkedInAt?: string;
  googleCalendarEventId?: string;
  googleDriveFolderUrl?: string;
  photosBefore?: string[];
  photosAfter?: string[];
  createdAt: string;
  adminNote?: string;
}

export interface GuestInvite {
  id: string;
  bookingId: string;
  residentName: string;
  apartment: string;
  guestName: string;
  guestDni: string;
  date: string;
  shiftLabel: string;
  qrCodeData: string;
  expirationDate: string; // YYYY-MM-DD
  status: 'VALID' | 'USED' | 'EXPIRED';
  usedAt?: string;
}

export interface VisitorAccessLog {
  id: string;
  inviteId: string;
  guestName: string;
  guestDni: string;
  residentName: string;
  apartment: string;
  date: string;
  entryTimestamp: string;
  guardName: string;
  status: 'PERMITTED' | 'DENIED_EXPIRED' | 'DENIED_REUSED';
}

export type PenaltyType = 'SUSPENSION' | 'QUOTA_REDUCTION';

export interface Penalty {
  id: string;
  userId: string;
  residentName: string;
  apartment: string;
  reason: string;
  type: PenaltyType;
  typeLabel: string;
  startDate: string;
  endDate: string;
  active: boolean;
  createdAt: string;
}

export interface GoogleServiceLog {
  id: string;
  timestamp: string;
  service: 'CALENDAR' | 'DRIVE' | 'GMAIL';
  action: string;
  details: string;
  status: 'SUCCESS' | 'WARNING' | 'ERROR';
}
