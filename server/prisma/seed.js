const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding ...');

    // 1. Users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@teammate.com' },
        update: {},
        create: {
            name: 'Admin User',
            email: 'admin@teammate.com',
            password: hashedPassword,
            role: 'ADMIN',
        },
    });

    const teamMember = await prisma.user.upsert({
        where: { email: 'team@teammate.com' },
        update: {},
        create: {
            name: 'Team Member',
            email: 'team@teammate.com',
            password: hashedPassword,
            role: 'TEAM',
        },
    });

    // 2. Leads (Owners)
    const owner1 = await prisma.lead.create({
        data: {
            name: 'Jaden and Jennifer',
            type: 'OWNER',
            contactInfo: JSON.stringify({
                phone: '252-267-1375',
                email: 'obxairbnb64@yahoo.com',
                email2: 'Jen4frank405@gmail.com'
            }),
            status: 'SIGNED',
        },
    });

    const owner2 = await prisma.lead.create({
        data: {
            name: 'Canal Drive Owner',
            type: 'OWNER',
            status: 'SIGNED',
        },
    });

    // 3. Properties - All 38 real properties
    const propertyData = [
        { name: "1CD - Canal Dr. UP", hospitableId: "847214", url: "https://my.hospitable.com/properties/property/847214/overview", owner: owner2 },
        { name: "1HD - Upper Crust, UP South Side Harpoon", hospitableId: "661084", url: "https://my.hospitable.com/properties/property/661084/overview", owner: owner1 },
        { name: "1KS - Honalee Virginia Dare Trail", hospitableId: "1947228", url: "https://my.hospitable.com/properties/property/1947228/overview", owner: owner1 },
        { name: "1VA 1720 Virginia Av", hospitableId: "767278", url: "https://my.hospitable. com/properties/property/767278/overview", owner: owner1 },
        { name: "2CD - Canal Dr. DOWN", hospitableId: "849300", url: "https://my.hospitable.com/properties/property/849300/overview", owner: owner2 },
        { name: "2HD -Sweet Dreams-Dwn South Side Harpoon", hospitableId: "661082", url: "https://my.hospitable.com/properties/property/661082/overview", owner: owner1 },
        { name: "2KS - 300 S Virginia Dare Tail", hospitableId: "1947230", url: "https://my.hospitable.com/properties/property/1947230/overview", owner: owner1 },
        { name: "3HD - Sugar Shack DOWN North Side", hospitableId: "661080", url: "https://my.hospitable.com/properties/property/661080/overview", owner: owner1 },
        { name: "AD - Avalon Drive", hospitableId: "481656", url: "https://my.hospitable.com/properties/property/481656/overview", owner: owner1 },
        { name: "AR - 305 W. Airstrip", hospitableId: "2111088", url: "https://my.hospitable.com/properties/property/2111088/overview", owner: owner1 },
        { name: "AS - Atlantic Sunrise (II)", hospitableId: "2050662", url: "https://my.hospitable.com/properties/property/2050662/overview", owner: owner1 },
        { name: "BB - 1502 Dogwood", hospitableId: "1748110", url: "https://my.hospitable.com/properties/property/1748110/overview", owner: owner1 },
        { name: "BS - 207 Balchen St.", hospitableId: "1094738", url: "https://my.hospitable.com/properties/property/1094738/overview", owner: owner1 },
        { name: "CH - The Cedar House Cedar Drive", hospitableId: "481632", url: "https://my.hospitable.com/properties/property/481632/overview", owner: owner1 },
        { name: "DC - 4129 Drifting Sands", hospitableId: "1818024", url: "https://my.hospitable.com/properties/property/1818024/overview", owner: owner1 },
        { name: "East Unit", hospitableId: "481640", url: "https://my.hospitable.com/properties/property/481640/overview", owner: owner1 },
        { name: "EC - Elizabeth City St.", hospitableId: "481654", url: "https://my.hospitable.com/properties/property/481654/overview", owner: owner1 },
        { name: "EL - B1 1221 S VA Dare", hospitableId: "1435330", url: "https://my.hospitable.com/properties/property/1435330/overview", owner: owner1 },
        { name: "HS - 2018 Highview", hospitableId: "1206240", url: "https://my.hospitable.com/properties/property/1206240/overview", owner: owner1 },
        { name: "JC - 3209 Bay Drive", hospitableId: "2096242", url: "https://my.hospitable.com/properties/property/2096242/overview", owner: owner1 },
        { name: "KB - 50 N Dune Loop", hospitableId: "1742440", url: "https://my.hospitable.com/properties/property/1742440/overview", owner: owner1 },
        { name: "KW - KW - KW", hospitableId: "1162852", url: "https://my.hospitable.com/properties/property/1162852/overview", owner: owner1 },
        { name: "LH - Little House Suffolk St.", hospitableId: "481642", url: "https://my.hospitable.com/properties/property/481642/overview", owner: owner1 },
        { name: "Lost Boys Hideout", hospitableId: "640082", url: "https://my.hospitable.com/properties/property/640082/overview", owner: owner1 },
        { name: "Maria's Avalon", hospitableId: "481636", url: "https://my.hospitable.com/properties/property/481636/overview", owner: owner1 },
        { name: "MV - 1217 VA Dare Tr", hospitableId: "1064928", url: "https://my.hospitable.com/properties/property/1064928/overview", owner: owner1 },
        { name: "North Unit", hospitableId: "481644", url: "https://my.hospitable.com/properties/property/481644/overview", owner: owner1 },
        { name: "PD - Palmetto Drive", hospitableId: "570304", url: "https://my.hospitable.com/properties/property/570304/overview", owner: owner1 },
        { name: "RN - 323 W Blue Jay", hospitableId: "1741992", url: "https://my.hospitable.com/properties/property/1741992/overview", owner: owner1 },
        { name: "SD - Sportsman Drive", hospitableId: "481628", url: "https://my.hospitable.com/properties/property/481628/overview", owner: owner1 },
        { name: "SH - B2 Admirals View", hospitableId: "1585696", url: "https://my.hospitable.com/properties/property/1585696/overview", owner: owner1 },
        { name: "South Unit", hospitableId: "481638", url: "https://my.hospitable.com/properties/property/481638/overview", owner: owner1 },
        { name: "VA - Virginia Ave. 1721", hospitableId: "712230", url: "https://my.hospitable.com/properties/property/712230/overview", owner: owner1 },
        { name: "WA-2021 Wrightsville", hospitableId: "1016104", url: "https://my.hospitable.com/properties/property/1016104/overview", owner: owner1 },
        { name: "Wise Property", hospitableId: "579906", url: "https://my.hospitable.com/properties/property/579906/overview", owner: owner1 },
        { name: "WS - 808 W Sportsman", hospitableId: "2147404", url: "https://my.hospitable.com/properties/property/2147404/overview", owner: owner1 },
        { name: "YS - 2004 Yorktown", hospitableId: "1197986", url: "https://my.hospitable.com/properties/property/1197986/overview", owner: owner1 },
        { name: "AS - Atlantic Sunrise", hospitableId: "481634", url: "https://my.hospitable.com/properties/property/481634/overview", owner: owner1 },
    ];

    const createdProperties = [];
    for (const propData of propertyData) {
        const prop = await prisma.property.upsert({
            where: { hospitableId: propData.hospitableId },
            update: {},
            create: {
                name: propData.name,
                address: propData.name, // Use name as address for now
                listingUrl: propData.url,
                hospitableId: propData.hospitableId,
                status: 'ACTIVE',
                ownerId: propData.owner.id,
                type: 'HOUSE',
                bedrooms: 3,
                bathrooms: 2,
                images: JSON.stringify([]),
            },
        });
        createdProperties.push(prop);
    }

    console.log(`✅ Created/updated ${createdProperties.length} properties`);

    // 4. Projects
    await prisma.project.createMany({
        data: [
            {
                title: 'Clean 1CD - Canal Drive',
                propertyId: createdProperties[0].id,
                status: 'TODO',
                priority: 'HIGH',
                assignedToId: teamMember.id,
                dueDate: new Date(new Date().setDate(new Date().getDate() + 1)), // Tomorrow
            },
            {
                title: 'Inspect 1HD - Upper Crust',
                propertyId: createdProperties[1].id,
                status: 'IN_PROGRESS',
                priority: 'MEDIUM',
                assignedToId: admin.id,
            },
            {
                title: 'Restock Supplies',
                status: 'TODO',
                priority: 'LOW',
            }
        ]
    });

    console.log('Seeding finished.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
