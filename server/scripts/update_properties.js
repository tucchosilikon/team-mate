const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://teammate_user:deoJFgogG9Ahl9amTSDlBXD0ci45naCE@dpg-d6fn4phaae7s73ekqga0-a.oregon-postgres.render.com/teammate_db_012h'
    }
  }
});

const csvDir = path.join(__dirname, '..', '..', 'csv');

function parseCSV(content) {
  const lines = content.split('\n').filter(l => l.trim());
  const headers = parseCSVLine(lines[0]);
  
  const records = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const record = {};
    headers.forEach((h, idx) => {
      record[h] = values[idx] || '';
    });
    records.push(record);
  }
  return records;
}

function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current.trim());
  return values;
}

const fieldMappings = {
  'Property Name': 'name',
  'Property Code / Short Name': 'code',
  'Full Address (Street, City, State, ZIP)': 'address',
  'Unit / Level (Upstairs/Downstairs/Unit #/Above Garage/etc.)': 'unit',
  'Max Occupancy': { field: 'maxOccupancy', parse: parseInt },
  'Beds (count)': { field: 'beds', parse: parseInt },
  'Bedrooms (count)': { field: 'bedrooms', parse: parseInt },
  'Baths (count)': { field: 'bathrooms', parse: parseFloat },
  'Bed Setup (describe)': 'bedSetup',
  'Property Type (house/apt/studio/etc.)': 'type',
  'Check in time': 'checkInTime',
  'Check out time': 'checkOutTime',
  'Pets Allowed? (Yes/No)': { field: 'petsAllowed', parse: (v) => v.toLowerCase().includes('yes') },
  'Max # Pets Allowed': { field: 'maxPets', parse: parseInt },
  'Pet Fee ($/night per pet or flat)': { field: 'petFee', parse: (v) => v ? parseFloat(v.replace('$', '')) : null },
  'Pet Notes (cats ok, etc.)': 'petNotes',
  'Pet Payment Method (Airbnb/VRBO/Venmo/PayPal/etc.)': 'petPaymentMethod',
  'Primary Entry Method (smart lock / lockbox / key under shell)': 'entryMethod',
  'Lockbox Location': 'lockboxLocation',
  'Lockbox Code': 'lockboxCode',
  'Where Key Works (front/back/utility/etc.)': 'keyWorksAt',
  'Backup/Spare Key Location': 'backupKeyLocation',
  'Parking Rules Summary': 'parkingInstructions',
  'Max Vehicles Allowed': { field: 'maxVehicles', parse: parseInt },
  'Parking Passes Needed? (Yes/No)': { field: 'parkingPassesNeeded', parse: (v) => v.toLowerCase().includes('yes') },
  'WiFi Network Name (SSID)': 'wifiName',
  'WiFi Password': 'wifiPassword',
  'Modem / Router Location': 'modemLocation',
  'Guest Access to Modem? (Yes/No)': { field: 'guestModemAccess', parse: (v) => v.toLowerCase().includes('yes') },
  'ISP / Provider (Spectrum/etc.)': 'ispProvider',
  'Circuit Breaker Location': 'breakerLocation',
  'Guest Access to Breaker? (Yes/No)': { field: 'guestBreakerAccess', parse: (v) => v.toLowerCase().includes('yes') },
  'Who Controls Thermostat (guest/upstairs/downstairs)': 'thermostatControl',
  'Thermostat Location': 'thermostatLocation',
  'TV Locations (LR/BRs/etc.)': 'tvLocations',
  'Smart TVs? (Yes/No)': { field: 'smartTv', parse: (v) => v.toLowerCase().includes('yes') },
  'Backyard Access (Upstairs only / Downstairs only / Shared)': 'backyardAccess',
  'Porches/Patios (Shared? notes)': 'porchPatioNotes',
  'Grill Type (charcoal/gas/none/shared)': 'grillType',
  'Grill Location': 'grillLocation',
  'Special Outdoor Notes (trails, etc.)': 'outdoorNotes',
  'Where Beach Gear Is Stored': 'beachGearLocation',
  'Beach Towels': { field: 'beachTowels', parse: parseInt },
  'Bikes Provided? (Yes/No)': { field: 'bikesProvided', parse: (v) => v.toLowerCase().includes('yes') },
  'Bike Count': { field: 'bikeCount', parse: parseInt },
  'Shared Bikes? (Yes/No + notes)': { field: 'bikesShared', parse: (v) => v.toLowerCase().includes('yes') },
  'Bike Location / Storage': 'bikeLocation',
  'White': 'lockCodeWhite',
  'Blue': 'lockCodeBlue',
  'Yellow': 'lockCodeYellow',
  'Key House Rules (no backyard, no grill, etc.)': 'houseRules',
  'Smoking Policy': 'smokingPolicy',
  'Trash Pickup Days / Season Notes': 'trashPickupDays',
  'Trash Instructions / Location': 'trashInstructions',
  'Airbnb Title & Link': 'airbnbUrl',
  'Direct Site Link': 'directBookingUrl',
  'Other Listing Link 2': 'otherUrl',
};

const validDbFields = new Set([
  'name', 'code', 'unit', 'address', 'listingUrl', 'vrboListingUrl', 'airbnbUrl', 'vrboUrl', 
  'otherUrl', 'hospitableUrl', 'directBookingUrl', 'images', 'maxOccupancy', 'description', 
  'bedrooms', 'beds', 'bedSetup', 'bathrooms', 'squareFeet', 'type', 'checkInTime', 'checkOutTime',
  'petsAllowed', 'maxPets', 'petFee', 'petPolicy', 'petNotes', 'petPaymentMethod', 'entryMethod',
  'accessInstructions', 'lockboxLocation', 'lockboxCode', 'keyWorksAt', 'backupKeyLocation',
  'backupKeyCode', 'spareKeyContactNeeded', 'emergencyCode', 'parkingInstructions', 'maxVehicles',
  'parkingPassesNeeded', 'wifiName', 'wifiPassword', 'modemLocation', 'guestModemAccess',
  'ispProvider', 'breakerLocation', 'guestBreakerAccess', 'thermostatLocation', 'thermostatControl',
  'tvLocations', 'smartTv', 'hasStove', 'hasDishwasher', 'dishwasherNotes', 'iceMakerStatus',
  'garbageDisposalInfo', 'coffeeMakerType', 'applianceNotes', 'outdoorShower', 'backyardAccess',
  'porchPatioNotes', 'grillType', 'grillLocation', 'grillFuelProvided', 'outdoorNotes',
  'beachTowels', 'beachGearLocation', 'bikesProvided', 'bikeCount', 'bikeLocation', 'bikesShared',
  'lockCodeYellow', 'lockCodeWhite', 'lockCodeBlue', 'lockCodeRed', 'houseRules', 'smokingPolicy',
  'quietHours', 'otherRestrictions', 'otherKeyLocations', 'ownerNotes', 'managementContact',
  'trashPickupDays', 'trashInstructions', 'checkOutText', 'checkOutNotes', 'guideUrl',
  'photoFolderUrl', 'otherLinks', 'generalNotes', 'lostAndFoundPolicy', 'minNightlyRate',
  'minStay', 'cleaningFee', 'status', 'hospitableId', 'isVerified', 'activeYears', 'reviewCount'
]);

function normalizePropertyName(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
}

function getPrefix(name) {
  return name.toLowerCase().replace(/[^a-z]/g, '').substring(0, 6);
}

async function updateProperties() {
  const filePath = path.join(csvDir, 'combined', 'all_properties.csv');
  const content = fs.readFileSync(filePath, 'utf-8');
  const properties = parseCSV(content);
  
  console.log(`📊 Found ${properties.length} properties in CSV\n`);
  
  let updated = 0;
  let skipped = 0;
  
  const dbProperties = await prisma.property.findMany({
    where: { status: 'ACTIVE' }
  });
  
const dbPropertyMap = new Map();
dbProperties.forEach(p => {
  dbPropertyMap.set(normalizePropertyName(p.name), p);
});

for (const prop of properties) {
  const csvName = prop['Property Name'] || '';
  const internalName = prop['Internal Name'] || '';
  let normalizedName = internalName ? normalizePropertyName(internalName) : normalizePropertyName(csvName);
  const csvPrefix = getPrefix(csvName);
  
  let dbProperty = dbPropertyMap.get(normalizedName);
  
  if (!dbProperty) {
    for (const [dbName, dbProp] of dbPropertyMap) {
      if (dbName.includes(normalizedName) || normalizedName.includes(dbName)) {
        dbProperty = dbProp;
        break;
      }
    }
  }
  
  if (!dbProperty) {
    const dbPrefix = getPrefix(dbPropertyMap.values().next().value?.name || '');
    for (const [dbName, dbProp] of dbPropertyMap) {
      const prefix = getPrefix(dbName);
      if (prefix.startsWith(csvPrefix.substring(0, 4)) || csvPrefix.startsWith(prefix.substring(0, 4))) {
        dbProperty = dbProp;
        console.log(`  → Matched by prefix: ${csvName} ↔ ${dbName}`);
        break;
      }
    }
  }
  
  if (!dbProperty) {
    console.log(`➕ Creating new property: ${csvName}`);
    try {
      const newProperty = await prisma.property.create({
        data: {
          name: csvName,
          address: prop['Full Address (Street, City, State, ZIP)'] || csvName,
          unit: prop['Unit / Level (Upstairs/Downstairs/Unit #/Above Garage/etc.)'] || null,
          status: 'ACTIVE',
          ownerId: (await prisma.lead.findFirst({ where: { name: 'Property Manager' } }))?.id
        }
      });
      dbProperty = newProperty;
      console.log(`✅ Created: ${csvName}`);
      updated++;
    } catch (e) {
      console.log(`❌ Error creating ${csvName}: ${e.message}`);
      continue;
    }
  }
    
    const updateData = {};
    
    for (const [csvField, mapping] of Object.entries(fieldMappings)) {
      const csvValue = prop[csvField];
      if (csvValue && csvValue.trim()) {
        let dbField;
        let parsedValue = csvValue;
        
        if (typeof mapping === 'string') {
          dbField = mapping;
        } else if (typeof mapping === 'object') {
          dbField = mapping.field;
          parsedValue = mapping.parse(csvValue);
        }
        
        if (dbField && validDbFields.has(dbField) && parsedValue !== null && !isNaN(parsedValue)) {
          updateData[dbField] = parsedValue;
        }
      }
    }
    
    if (Object.keys(updateData).length > 0) {
      try {
        await prisma.property.update({
          where: { id: dbProperty.id },
          data: updateData
        });
        updated++;
        console.log(`✅ Updated: ${csvName}`);
      } catch (e) {
        console.log(`❌ Error updating ${csvName}: ${e.message}`);
      }
    } else {
      skipped++;
      console.log(`⏭️  No changes: ${csvName}`);
    }
  }
  
  console.log('\n🎉 Update complete!');
  console.log(`   Updated: ${updated} properties`);
  console.log(`   Skipped: ${skipped} properties`);
}

updateProperties()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
