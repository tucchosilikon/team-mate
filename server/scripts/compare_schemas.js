const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '../prisma/dev.db');
const db = new Database(dbPath);

try {
    console.log('Comparing Database Schema vs Prisma Schema...\n');

    // Get actual database schema
    const dbSchema = db.prepare("PRAGMA table_info(Property)").all();

    // Read Prisma schema
    const prismaSchemaPath = path.join(__dirname, '../prisma/schema.prisma');
    const prismaSchemaContent = fs.readFileSync(prismaSchemaPath, 'utf8');

    // Parse Prisma Property model
    const modelMatch = prismaSchemaContent.match(/model Property \{[\s\S]*?\n\}/);
    if (!modelMatch) {
        console.error('Could not find Property model in schema.prisma');
        process.exit(1);
    }

    const propertyModel = modelMatch[0];

    console.log('Database Columns:');
    console.log('=================');

    dbSchema.forEach(col => {
        const dbType = col.type;
        const notNull = col.notnull ? 'NOT NULL' : 'NULL';

        // Try to find corresponding field in Prisma schema
        const fieldRegex = new RegExp(`\\s${col.name}\\s+([\\w\\?\\[\\]]+)`, 'i');
        const prismaMatch = propertyModel.match(fieldRegex);
        const prismaType = prismaMatch ? prismaMatch[1] : 'NOT IN PRISMA';

        console.log(`${col.name.padEnd(25)} DB: ${dbType.padEnd(10)} ${notNull.padEnd(10)} Prisma: ${prismaType}`);

        // Check for type mismatches
        if (dbType === 'REAL' && !prismaType.includes('Decimal') && !prismaType.includes('Float') && prismaType !== 'NOT IN PRISMA') {
            console.log(`  ⚠️  WARNING: REAL in DB but ${prismaType} in Prisma`);
        }
        if (dbType === 'TEXT' && prismaType.includes('Int')) {
            console.log(`  ⚠️  WARNING: TEXT in DB but ${prismaType} in Prisma`);
        }
    });

    console.log('\n\nChecking for fields in Prisma but not in DB...');
    const prismaFields = propertyModel.match(/\s+(\w+)\s+[\w\?]+/g);
    if (prismaFields) {
        prismaFields.forEach(field => {
            const fieldName = field.trim().split(/\s+/)[0];
            if (fieldName && !fieldName.startsWith('//') && fieldName !== 'model' && fieldName !== 'Property') {
                const existsInDb = dbSchema.some(col => col.name === fieldName);
                if (!existsInDb && fieldName !== '@@index' && fieldName !== '@@map') {
                    console.log(`  ⚠️  ${fieldName} exists in Prisma but not in database`);
                }
            }
        });
    }

} catch (error) {
    console.error('Error:', error.message);
    console.error(error);
} finally {
    db.close();
}
