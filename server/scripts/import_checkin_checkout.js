const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const CSV_FILE = path.join(__dirname, '../../csv/check-in-check-out.csv');

async function importCheckInOut() {
    try {
        console.log('Reading check-in-check-out.csv...\n');

        const fileContent = fs.readFileSync(CSV_FILE, 'utf8');
        const records = parse(fileContent, {
            columns: true,
            skip_empty_lines: true,
            trim: true
        });

        console.log(`Found ${records.length} reservation records\n`);

        let created = 0;
        let updated = 0;
        let skipped = 0;
        let errors = 0;

        for (const record of records) {
            try {
                // Parse the record
                const propertyName = record['Property name'];
                const customer = record['Customer'];
                const nightStay = parseInt(record['Night Stay']) || 0;
                const checkIn = record['Check-in'];
                const checkOut = record['Check-out'];
                const hospitableId = record['property id : hospitable'];

                if (!propertyName || !checkIn || !checkOut) {
                    console.log(`⚠️  Skipping record with missing data`);
                    skipped++;
                    continue;
                }

                // Parse dates (format: M/D/YYYY)
                const checkInDate = new Date(checkIn);
                const checkOutDate = new Date(checkOut);

                if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
                    console.log(`⚠️  Invalid dates for ${propertyName}: ${checkIn} - ${checkOut}`);
                    skipped++;
                    continue;
                }

                // Find property by name
                const property = await prisma.property.findFirst({
                    where: { name: propertyName }
                });

                if (!property) {
                    console.log(`⚠️  Property not found: ${propertyName}`);
                    skipped++;
                    continue;
                }

                // Create a project title combining property name and dates
                const formatDate = (date) => {
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    return `${month}/${day}`;
                };

                const title = `${propertyName} | ${formatDate(checkInDate)} - ${formatDate(checkOutDate)}`;

                // Check if project already exists for this property and dates
                const existing = await prisma.project.findFirst({
                    where: {
                        propertyId: property.id,
                        checkInDate: checkInDate,
                        checkOutDate: checkOutDate
                    }
                });

                if (existing) {
                    // Update existing
                    await prisma.project.update({
                        where: { id: existing.id },
                        data: {
                            title: title,
                            customerName: customer,
                            nightStay: nightStay,
                            description: `Guest: ${customer} | ${nightStay} nights`
                        }
                    });
                    console.log(`✅ Updated: ${title}`);
                    updated++;
                } else {
                    // Determine Status and Priority
                    const now = new Date();
                    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

                    let status = 'TODO';
                    let priority = 'MEDIUM';

                    if (checkOutDate < now) {
                        status = 'DONE';
                        priority = 'LOW';
                    } else if (checkInDate <= now && checkOutDate >= now) {
                        status = 'IN_PROGRESS';
                        priority = 'HIGH';
                    } else if (checkInDate < thirtyDaysFromNow) {
                        priority = 'HIGH';
                    }

                    // Create new project
                    await prisma.project.create({
                        data: {
                            title: title,
                            description: `Guest: ${customer} | ${nightStay} nights`,
                            status: status,
                            priority: priority,
                            propertyId: property.id,
                            checkInDate: checkInDate,
                            checkOutDate: checkOutDate,
                            customerName: customer,
                            nightStay: nightStay
                        }
                    });
                    console.log(`✅ Created: ${title}`);
                    created++;
                }

            } catch (error) {
                console.error(`❌ Error processing record:`, error.message);
                errors++;
            }
        }

        console.log('\n=================================');
        console.log('Import Summary:');
        console.log(`  Created: ${created}`);
        console.log(`  Updated: ${updated}`);
        console.log(`  Skipped: ${skipped}`);
        console.log(`  Errors: ${errors}`);
        console.log('=================================\n');

    } catch (error) {
        console.error('Fatal error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

importCheckInOut();
