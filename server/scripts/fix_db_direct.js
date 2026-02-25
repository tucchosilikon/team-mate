const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../prisma/dev.db');
const db = new Database(dbPath);

try {
    console.log('Inspecting database at:', dbPath);

    // Check the schema
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    console.log('Tables:', tables.map(t => t.name));

    // Check Property table structure
    const schema = db.prepare("PRAGMA table_info(Property)").all();
    console.log('\nProperty table columns:');
    schema.forEach(col => {
        console.log(`  ${col.name}: ${col.type} ${col.notnull ? 'NOT NULL' : 'NULL'}`);
    });

    // Sample some raw data
    console.log('\nSample Property data (first 3):');
    const samples = db.prepare("SELECT id, name, bathrooms, petFee FROM Property LIMIT 3").all();
    console.log(samples);

    // Now FIX: Set all empty string decimals to NULL
    console.log('\n\nFixing corrupted fields...');

    const fix1 = db.prepare("UPDATE Property SET bathrooms = NULL WHERE bathrooms = ''").run();
    console.log(`Fixed ${fix1.changes} bathrooms records`);

    const fix2 = db.prepare("UPDATE Property SET petFee = NULL WHERE petFee = ''").run();
    console.log(`Fixed ${fix2.changes} petFee records`);

    console.log('\n✅ Database cleanup complete!');

} catch (error) {
    console.error('Error:', error.message);
} finally {
    db.close();
}
