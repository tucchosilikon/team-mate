const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    try {
        const result = await prisma.property.findFirst({
            select: {
                id: true,
                hospitableUrl: true,
                directBookingUrl: true,
                checkInTime: true,
                petsAllowed: true,
                wifiName: true
            }
        });
        if (result) {
            console.log('✅ Schema verification successful: Fields exist.');
            console.log('Sample data:', JSON.stringify(result, null, 2));
        } else {
            console.log('✅ Schema verification successful: No records, but query executed.');
        }
    } catch (e) {
        console.error('❌ Schema verification failed:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
