-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'TEAM');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "LeadType" AS ENUM ('OWNER', 'CUSTOMER', 'CLEANER');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'SIGNED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "PropertyStatus" AS ENUM ('ACTIVE', 'MAINTENANCE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'DONE', 'BLOCKED');

-- CreateEnum
CREATE TYPE "ProjectPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "RentStatus" AS ENUM ('PENDING', 'PAID', 'OVERDUE');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('INCOME', 'EXPENSE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'TEAM',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "LeadType" NOT NULL,
    "contactInfo" TEXT,
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "unit" TEXT,
    "address" TEXT NOT NULL,
    "listingUrl" TEXT,
    "vrboListingUrl" TEXT,
    "airbnbUrl" TEXT,
    "vrboUrl" TEXT,
    "otherUrl" TEXT,
    "hospitableUrl" TEXT,
    "directBookingUrl" TEXT,
    "images" TEXT,
    "maxOccupancy" INTEGER,
    "description" TEXT,
    "bedrooms" INTEGER,
    "beds" INTEGER,
    "bedSetup" TEXT,
    "bathrooms" DECIMAL(65,30),
    "squareFeet" INTEGER,
    "type" TEXT,
    "checkInTime" TEXT,
    "checkOutTime" TEXT,
    "petsAllowed" BOOLEAN NOT NULL DEFAULT false,
    "maxPets" INTEGER NOT NULL DEFAULT 0,
    "petFee" DECIMAL(65,30),
    "petPolicy" TEXT,
    "petNotes" TEXT,
    "petPaymentMethod" TEXT,
    "entryMethod" TEXT,
    "accessInstructions" TEXT,
    "lockboxLocation" TEXT,
    "lockboxCode" TEXT,
    "keyWorksAt" TEXT,
    "backupKeyLocation" TEXT,
    "backupKeyCode" TEXT,
    "spareKeyContactNeeded" BOOLEAN NOT NULL DEFAULT false,
    "emergencyCode" TEXT,
    "parkingInstructions" TEXT,
    "maxVehicles" INTEGER,
    "parkingPassesNeeded" BOOLEAN NOT NULL DEFAULT false,
    "wifiName" TEXT,
    "wifiPassword" TEXT,
    "modemLocation" TEXT,
    "guestModemAccess" BOOLEAN NOT NULL DEFAULT false,
    "ispProvider" TEXT,
    "breakerLocation" TEXT,
    "guestBreakerAccess" BOOLEAN NOT NULL DEFAULT false,
    "thermostatLocation" TEXT,
    "thermostatControl" TEXT,
    "tvLocations" TEXT,
    "smartTv" BOOLEAN NOT NULL DEFAULT false,
    "hasStove" BOOLEAN NOT NULL DEFAULT true,
    "hasDishwasher" BOOLEAN NOT NULL DEFAULT true,
    "dishwasherNotes" TEXT,
    "iceMakerStatus" TEXT,
    "garbageDisposalInfo" TEXT,
    "coffeeMakerType" TEXT,
    "applianceNotes" TEXT,
    "outdoorShower" TEXT,
    "backyardAccess" TEXT,
    "porchPatioNotes" TEXT,
    "grillType" TEXT,
    "grillLocation" TEXT,
    "grillFuelProvided" BOOLEAN NOT NULL DEFAULT false,
    "outdoorNotes" TEXT,
    "beachTowels" INTEGER,
    "beachGearLocation" TEXT,
    "bikesProvided" BOOLEAN NOT NULL DEFAULT false,
    "bikeCount" INTEGER NOT NULL DEFAULT 0,
    "bikeLocation" TEXT,
    "bikesShared" BOOLEAN NOT NULL DEFAULT false,
    "lockCodeYellow" TEXT,
    "lockCodeBlue" TEXT,
    "lockCodeWhite" TEXT,
    "lockCodeRed" TEXT,
    "quietHours" TEXT,
    "smokingPolicy" TEXT,
    "otherRestrictions" TEXT,
    "otherKeyLocations" TEXT,
    "ownerNotes" TEXT,
    "managementContact" TEXT,
    "trashPickupDays" TEXT,
    "trashInstructions" TEXT,
    "checkOutText" TEXT,
    "checkOutNotes" TEXT,
    "guideUrl" TEXT,
    "photoFolderUrl" TEXT,
    "otherLinks" TEXT,
    "generalNotes" TEXT,
    "lostAndFoundPolicy" TEXT,
    "minNightlyRate" DECIMAL(65,30),
    "minStay" INTEGER,
    "cleaningFee" DECIMAL(65,30),
    "status" "PropertyStatus" NOT NULL DEFAULT 'ACTIVE',
    "hospitableId" TEXT,
    "ownerId" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "activeYears" INTEGER NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "propertyId" TEXT,
    "assignedToId" TEXT,
    "reservationId" TEXT,
    "dueDate" TIMESTAMP(3),
    "status" "ProjectStatus" NOT NULL DEFAULT 'TODO',
    "priority" "ProjectPriority" NOT NULL DEFAULT 'MEDIUM',
    "importanceLevel" INTEGER NOT NULL DEFAULT 3,
    "checkInDate" TIMESTAMP(3),
    "checkOutDate" TIMESTAMP(3),
    "customerName" TEXT,
    "nightStay" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" TEXT NOT NULL,
    "guestName" TEXT NOT NULL,
    "adults" INTEGER NOT NULL DEFAULT 1,
    "children" INTEGER NOT NULL DEFAULT 0,
    "infants" INTEGER NOT NULL DEFAULT 0,
    "pets" INTEGER NOT NULL DEFAULT 0,
    "petNote" TEXT,
    "checkIn" TIMESTAMP(3) NOT NULL,
    "checkOut" TIMESTAMP(3) NOT NULL,
    "earlyCheckIn" BOOLEAN NOT NULL DEFAULT false,
    "lateCheckOut" BOOLEAN NOT NULL DEFAULT false,
    "totalPrice" DECIMAL(65,30) NOT NULL,
    "accommodationFare" DECIMAL(65,30) NOT NULL,
    "cleaningFee" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "petFee" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "hostServiceFee" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "guestServiceFee" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "dareTax" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "ncTax" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubProject" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "projectId" TEXT NOT NULL,
    "assignedToId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RentRecord" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "paidDate" TIMESTAMP(3),
    "status" "RentStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RentRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Platform" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "apiSecret" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Platform_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "type" "TransactionType" NOT NULL,
    "category" TEXT,
    "propertyId" TEXT,
    "leadId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_status_idx" ON "User"("status");

-- CreateIndex
CREATE INDEX "Lead_type_idx" ON "Lead"("type");

-- CreateIndex
CREATE INDEX "Lead_status_idx" ON "Lead"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Property_hospitableId_key" ON "Property"("hospitableId");

-- CreateIndex
CREATE INDEX "Property_ownerId_idx" ON "Property"("ownerId");

-- CreateIndex
CREATE INDEX "Property_status_idx" ON "Property"("status");

-- CreateIndex
CREATE INDEX "Project_propertyId_idx" ON "Project"("propertyId");

-- CreateIndex
CREATE INDEX "Project_assignedToId_idx" ON "Project"("assignedToId");

-- CreateIndex
CREATE INDEX "Project_reservationId_idx" ON "Project"("reservationId");

-- CreateIndex
CREATE INDEX "Project_status_idx" ON "Project"("status");

-- CreateIndex
CREATE INDEX "Project_priority_idx" ON "Project"("priority");

-- CreateIndex
CREATE INDEX "SubProject_projectId_idx" ON "SubProject"("projectId");

-- CreateIndex
CREATE INDEX "SubProject_assignedToId_idx" ON "SubProject"("assignedToId");

-- CreateIndex
CREATE INDEX "Note_projectId_idx" ON "Note"("projectId");

-- CreateIndex
CREATE INDEX "Note_authorId_idx" ON "Note"("authorId");

-- CreateIndex
CREATE INDEX "RentRecord_propertyId_idx" ON "RentRecord"("propertyId");

-- CreateIndex
CREATE INDEX "RentRecord_status_idx" ON "RentRecord"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Platform_name_key" ON "Platform"("name");

-- CreateIndex
CREATE INDEX "Transaction_type_idx" ON "Transaction"("type");

-- CreateIndex
CREATE INDEX "Transaction_date_idx" ON "Transaction"("date");

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubProject" ADD CONSTRAINT "SubProject_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubProject" ADD CONSTRAINT "SubProject_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentRecord" ADD CONSTRAINT "RentRecord_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;
