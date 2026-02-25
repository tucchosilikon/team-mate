const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDatabase() {
    try {
        console.log('Testing direct property access...');

        // Try to get all property IDs first
        const props = await prisma.$queryRaw`SELECT id, name FROM Property`;
        console.log(`Found ${props.length} properties`);

        // Try to access each one individually
        for (const prop of props) {
            try {
                const full = await prisma.property.findUnique({
                    where: { id: prop.id }
                });
                console.log(`✅ ${prop.name} - OK`);
            } catch (err) {
                console.error(`❌ ${prop.name} - ERROR:`, err.message);
            }
        }

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

checkDatabase();
