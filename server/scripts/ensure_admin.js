const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function ensureAdmin() {
    try {
        const hashedPassword = await bcrypt.hash('admin123', 10);

        const user = await prisma.user.upsert({
            where: { email: 'admin@teammate.com' },
            update: { password: hashedPassword, role: 'ADMIN' },
            create: {
                email: 'admin@teammate.com',
                name: 'Admin User',
                password: hashedPassword,
                role: 'ADMIN'
            }
        });

        console.log('✅ Admin user ensured: admin@teammate.com / admin123');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

ensureAdmin();
