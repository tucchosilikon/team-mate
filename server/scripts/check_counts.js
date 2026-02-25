const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const userCount = await prisma.user.count();
    const propertyCount = await prisma.property.count();
    const projectCount = await prisma.project.count();
    const leadCount = await prisma.lead.count();

    console.log('--- Database Counts ---');
    console.log(`Users: ${userCount}`);
    console.log(`Properties: ${propertyCount}`);
    console.log(`Projects: ${projectCount}`);
    console.log(`Leads: ${leadCount}`);
}

main()
    .catch((e) => console.error(e))
    .finally(() => prisma.$disconnect());
