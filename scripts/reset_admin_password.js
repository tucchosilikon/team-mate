const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function resetPassword() {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const user = await prisma.user.upsert({
            where: { email: 'admin@teammate.com' },
            update: { password: hashedPassword },
            create: {
                name: 'Admin User',
                email: 'admin@teammate.com',
                password: hashedPassword,
                role: 'ADMIN',
            },
        });

        console.log('✅ Admin password reset to: password123');
        console.log('User:', user.email);
    } catch (error) {
        console.error('❌ Error resetting password:', error);
    } finally {
        await prisma.$disconnect();
    }
}

resetPassword();
