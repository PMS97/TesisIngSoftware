-- ================================================================
-- TABLAS PARA SUPABASE (POSTGRESQL) - EDIFICIO AMENITIES PLATFORM
-- Copia y pega este contenido en el SQL Editor de tu proyecto en Supabase
-- ================================================================

-- 1. Crear ENUMs
CREATE TYPE "Role" AS ENUM ('RESIDENT', 'GUARD', 'ADMIN');
CREATE TYPE "ShiftType" AS ENUM ('LUNCH', 'NIGHT');
CREATE TYPE "BookingStatus" AS ENUM (
  'CONFIRMED', 
  'PENDING_GUARD', 
  'CHECKED_IN', 
  'COMPLETED', 
  'NO_SHOW', 
  'REVOKED_ADMIN', 
  'CANCELLED_RESIDENT'
);
CREATE TYPE "InviteStatus" AS ENUM ('VALID', 'USED', 'EXPIRED');

-- 2. Tabla Usuarios
CREATE TABLE "User" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL,
  "email" TEXT UNIQUE NOT NULL,
  "role" "Role" NOT NULL DEFAULT 'RESIDENT',
  "apartment" TEXT NOT NULL,
  "phone" TEXT,
  "avatarUrl" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabla Amenities
CREATE TABLE "Amenity" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "maxCapacity" INT NOT NULL,
  "location" TEXT NOT NULL,
  "requiresPhotos" BOOLEAN DEFAULT TRUE,
  "hasGrill" BOOLEAN DEFAULT FALSE,
  "image" TEXT NOT NULL,
  "rules" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabla Reservas
CREATE TABLE "Booking" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "amenityId" TEXT NOT NULL REFERENCES "Amenity"("id"),
  "userId" TEXT NOT NULL REFERENCES "User"("id"),
  "userName" TEXT NOT NULL,
  "apartment" TEXT NOT NULL,
  "userEmail" TEXT NOT NULL,
  "date" TEXT NOT NULL,
  "shift" "ShiftType" NOT NULL,
  "shiftLabel" TEXT NOT NULL,
  "startTime" TIMESTAMP WITH TIME ZONE NOT NULL,
  "endTime" TIMESTAMP WITH TIME ZONE NOT NULL,
  "useGrill" BOOLEAN DEFAULT FALSE,
  "status" "BookingStatus" DEFAULT 'CONFIRMED',
  "isOverWeeklyQuota" BOOLEAN DEFAULT FALSE,
  "checkedInAt" TIMESTAMP WITH TIME ZONE,
  "googleCalendarEventId" TEXT,
  "googleDriveFolderUrl" TEXT,
  "photosBefore" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "photosAfter" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "adminNote" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabla Invitaciones QR Visitas
CREATE TABLE "GuestInvite" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "bookingId" TEXT NOT NULL REFERENCES "Booking"("id") ON DELETE CASCADE,
  "residentName" TEXT NOT NULL,
  "apartment" TEXT NOT NULL,
  "guestName" TEXT NOT NULL,
  "guestDni" TEXT NOT NULL,
  "date" TEXT NOT NULL,
  "shiftLabel" TEXT NOT NULL,
  "qrCodeData" TEXT UNIQUE NOT NULL,
  "status" "InviteStatus" DEFAULT 'VALID',
  "usedAt" TIMESTAMP WITH TIME ZONE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Tabla Auditoría Google Logs
CREATE TABLE "GoogleLog" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "timestamp" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "service" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "details" TEXT NOT NULL,
  "status" TEXT NOT NULL
);

-- 7. Datos Iniciales de Amenities (Semilla)
INSERT INTO "Amenity" ("id", "name", "description", "maxCapacity", "location", "requiresPhotos", "hasGrill", "image", "rules")
VALUES 
(
  'amenity-quincho-1',
  'Quincho Principal',
  'Espacio totalmente equipado con vajilla, aire acondicionado y TV 65". Incluye parrilla tradicional a carbón/leña.',
  25,
  'Planta Baja - Sector Jardín',
  TRUE,
  TRUE,
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
  ARRAY['Dejar el espacio limpio.', 'Cargar foto antes y después en Drive.', 'Horario de silencio a partir de 00:00 hs.']
),
(
  'amenity-parrilla-terraza',
  'Parrilla Terraza Norte',
  'Parrilla al aire libre en la terraza del piso 14 con pérgola y vista panorámica a la ciudad.',
  12,
  'Piso 14 - Terraza',
  TRUE,
  TRUE,
  'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600&auto=format&fit=crop&q=80',
  ARRAY['Uso exclusivo de parrilla.', 'Apagar brasas al finalizar.']
),
(
  'amenity-sum',
  'SUM Eventos y Cumpleaños',
  'Salón de usos múltiples climatizado con cocina equipada, livings y mesas modulares.',
  40,
  'Piso 1 - Mezzanine',
  FALSE,
  FALSE,
  'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&auto=format&fit=crop&q=80',
  ARRAY['Prohibido pirotecnia.', 'Respetar horario de silencio.']
),
(
  'amenity-piscina',
  'Solarium & Piscina',
  'Área de reposeras y piscina climatizada al aire libre.',
  15,
  'Piso 14 - Terraza Sur',
  FALSE,
  FALSE,
  'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=600&auto=format&fit=crop&q=80',
  ARRAY['Ducharse antes de ingresar.', 'No ingresar con vasos de vidrio.']
);
