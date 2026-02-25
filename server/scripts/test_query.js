const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testFullQuery() {
    try {
        console.log('Testing full query with includes...');

        const properties = await prisma.property.findMany({
            include: {
                owner: true,
                projects: {
                    where: { status: { not: 'DONE' } },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        console.log(`✅ Success! Found ${properties.length} properties`);

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Full error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testFullQuery();
