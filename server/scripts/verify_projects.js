const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifyProjects() {
    try {
        console.log('Verifying imported projects...\n');

        const projects = await prisma.project.findMany({
            include: {
                property: true
            },
            orderBy: { checkInDate: 'asc' },
            take: 10
        });

        console.log(`Total projects in database: ${await prisma.project.count()}\n`);
        console.log('Sample projects (first 10):');
        console.log('============================\n');

        projects.forEach(p => {
            console.log(`Title: ${p.title}`);
            console.log(`  Property: ${p.property?.name || 'N/A'}`);
            console.log(`  Customer: ${p.customerName || 'N/A'}`);
            console.log(`  Check-in: ${p.checkInDate?.toISOString().split('T')[0] || 'N/A'}`);
            console.log(`  Check-out: ${p.checkOutDate?.toISOString().split('T')[0] || 'N/A'}`);
            console.log(`  Status: ${p.status}`);
            console.log('');
        });

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

verifyProjects();
