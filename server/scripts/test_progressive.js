const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testQueries() {
    try {
        console.log('Test 1: Properties without includes...');
        const test1 = await prisma.property.findMany();
        console.log(`✅ Success! Found ${test1.length} properties\n`);

        console.log('Test 2: Properties with owner only...');
        const test2 = await prisma.property.findMany({
            include: { owner: true }
        });
        console.log(`✅ Success! Found ${test2.length} properties\n`);

        console.log('Test 3: Properties with projects only...');
        const test3 = await prisma.property.findMany({
            include: {
                projects: {
                    where: { status: { not: 'DONE' } },
                },
            }
        });
        console.log(`✅ Success! Found ${test3.length} properties\n`);

        console.log('Test 4: Properties with both includes...');
        const test4 = await prisma.property.findMany({
            include: {
                owner: true,
                projects: {
                    where: { status: { not: 'DONE' } },
                },
            }
        });
        console.log(`✅ Success! Found ${test4.length} properties\n`);

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Model:', error.meta?.modelName);
    } finally {
        await prisma.$disconnect();
    }
}

testQueries();
