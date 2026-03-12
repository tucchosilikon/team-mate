const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('../node_modules/.prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://teammate_user:deoJFgogG9Ahl9amTSDlBXD0ci45naCE@dpg-d6fn4phaae7s73ekqga0-a.oregon-postgres.render.com/teammate_db_012h'
    }
  }
});

const csvDir = path.join(__dirname);

const parseCSV = (content) => {
  const lines = content.split('\n').filter(l => l.trim());
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  
  const records = [];
  for (let i = 1; i < lines.length; i++) {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (const char of lines[i]) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim().replace(/"/g, ''));
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim().replace(/"/g, ''));
    
    const record = {};
    headers.forEach((h, idx) => {
      record[h] = values[idx] || '';
    });
    records.push(record);
  }
  return records;
};

const fieldMappings = {
  'Property Name': 'name',
  'Property Code / Short Name': 'code',
  'Full Address (Street, City, State, ZIP)': 'address',
  'Unit / Level (Upstairs/Downstairs/Unit #/Above Garage/etc.)': 'unit',
  'Max Occupancy': (val) => val ? parseInt(val) : null,
  'Beds (count)': (val) => val ? parseInt(val) : null,
  'Bedrooms (count)': (val) => val ? parseInt(val) : null,
  'Baths (count)': (val) => val ? parseFloat(val) : null,
  'Bed Setup (describe)': 'bedSetup',
  'Property Type (house/apt/studio/etc.)': 'type',
  'Check in time': 'checkInTime',
  'Check out time': 'checkOutTime',
  'Pets Allowed? (Yes/No)': (val) => val.toLowerCase().includes('yes'),
  'Max # Pets Allowed': (val) => val ? parseInt(val) : null,
  'Pet Fee ($/night per pet or flat)': (val) => val ? parseFloat(val.replace('$', '')) : null,
  'Pet Notes (cats ok, etc.)': 'petNotes',
  'Pet Payment Method (Airbnb/VRBO/Venmo/PayPal/etc.)': 'petPaymentMethod',
  'Primary Entry Method (smart lock / lockbox / key under shell)': 'entryMethod',
  'Lockbox Location': 'lockboxLocation',
  'Lockbox Code': 'lockboxCode',
  'Where Key Works (front/back/utility/etc.)': 'keyWorksAt',
  'Backup/Spare Key Location': 'backupKeyLocation',
  'Parking Rules Summary': 'parkingInstructions',
  'Max Vehicles Allowed': (val) => val ? parseInt(val) : null,
  'Parking Passes Needed? (Yes/No)': (val) => val.toLowerCase().includes('yes'),
  'WiFi Network Name (SSID)': 'wifiName',
  'WiFi Password': 'wifiPassword',
  'Modem / Router Location': 'modemLocation',
  'Guest Access to Modem? (Yes/No)': (val) => val.toLowerCase().includes('yes'),
  'ISP / Provider (Spectrum/etc.)': 'ispProvider',
  'Circuit Breaker Location': 'breakerLocation',
  'Guest Access to Breaker? (Yes/No)': (val) => val.toLowerCase().includes('yes'),
  'Who Controls Thermostat (guest/upstairs/downstairs)': 'thermostatControl',
  'Thermostat Location': 'thermostatLocation',
  'TV Locations (LR/BRs/etc.)': 'tvLocations',
  'Smart TVs? (Yes/No)': (val) => val.toLowerCase().includes('yes'),
  'Backyard Access (Upstairs only / Downstairs only / Shared)': 'backyardAccess',
  'Porches/Patios (Shared? notes)': 'porchPatioNotes',
  'Grill Type (charcoal/gas/none/shared)': 'grillType',
  'Grill Location': 'grillLocation',
  'Special Outdoor Notes (trails, etc.)': 'outdoorNotes',
  'Where Beach Gear Is Stored': 'beachGearLocation',
  'Beach Towels': (val) => val ? parseInt(val) : null,
  'Bikes Provided? (Yes/No)': (val) => val.toLowerCase().includes('yes'),
  'Bike Count': (val) => val ? parseInt(val) : null,
  'Shared Bikes? (Yes/No + notes)': (val) => val.toLowerCase().includes('yes'),
  'Bike Location / Storage': 'bikeLocation',
  'White': 'lockCodeWhite',
  'Blue': 'lockCodeBlue',
  'Yellow': 'lockCodeYellow',
  'Key House Rules (no backyard, no grill, etc.)': 'houseRules',
  'Smoking Policy': 'smokingPolicy',
  'Common Issues (GFI resets, etc.)': 'commonIssues',
  'GFI / Reset Instructions': 'gfiInstructions',
  'Trash Pickup Days / Season Notes': 'trashPickupDays',
  'Trash Instructions / Location': 'trashInstructions',
  'Airbnb Title & Link': 'airbnbUrl',
  'Direct Site Link': 'directBookingUrl',
  'Other Listing Link 2': 'otherUrl',
};

function normalizePropertyName(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
}

async function updateProperties() {
  const filePath = path.join(csvDir, 'combined', 'all_properties.csv');
  const content = fs.readFileSync(filePath, 'utf-8');
  const properties = parseCSV(content);
  
  console.log(`📊 Found ${properties.length} properties in CSV\n`);
  
  let updated = 0;
  let skipped = 0;
  let notFound = [];
  
  const dbProperties = await prisma.property.findMany({
    where: { status: 'ACTIVE' }
  });
  
  const dbPropertyMap = new Map();
  dbProperties.forEach(p => {
    dbPropertyMap.set(normalizePropertyName(p.name), p);
  });
  
  for (const prop of properties) {
    const csvName = prop['Property Name'] || '';
    const normalizedName = normalizePropertyName(csvName);
    
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
      notFound.push(csvName);
      console.log(`⚠️  Not found in DB: ${csvName}`);
      continue;
    }
    
    const updateData = {};
    
    for (const [csvField, dbField] of Object.entries(fieldMappings)) {
      const csvValue = prop[csvField];
      if (csvValue && csvValue.trim()) {
        updateData[dbField] = typeof dbField === 'function' ? dbField(csvValue) : csvValue;
      }
    }
    
    if (Object.keys(updateData).length > 0) {
      await prisma.property.update({
        where: { id: dbProperty.id },
        data: updateData
      });
      updated++;
      console(`✅ Updated: ${csvName}`);
    } else {
      skipped++;
      console.log(`⏭️  No changes: ${csvName}`);
    }
  }
  
  console.log('\n🎉 Update complete!');
  console.log(`   Updated: ${updated} properties`);
  console.log(`   Skipped: ${skipped} properties`);
  if (notFound.length > 0) {
    console.log(`   Not found in DB: ${notFound.length} properties`);
  }
}

updateProperties()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
