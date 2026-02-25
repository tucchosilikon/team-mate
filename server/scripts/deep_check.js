const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../prisma/dev.db');
const db = new Database(dbPath);

try {
    console.log('Checking for any non-numeric values in Decimal columns...\n');

    // Get all properties and check their decimal values
    const props = db.prepare(`
        SELECT id, name, bathrooms, petFee 
        FROM Property
    `).all();

    let badRecords = [];

    props.forEach(p => {
        let issues = [];

        // Check bathrooms
        if (p.bathrooms !== null && p.bathrooms !== '') {
            const num = parseFloat(p.bathrooms);
            if (isNaN(num)) {
                issues.push(`bathrooms='${p.bathrooms}' (not a number)`);
            }
        }

        // Check petFee
        if (p.petFee !== null && p.petFee !== '') {
            const num = parseFloat(p.petFee);
            if (isNaN(num)) {
                issues.push(`petFee='${p.petFee}' (not a number)`);
            }
        }

        if (issues.length > 0) {
            badRecords.push({
                id: p.id,
                name: p.name,
                issues: issues
            });
        }
    });

    if (badRecords.length > 0) {
        console.log(`Found ${badRecords.length} records with invalid decimal values:\n`);
        badRecords.forEach(r => {
            console.log(`❌ ${r.name}:`);
            r.issues.forEach(i => console.log(`   - ${i}`));
        });

        // Fix them
        console.log('\nFixing invalid values...');
        badRecords.forEach(r => {
            db.prepare(`UPDATE Property SET bathrooms = NULL, petFee = NULL WHERE id = ?`).run(r.id);
            console.log(`✅ Fixed ${r.name}`);
        });
    } else {
        console.log('✅ No invalid decimal values found!');
    }

    // Also check for weird characters or encoding issues
    console.log('\n\nChecking for encoding issues...');
    const rawCheck = db.prepare(`
        SELECT id, name, typeof(bathrooms) as bathrooms_type, typeof(petFee) as petFee_type,
               bathrooms, petFee
        FROM Property
        WHERE bathrooms IS NOT NULL OR petFee IS NOT NULL
        LIMIT 10
    `).all();

    console.log('Sample decimal field types and values:');
    rawCheck.forEach(r => {
        console.log(`${r.name}:`, {
            bathrooms: `[${r.bathrooms_type}] ${r.bathrooms}`,
            petFee: `[${r.petFee_type}] ${r.petFee}`
        });
    });

} catch (error) {
    console.error('Error:', error.message);
    console.error(error);
} finally {
    db.close();
}
