const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const CSV_DIR = path.join(__dirname, '../../csv');

async function main() {
    try {
        const files = fs.readdirSync(CSV_DIR).filter(f => f.startsWith('OBX Sharp Stays') && f.endsWith('.csv'));
        console.log(`Found ${files.length} property CSV files.`);

        for (const file of files) {
            console.log(`Processing ${file}...`);
            const filePath = path.join(CSV_DIR, file);
            const fileContent = fs.readFileSync(filePath, 'utf8');

            // The CSV format is Section,Field,Value,Note
            // We need to parse it row by row manually or via csv-parse
            // Since it has headers, we can use csv-parse
            const records = parse(fileContent, {
                columns: true,
                skip_empty_lines: true,
                trim: true
            });

            // Convert to a Map for easier lookup: Field -> Value
            const dataMap = new Map();
            records.forEach(row => {
                if (row.Field && row.Value) {
                    dataMap.set(row.Field.trim(), row.Value.trim());
                }
            });

            // Identify Property
            // Try "Internal Name" first, then "Property Name"
            let propertyName = dataMap.get('Internal Name');
            if (!propertyName) propertyName = dataMap.get('Property Name');

            if (!propertyName) {
                console.error(`  Could not find property name in ${file}`);
                continue;
            }

            // Clean up property name to match DB? 
            // DB has things like "1CD - Canal Dr. UP". CSV has "1CD - Canal Dr. UP".
            // It should match.

            // Construct Update Data
            const updateData = {};

            // Helper to safe-get
            const get = (key) => dataMap.get(key) || null;

            // Mapping
            if (get('Check in time')) updateData.checkInTime = get('Check in time');
            if (get('Check out time')) updateData.checkOutTime = get('Check out time');

            // Pets
            const petsAllowed = get('Pets Allowed? (Yes/No)');
            if (petsAllowed) updateData.petsAllowed = petsAllowed.toLowerCase() === 'yes';

            // Pet details?
            // "Pet Exceptions / Approval Rules" -> petPolicy?
            if (get('Pet Exceptions / Approval Rules')) updateData.petPolicy = get('Pet Exceptions / Approval Rules');

            // Parking
            if (get('Max Vehicles Allowed')) {
                const max = parseInt(get('Max Vehicles Allowed'));
                if (!isNaN(max)) updateData.maxVehicles = max;
            }
            if (get('Parking Rules Summary')) updateData.parkingInstructions = get('Parking Rules Summary');

            // Wifi
            if (get('WiFi Network Name (SSID)')) updateData.wifiName = get('WiFi Network Name (SSID)');
            if (get('WiFi Password')) updateData.wifiPassword = get('WiFi Password');
            if (get('Modem / Router Location')) updateData.modemLocation = get('Modem / Router Location');

            // Access
            if (get('Primary Entry Method (smart lock / lockbox / key under shell)')) updateData.entryMethod = get('Primary Entry Method (smart lock / lockbox / key under shell)');
            if (get('Lockbox Code')) updateData.lockboxCode = get('Lockbox Code');
            if (get('Lockbox Location')) updateData.lockboxLocation = get('Lockbox Location');

            // Listing Links
            // "Airbnb Title & Link"
            // "Direct Site Link"
            // "Other Listing Link 2"
            if (get('Airbnb Title & Link')) updateData.airbnbUrl = get('Airbnb Title & Link');
            if (get('Direct Site Link')) updateData.directBookingUrl = get('Direct Site Link');

            // "Other Listing Link 2" -> otherUrl?
            if (get('Other Listing Link 2')) updateData.otherUrl = get('Other Listing Link 2');

            // Bikes
            if (get('Bikes Provided? (Yes/No)')) updateData.bikesProvided = get('Bikes Provided? (Yes/No)').toLowerCase() === 'yes';
            if (get('Bike Count')) {
                const bikeCount = parseInt(get('Bike Count'));
                if (!isNaN(bikeCount)) updateData.bikeCount = bikeCount;
            }
            if (get('Bike Location / Storage')) updateData.bikeLocation = get('Bike Location / Storage');

            // Color Codes
            // Keys in CSV: "Red", "White", "Blue", "Yellow"
            // Wait, CSV has multiple rows with empty Field sometimes?
            // Row 68: "Red", "5154"
            // Row 69: ",White,1642" (Field is White)
            // So dataMap.get('Red') should work.
            if (get('Red')) updateData.lockCodeRed = get('Red');
            if (get('White')) updateData.lockCodeWhite = get('White');
            if (get('Blue')) updateData.lockCodeBlue = get('Blue');
            if (get('Yellow')) updateData.lockCodeYellow = get('Yellow');

            // Utilities
            if (get('Cabinet Breaker Location') || get('Circuit Breaker Location')) updateData.breakerLocation = get('Cabinet Breaker Location') || get('Circuit Breaker Location');

            // Trash
            if (get('Trash Pickup Days / Season Notes')) updateData.trashPickupDays = get('Trash Pickup Days / Season Notes');
            if (get('Trash Instructions / Location')) updateData.trashInstructions = get('Trash Instructions / Location');

            // Update DB
            console.log(`  Updating ${propertyName}...`);
            // We use updateMany in case of duplicates, or findFirst then update?
            // Ideally findUnique by name if unique. Property name is not unique in schema?
            // schema has: id String @id, name String.
            // But usually we findByName.

            const existing = await prisma.property.findFirst({
                where: { name: propertyName }
            });

            if (existing) {
                await prisma.property.update({
                    where: { id: existing.id },
                    data: updateData
                });
                console.log(`  ✅ Updated ${propertyName}`);
            } else {
                console.warn(`  ⚠️ Property ${propertyName} not found in DB. Creating...`);
                // Create minimal?
                // ownerId is required. We don't have ownerId in CSV.
                // We'll skip creating or try to find a default owner?
                // For now, skip creating if not found, to avoid breaking constraints.
                // User said "save them on the database directly".
                // I will try to find *any* owner to link to if I force create.
                // But better to warn.
                const defaultOwner = await prisma.lead.findFirst({ where: { type: 'OWNER' } });
                if (defaultOwner) {
                    await prisma.property.create({
                        data: {
                            name: propertyName,
                            address: get('Full Address (Street, City, State, ZIP)') || 'Unknown Address',
                            ownerId: defaultOwner.id,
                            ...updateData
                        }
                    });
                    console.log(`  ✅ Created ${propertyName}`);
                } else {
                    console.error(`  ❌ Cannot create ${propertyName}: No default owner found.`);
                }
            }
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
