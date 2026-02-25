const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateProjectStatusPriority() {
    try {
        console.log('Updating project status and priority based on dates...\n');

        const now = new Date();
        const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

        // Get all projects with check-in/check-out dates
        const projects = await prisma.project.findMany({
            where: {
                OR: [
                    { checkInDate: { not: null } },
                    { checkOutDate: { not: null } }
                ]
            }
        });

        console.log(`Found ${projects.length} projects with dates\n`);

        let updated = 0;
        let statusUpdates = { DONE: 0, IN_PROGRESS: 0, TODO: 0 };
        let priorityUpdates = { HIGH: 0, MEDIUM: 0, LOW: 0 };

        for (const project of projects) {
            const updates = {};
            let changed = false;

            const checkInDate = project.checkInDate ? new Date(project.checkInDate) : null;
            const checkOutDate = project.checkOutDate ? new Date(project.checkOutDate) : null;

            // Determine Status
            let newStatus = project.status;
            if (checkOutDate && checkOutDate < now) {
                // Already checked out -> DONE
                newStatus = 'DONE';
            } else if (checkInDate && checkInDate <= now && (!checkOutDate || checkOutDate >= now)) {
                // Currently in stay period -> IN_PROGRESS
                newStatus = 'IN_PROGRESS';
            } else if (checkInDate && checkInDate > now) {
                // Future check-in -> TODO
                newStatus = 'TODO';
            }

            if (newStatus !== project.status) {
                updates.status = newStatus;
                statusUpdates[newStatus]++;
                changed = true;
            }

            // Determine Priority
            let newPriority = project.priority;
            if (checkOutDate && checkOutDate < now) {
                // Already checked out -> LOW priority
                newPriority = 'LOW';
            } else if (checkInDate && checkInDate < thirtyDaysFromNow) {
                // Check-in within 30 days -> HIGH priority
                newPriority = 'HIGH';
            } else if (project.priority !== 'HIGH' && project.priority !== 'LOW') {
                // Default -> MEDIUM
                newPriority = 'MEDIUM';
            }

            if (newPriority !== project.priority) {
                updates.priority = newPriority;
                priorityUpdates[newPriority]++;
                changed = true;
            }

            // Update if changes detected
            if (changed) {
                await prisma.project.update({
                    where: { id: project.id },
                    data: updates
                });
                updated++;

                if (updated % 50 === 0) {
                    console.log(`  Processed ${updated} projects...`);
                }
            }
        }

        console.log('\n=================================');
        console.log('Update Summary:');
        console.log(`  Total Updated: ${updated}`);
        console.log('\nStatus Changes:');
        console.log(`  → DONE: ${statusUpdates.DONE}`);
        console.log(`  → IN_PROGRESS: ${statusUpdates.IN_PROGRESS}`);
        console.log(`  → TODO: ${statusUpdates.TODO}`);
        console.log('\nPriority Changes:');
        console.log(`  → HIGH: ${priorityUpdates.HIGH}`);
        console.log(`  → MEDIUM: ${priorityUpdates.MEDIUM}`);
        console.log(`  → LOW: ${priorityUpdates.LOW}`);
        console.log('=================================\n');

    } catch (error) {
        console.error('Error:', error.message);
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

updateProjectStatusPriority();
