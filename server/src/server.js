require('dotenv').config();
const { httpServer } = require('./app');
const prisma = require('./prisma/client');
const bcrypt = require('bcrypt');

const PORT = process.env.PORT || 5001;

async function ensureAdminUser() {
    try {
        const adminExists = await prisma.user.findUnique({
            where: { email: 'admin@teammate.com' }
        });
        
        if (!adminExists) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('password123', salt);
            await prisma.user.create({
                data: {
                    name: 'Admin',
                    email: 'admin@teammate.com',
                    password: hashedPassword,
                    role: 'ADMIN'
                }
            });
            console.log('✅ Admin user created: admin@teammate.com / password123');
        } else {
            console.log('✅ Admin user already exists');
        }
    } catch (error) {
        console.error('❌ Error creating admin user:', error.message);
    }
}

ensureAdminUser().then(() => {
    httpServer.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on port ${PORT}`);
    });
});
