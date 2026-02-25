const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const oldDbPath = path.join(__dirname, '../prisma/dev.db');
const newDbPath = path.join(__dirname, '../prisma/dev_new.db');
const backupPath = path.join(__dirname, '../prisma/dev_backup.db');

try {
    console.log('Creating new clean database...\n');

    // Backup current database
    fs.copyFileSync(oldDbPath, backupPath);
    console.log('✅ Backed up current database to dev_backup.db');

    const oldDb = new Database(oldDbPath, { readonly: true });
    const newDb = new Database(newDbPath);

    // Get the schema from old database
    const schema = oldDb.prepare("SELECT sql FROM sqlite_master WHERE type='table' ORDER BY tbl_name").all();
    const indices = oldDb.prepare("SELECT sql FROM sqlite_master WHERE type='index' AND sql IS NOT NULL").all();

    console.log('Copying schema...');

    // Create tables in new database
    schema.forEach(item => {
        if (item.sql) {
            newDb.exec(item.sql);
        }
    });

    // Create indices
    indices.forEach(item => {
        if (item.sql) {
            newDb.exec(item.sql);
        }
    });

    console.log('✅ Schema copied');

    // Get list of tables
    const tables = oldDb.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all();

    console.log('\nCopying data...');

    for (const table of tables) {
        const tableName = table.name;
        console.log(`  Copying ${tableName}...`);

        // Get columns
        const columns = oldDb.prepare(`PRAGMA table_info(${tableName})`).all();
        const columnNames = columns.map(c => c.name).join(', ');

        // Copy data
        const data = oldDb.prepare(`SELECT * FROM ${tableName}`).all();

        if (data.length > 0) {
            const placeholders = columns.map(() => '?').join(', ');
            const insert = newDb.prepare(`INSERT INTO ${tableName} (${columnNames}) VALUES (${placeholders})`);

            const insertMany = newDb.transaction((rows) => {
                for (const row of rows) {
                    const values = columns.map(c => row[c.name]);
                    insert.run(values);
                }
            });

            insertMany(data);
            console.log(`    ✅ Copied ${data.length} rows`);
        }
    }

    oldDb.close();
    newDb.close();

    console.log('\n✅ New database created successfully!');
    console.log('\nTo use the new database:');
    console.log('1. Stop the server');
    console.log('2. Delete prisma/dev.db');
    console.log('3. Rename prisma/dev_new.db to prisma/dev.db');
    console.log('4. Restart the server');
    console.log('\nIf there are issues, restore from prisma/dev_backup.db');

} catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
}
