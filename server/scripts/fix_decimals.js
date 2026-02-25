const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixDecimalFields() {
    try {
        console.log('Checking for corrupted Decimal fields...');

        // Direct SQL to see raw data
        const properties = await prisma.$queryRaw`
            SELECT id, name, bathrooms, petFee 
            FROM Property 
            LIMIT 20
        `;

        console.log('\nProperty Decimal Fields:');
        properties.forEach(p => {
            console.log(`${p.name}:`, {
                bathrooms: p.bathrooms,
                petFee: p.petFee
            });
        });

        // Now try to fix - set empty/invalid decimals to NULL
        console.log('\n\nFixing corrupted Decimal fields...');

        const result = await prisma.$executeRaw`
            UPDATE Property 
            SET bathrooms = NULL 
            WHERE bathrooms = ''
        `;
        console.log(`Updated ${result} bathrooms fields`);

        const result2 = await prisma.$executeRaw`
            UPDATE Property 
            SET petFee = NULL 
            WHERE petFee = ''
        `;
        console.log(`Updated ${result2} petFee fields`);

        // Test the query again
        console.log('\n\nTesting full query after fix...');
        const testProps = await prisma.property.findMany({
            include: {
                owner: true,
                projects: {
                    where: { status: { not: 'DONE' } },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        console.log(`✅ Success! Found ${testProps.length} properties`);

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

fixDecimalFields();
