const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const csv = require('csv-parse/sync');

const prisma = new PrismaClient();

async function main() {
    try {
        // 1. Read CSV
        const csvPath = 'd:/TeamMate/csv/Tasks.csv';
        const fileContent = fs.readFileSync(csvPath, 'utf-8');
        const records = csv.parse(fileContent, {
            columns: true,
            skip_empty_lines: true,
            trim: true
        });

        console.log(`Found ${records.length} projects in CSV.`);

        // 2. Extract unique names
        const uniqueNames = new Set();
        records.forEach(record => {
            // User requested to use "Title" column for Lead Names
            // Fallback to "Name" if "Title" is missing or empty, or stick to user request strictly?
            // "All title in projects.csv file should saved as lead names for now."
            const nameToUse = record.Title || record.Name;
            if (nameToUse && nameToUse.trim() !== '') {
                uniqueNames.add(nameToUse.trim());
            }
        });

        console.log(`Found ${uniqueNames.size} unique names to import as Leads.`);

        // 3. Import Leads
        let createdCount = 0;
        let skippedCount = 0;
        let errorCount = 0;

        for (const name of uniqueNames) {
            try {
                const existingLead = await prisma.lead.findFirst({
                    where: { name: name }
                });

                if (!existingLead) {
                    await prisma.lead.create({
                        data: {
                            name: name,
                            type: 'CUSTOMER',
                            status: 'NEW'
                            // contactInfo removed to see if that's the issue
                        }
                    });
                    createdCount++;
                } else {
                    skippedCount++;
                }
            } catch (err) {
                console.error(`Failed to import lead "${name}":`);
                console.error(err); // Log full error object
                errorCount++;
            }
        }

        console.log(`Import complete.`);
        console.log(`Created: ${createdCount}`);
        console.log(`Skipped (Already existed): ${skippedCount}`);
        console.log(`Errors: ${errorCount}`);

    } catch (error) {
        console.error('Error importing leads:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
