const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const properties = [
    { name: "1CD - Canal Dr. UP", hospitableId: "847214", url: "https://my.hospitable.com/properties/property/847214/overview" },
    { name: "1HD - Upper Crust, UP South Side Harpoon", hospitableId: "661084", url: "https://my.hospitable.com/properties/property/661084/overview" },
    { name: "1KS - Honalee Virginia Dare Trail", hospitableId: "1947228", url: "https://my.hospitable.com/properties/property/1947228/overview" },
    { name: "1VA 1720 Virginia Av", hospitableId: "767278", url: "https://my.hospitable.com/properties/property/767278/overview" },
    { name: "2CD - Canal Dr. DOWN", hospitableId: "849300", url: "https://my.hospitable.com/properties/property/849300/overview" },
    { name: "2HD -Sweet Dreams-Dwn South Side Harpoon", hospitableId: "661082", url: "https://my.hospitable.com/properties/property/661082/overview" },
    { name: "2KS - 300 S Virginia Dare Tail", hospitableId: "1947230", url: "https://my.hospitable.com/properties/property/1947230/overview" },
    { name: "3HD - Sugar Shack DOWN North Side", hospitableId: "661080", url: "https://my.hospitable.com/properties/property/661080/overview" },
    { name: "AD - Avalon Drive", hospitableId: "481656", url: "https://my.hospitable.com/properties/property/481656/overview" },
    { name: "AR - 305 W. Airstrip", hospitableId: "2111088", url: "https://my.hospitable.com/properties/property/2111088/overview" },
    { name: "AS - Atlantic Sunrise (II)", hospitableId: "2050662", url: "https://my.hospitable.com/properties/property/2050662/overview" },
    { name: "BB - 1502 Dogwood", hospitableId: "1748110", url: "https://my.hospitable.com/properties/property/1748110/overview" },
    { name: "BS - 207 Balchen St.", hospitableId: "1094738", url: "https://my.hospitable.com/properties/property/1094738/overview" },
    { name: "CH - The Cedar House Cedar Drive", hospitableId: "481632", url: "https://my.hospitable.com/properties/property/481632/overview" },
    { name: "DC - 4129 Drifting Sands", hospitableId: "1818024", url: "https://my.hospitable.com/properties/property/1818024/overview" },
    { name: "East Unit", hospitableId: "481640", url: "https://my.hospitable.com/properties/property/481640/overview" },
    { name: "EC - Elizabeth City St.", hospitableId: "481654", url: "https://my.hospitable.com/properties/property/481654/overview" },
    { name: "EL - B1 1221 S VA Dare", hospitableId: "1435330", url: "https://my.hospitable.com/properties/property/1435330/overview" },
    { name: "HS - 2018 Highview", hospitableId: "1206240", url: "https://my.hospitable.com/properties/property/1206240/overview" },
    { name: "JC - 3209 Bay Drive", hospitableId: "2096242", url: "https://my.hospitable.com/properties/property/2096242/overview" },
    { name: "KB - 50 N Dune Loop", hospitableId: "1742440", url: "https://my.hospitable.com/properties/property/1742440/overview" },
    { name: "KW - KW - KW", hospitableId: "1162852", url: "https://my.hospitable.com/properties/property/1162852/overview" },
    { name: "LH - Little House Suffolk St.", hospitableId: "481642", url: "https://my.hospitable.com/properties/property/481642/overview" },
    { name: "Lost Boys Hideout", hospitableId: "640082", url: "https://my.hospitable.com/properties/property/640082/overview" },
    { name: "Maria's Avalon", hospitableId: "481636", url: "https://my.hospitable.com/properties/property/481636/overview" },
    { name: "MV - 1217 VA Dare Tr", hospitableId: "1064928", url: "https://my.hospitable.com/properties/property/1064928/overview" },
    { name: "North Unit", hospitableId: "481644", url: "https://my.hospitable.com/properties/property/481644/overview" },
    { name: "PD - Palmetto Drive", hospitableId: "570304", url: "https://my.hospitable.com/properties/property/570304/overview" },
    { name: "RN - 323 W Blue Jay", hospitableId: "1741992", url: "https://my.hospitable.com/properties/property/1741992/overview" },
    { name: "SD - Sportsman Drive", hospitableId: "481628", url: "https://my.hospitable.com/properties/property/481628/overview" },
    { name: "SH - B2 Admirals View", hospitableId: "1585696", url: "https://my.hospitable.com/properties/property/1585696/overview" },
    { name: "South Unit", hospitableId: "481638", url: "https://my.hospitable.com/properties/property/481638/overview" },
    { name: "VA - Virginia Ave. 1721", hospitableId: "712230", url: "https://my.hospitable.com/properties/property/712230/overview" },
    { name: "WA-2021 Wrightsville", hospitableId: "1016104", url: "https://my.hospitable.com/properties/property/1016104/overview" },
    { name: "Wise Property", hospitableId: "579906", url: "https://my.hospitable.com/properties/property/579906/overview" },
    { name: "WS - 808 W Sportsman", hospitableId: "2147404", url: "https://my.hospitable.com/properties/property/2147404/overview" },
    { name: "YS - 2004 Yorktown", hospitableId: "1197986", url: "https://my.hospitable.com/properties/property/1197986/overview" },
    { name: "AS - Atlantic Sunrise", hospitableId: "481634", url: "https://my.hospitable.com/properties/property/481634/overview" },
];

async function seedProperties() {
    try {
        console.log('🌱 Seeding properties...');

        // Find the admin user to assign as owner
        const adminUser = await prisma.user.findFirst({
            where: { email: 'admin@teammate.com' }
        });

        if (!adminUser) {
            console.error('❌ Admin user not found. Please run create_admin script first.');
            process.exit(1);
        }

        console.log(`✅ Found admin user: ${adminUser.email}`);

        // Delete existing seeded properties (optional - comment out if you want to keep existing data)
        // await prisma.property.deleteMany({});
        // console.log('🧹 Cleared existing properties');

        // Create all properties
        let created = 0;
        let skipped = 0;

        for (const prop of properties) {
            // Check if property with this hospitable ID already exists
            const existing = await prisma.property.findFirst({
                where: {
                    OR: [
                        { hospitableId: prop.hospitableId },
                        { name: prop.name }
                    ]
                }
            });

            if (existing) {
                console.log(`⏭️  Skipping "${prop.name}" - already exists`);
                skipped++;
                continue;
            }

            await prisma.property.create({
                data: {
                    name: prop.name,
                    address: prop.name, // Using name as address for now
                    type: 'HOUSE',
                    bedrooms: 3,
                    bathrooms: 2,
                    status: 'ACTIVE',
                    listingUrl: prop.url,
                    hospitableId: prop.hospitableId,
                    ownerId: adminUser.id,
                    images: JSON.stringify([]), // Empty images array
                }
            });

            created++;
            console.log(`✅ Created property: ${prop.name}`);
        }

        console.log(`\n🎉 Seeding complete!`);
        console.log(`   Created: ${created} properties`);
        console.log(`   Skipped: ${skipped} properties`);
        console.log(`   Total: ${properties.length} properties`);

    } catch (error) {
        console.error('❌ Error seeding properties:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

seedProperties();
