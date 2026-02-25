const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const properties = await prisma.property.findMany({
        select: {
            id: true,
            name: true,
            code: true,
        },
    });
    const fs = require('fs');
    fs.writeFileSync('properties_dump.json', JSON.stringify(properties, null, 2));
    console.log('Properties written to properties_dump.json');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
