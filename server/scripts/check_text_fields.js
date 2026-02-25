const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../prisma/dev.db');
const db = new Database(dbPath);

try {
    console.log('Checking for corrupted or problematic field data...\n');

    // Get column info
    const schema = db.prepare("PRAGMA table_info(Property)").all();
    const textColumns = schema.filter(c => c.type === 'TEXT' || c.type === 'REAL' || c.type === '').map(c => c.name);

    console.log('Checking columns:', textColumns.join(', '));
    console.log('');

    // Get all properties
    const props = db.prepare(`SELECT id, name FROM Property`).all();
    console.log(`Found ${props.length} total properties\n`);

    // Check each property field by field
    let problematic = [];

    for (const prop of props) {
        for (const col of textColumns) {
            try {
                const val = db.prepare(`SELECT ${col} FROM Property WHERE id = ?`).get(prop.id);
                const value = val[col];

                // Check for null bytes or weird characters
                if (value && typeof value === 'string') {
                    if (value.includes('\u0000')) {
                        problematic.push({ id: prop.id, name: prop.name, column: col, issue: 'contains null byte' });
                    }
                    // Check if it's supposed to be JSON but isn't
                    if (col === 'images' && value && value !== '' && !value.startsWith('[') && !value.startsWith('{')) {
                        problematic.push({ id: prop.id, name: prop.name, column: col, issue: `invalid JSON: "${value.substring(0, 50)}"` });
                    }
                }
            } catch (err) {
                problematic.push({ id: prop.id, name: prop.name, column: col, issue: `error reading: ${err.message}` });
            }
        }
    }

    if (problematic.length > 0) {
        console.log(`\n❌ Found ${problematic.length} problematic fields:\n`);
        problematic.forEach(p => {
            console.log(`${p.name} [${p.column}]: ${p.issue}`);
        });

        // Fix null bytes by replacing them
        console.log('\n\nFixing issues...');
        for (const p of problematic) {
            if (p.issue.includes('null byte')) {
                console.log(`Fixing null bytes in ${p.name}.${p.column}`);
                db.prepare(`UPDATE Property SET ${p.column} = REPLACE(${p.column}, char(0), '') WHERE id = ?`).run(p.id);
            } else if (p.issue.includes('invalid JSON')) {
                console.log(`Clearing invalid JSON in ${p.name}.${p.column}`);
                db.prepare(`UPDATE Property SET ${p.column} = NULL WHERE id = ?`).run(p.id);
            }
        }
        console.log('✅ Fixes applied!');
    } else {
        console.log('✅ No problematic fields found!');
    }

} catch (error) {
    console.error('Error:', error.message);
    console.error(error);
} finally {
    db.close();
}
