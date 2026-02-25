-- CreateTable
CREATE TABLE "Reservation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "guestName" TEXT NOT NULL,
    "adults" INTEGER NOT NULL DEFAULT 1,
    "children" INTEGER NOT NULL DEFAULT 0,
    "infants" INTEGER NOT NULL DEFAULT 0,
    "pets" INTEGER NOT NULL DEFAULT 0,
    "petNote" TEXT,
    "checkIn" DATETIME NOT NULL,
    "checkOut" DATETIME NOT NULL,
    "earlyCheckIn" BOOLEAN NOT NULL DEFAULT false,
    "lateCheckOut" BOOLEAN NOT NULL DEFAULT false,
    "totalPrice" DECIMAL NOT NULL,
    "accommodationFare" DECIMAL NOT NULL,
    "cleaningFee" DECIMAL NOT NULL DEFAULT 0,
    "petFee" DECIMAL NOT NULL DEFAULT 0,
    "hostServiceFee" DECIMAL NOT NULL DEFAULT 0,
    "guestServiceFee" DECIMAL NOT NULL DEFAULT 0,
    "dareTax" DECIMAL NOT NULL DEFAULT 0,
    "ncTax" DECIMAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SubProject" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "projectId" TEXT NOT NULL,
    "assignedToId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SubProject_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SubProject_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Note_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Note_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT NOT NULL,
    "amount" DECIMAL NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT,
    "propertyId" TEXT,
    "leadId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Transaction_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Transaction_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "propertyId" TEXT,
    "assignedToId" TEXT,
    "reservationId" TEXT,
    "dueDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'TODO',
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "importanceLevel" INTEGER NOT NULL DEFAULT 3,
    "checkInDate" DATETIME,
    "checkOutDate" DATETIME,
    "customerName" TEXT,
    "nightStay" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Project_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Project_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Project_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Project" ("assignedToId", "createdAt", "description", "dueDate", "id", "importanceLevel", "priority", "propertyId", "status", "title", "updatedAt") SELECT "assignedToId", "createdAt", "description", "dueDate", "id", "importanceLevel", "priority", "propertyId", "status", "title", "updatedAt" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
CREATE INDEX "Project_propertyId_idx" ON "Project"("propertyId");
CREATE INDEX "Project_assignedToId_idx" ON "Project"("assignedToId");
CREATE INDEX "Project_reservationId_idx" ON "Project"("reservationId");
CREATE INDEX "Project_status_idx" ON "Project"("status");
CREATE INDEX "Project_priority_idx" ON "Project"("priority");
CREATE TABLE "new_Property" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "unit" TEXT,
    "address" TEXT NOT NULL,
    "listingUrl" TEXT,
    "vrboListingUrl" TEXT,
    "airbnbUrl" TEXT,
    "vrboUrl" TEXT,
    "otherUrl" TEXT,
    "images" TEXT,
    "maxOccupancy" INTEGER,
    "description" TEXT,
    "bedrooms" INTEGER,
    "beds" INTEGER,
    "bedSetup" TEXT,
    "bathrooms" DECIMAL,
    "squareFeet" INTEGER,
    "type" TEXT,
    "checkInTime" TEXT,
    "checkOutTime" TEXT,
    "petsAllowed" BOOLEAN NOT NULL DEFAULT false,
    "maxPets" INTEGER NOT NULL DEFAULT 0,
    "petFee" DECIMAL,
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
    "minNightlyRate" DECIMAL,
    "minStay" INTEGER,
    "cleaningFee" DECIMAL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "hospitableId" TEXT,
    "ownerId" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "activeYears" INTEGER NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Property_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Lead" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Property" ("accessInstructions", "address", "cleaningFee", "createdAt", "emergencyCode", "generalNotes", "id", "images", "listingUrl", "minNightlyRate", "minStay", "name", "ownerId", "parkingInstructions", "status", "trashInstructions", "updatedAt", "wifiName", "wifiPassword") SELECT "accessInstructions", "address", "cleaningFee", "createdAt", "emergencyCode", "generalNotes", "id", "images", "listingUrl", "minNightlyRate", "minStay", "name", "ownerId", "parkingInstructions", "status", "trashInstructions", "updatedAt", "wifiName", "wifiPassword" FROM "Property";
DROP TABLE "Property";
ALTER TABLE "new_Property" RENAME TO "Property";
CREATE UNIQUE INDEX "Property_hospitableId_key" ON "Property"("hospitableId");
CREATE INDEX "Property_ownerId_idx" ON "Property"("ownerId");
CREATE INDEX "Property_status_idx" ON "Property"("status");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "SubProject_projectId_idx" ON "SubProject"("projectId");

-- CreateIndex
CREATE INDEX "SubProject_assignedToId_idx" ON "SubProject"("assignedToId");

-- CreateIndex
CREATE INDEX "Note_projectId_idx" ON "Note"("projectId");

-- CreateIndex
CREATE INDEX "Note_authorId_idx" ON "Note"("authorId");

-- CreateIndex
CREATE INDEX "Transaction_type_idx" ON "Transaction"("type");

-- CreateIndex
CREATE INDEX "Transaction_date_idx" ON "Transaction"("date");
