const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const csv = require('csv-parse/sync');

const prisma = new PrismaClient();

async function main() {
    try {
        const csvPath = 'd:/TeamMate/csv/Tasks.csv';
        const fileContent = fs.readFileSync(csvPath, 'utf-8');
        const records = csv.parse(fileContent, {
            columns: true,
            skip_empty_lines: true,
            trim: true
        });

        console.log(`Found ${records.length} projects to import.`);

        const properties = await prisma.property.findMany({
            select: { id: true, name: true, code: true }
        });
        console.log(`Loaded ${properties.length} properties from DB.`);

        const normalize = (str) => str ? str.toLowerCase().replace(/[^a-z0-9]/g, '') : '';

        // Manual Mapping for known tricky cases
        const manualMap = {
            'North Unit': 'North Unit', // Will use includes
            'WA-2021 Wrightsville': 'Wrightsville', // Will use includes on Name key
            'AR - 305 W. Airstrip': 'Airstrip',
            'Maria’s Avalon': 'Avalon',
            '1CD - Canal Dr. UP': '1CD',
            '2CD - DOWNSTAIRS 706 Canal Drive': '2CD',
            '2CD - Canal Dr. DOWN': '2CD',
        };

        let matchCount = 0;
        let failCount = 0;
        let duplicateCount = 0;

        for (const record of records) {
            const projectName = record['Name'];
            const propertyName = record['Property'];
            const statusText = record['Status'];

            if (!projectName || !propertyName) continue;

            let matchedProperty = properties.find(p => p.name === propertyName);

            if (!matchedProperty) {
                // 1. Try Manual Map
                const mappedKey = manualMap[propertyName];
                if (mappedKey) {
                    matchedProperty = properties.find(p =>
                        p.name.includes(mappedKey) ||
                        (p.code && p.code.includes(mappedKey))
                    );
                }
            }

            if (!matchedProperty) {
                // 2. Try Split matches
                const parts = propertyName.split('-');
                const possibleCode = parts[0].trim();

                if (possibleCode && possibleCode.length < 20) {
                    matchedProperty = properties.find(p =>
                        (p.code && (p.code === possibleCode || p.code.startsWith(possibleCode))) ||
                        p.name.startsWith(possibleCode + ' -') ||
                        p.name.startsWith(possibleCode + '-') ||
                        p.name.includes(`(${possibleCode}`) ||
                        (p.code && p.code.includes(possibleCode)) ||
                        (possibleCode.length > 3 && p.name.includes(possibleCode))
                    );
                }
            }

            if (!matchedProperty) {
                // 3. Fallback Normalized
                const normCSV = normalize(propertyName);
                if (normCSV.length > 5) {
                    matchedProperty = properties.find(p => normalize(p.name).includes(normCSV) || normCSV.includes(normalize(p.name)));
                }
            }

            if (matchedProperty) {
                const existing = await prisma.project.findFirst({
                    where: {
                        title: projectName,
                        propertyId: matchedProperty.id,
                        description: statusText
                    }
                });

                if (!existing) {
                    await prisma.project.create({
                        data: {
                            title: projectName,
                            description: statusText,
                            status: 'TODO',
                            priority: 'MEDIUM',
                            propertyId: matchedProperty.id,
                        }
                    });
                    matchCount++;
                } else {
                    duplicateCount++;
                }
            } else {
                console.warn(`No match: "${propertyName}"`);
                failCount++;
            }
        }

        console.log(`\nSummary: Imported: ${matchCount}, Duplicates: ${duplicateCount}, Failed: ${failCount}`);

    } catch (error) {
        console.error('Import failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
