const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkProjects() {
    try {
        console.log('🔍 Checking projects with reservation data...\n');

        const projects = await prisma.project.findMany({
            take: 5,
            include: {
                property: { select: { name: true } },
                assignedTo: { select: { name: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        console.log(`Found ${projects.length} projects\n`);

        projects.forEach((project, index) => {
            console.log(`Project ${index + 1}:`);
            console.log(`  Title: ${project.title}`);
            console.log(`  Property: ${project.property?.name || 'N/A'}`);
            console.log(`  Customer: ${project.customerName || 'N/A'}`);
            console.log(`  Check-in: ${project.checkInDate || 'N/A'}`);
            console.log(`  Check-out: ${project.checkOutDate || 'N/A'}`);
            console.log(`  Nights: ${project.nightStay || 'N/A'}`);
            console.log('');
        });

        // Count projects with reservation data
        const projectsWithReservations = projects.filter(t => t.checkInDate && t.checkOutDate);
        console.log(`\n📊 Projects with reservation data: ${projectsWithReservations.length}/${projects.length}`);

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

checkProjects();
