const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function findBadRecord() {
    try {
        console.log('Getting all property IDs from database...');
        const ids = await prisma.$queryRaw`SELECT id, name FROM Property`;
        console.log(`Found ${ids.length} properties\n`);

        console.log('Testing each property individually...\n');
        let badRecords = [];

        for (const prop of ids) {
            try {
                // Try to fetch this specific property with Prisma
                const result = await prisma.property.findUnique({
                    where: { id: prop.id }
                });
                console.log(`✅ ${prop.name}`);
            } catch (err) {
                console.error(`❌ ${prop.name} - ERROR: ${err.message}`);
                badRecords.push({ id: prop.id, name: prop.name, error: err.message });
            }
        }

        if (badRecords.length > 0) {
            console.log(`\n\n❌ Found ${badRecords.length} problematic records:`);
            badRecords.forEach(r => {
                console.log(`\n${r.name} (${r.id}):`);
                console.log(`  Error: ${r.error}`);
            });

            console.log('\n\nThese records need to be examined or deleted.');
        } else {
            console.log('\n\n✅ All records can be fetched individually!');
            console.log('The error must be in the batch query itself.');
        }

    } catch (error) {
        console.error('Script error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

findBadRecord();
