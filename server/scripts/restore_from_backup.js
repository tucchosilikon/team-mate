const Database = require('better-sqlite3');
const path = require('path');

const backupDbPath = path.join(__dirname, '../prisma/dev_corrupted_backup.db');
const newDbPath = path.join(__dirname, '../prisma/dev.db');

try {
    console.log('Restoring data from backup...\n');

    const backup = new Database(backupDbPath, { readonly: true });
    const newDb = new Database(newDbPath);

    // List of tables to copy in order (respecting foreign keys)
    const tablesToCopy = [
        'User',
        'Lead',
        'Property',
        'Task', // or Project
        'SubTask',
        'Note',
        'Reservation',
        'Transaction',
        'Vendor'
    ];

    for (const tableName of tablesToCopy) {
        try {
            console.log(`Copying ${tableName}...`);

            // Check if table exists in backup
            const tableExists = backup.prepare(
                `SELECT name FROM sqlite_master WHERE type='table' AND name=?`
            ).get(tableName);

            if (!tableExists) {
                console.log(`  ⚠️  Table ${tableName} does not exist in backup, skipping`);
                continue;
            }

            // Get columns for this table
            const columns = backup.prepare(`PRAGMA table_info(${tableName})`).all();
            const columnNames = columns.map(c => c.name);

            // Get all data
            const data = backup.prepare(`SELECT * FROM ${tableName}`).all();

            if (data.length === 0) {
                console.log(`  ℹ️  No data in ${tableName}`);
                continue;
            }

            // Prepare insert statement
            const placeholders = columnNames.map(() => '?').join(', ');
            const columnsStr = columnNames.join(', ');
            const insert = newDb.prepare(
                `INSERT OR REPLACE INTO ${tableName} (${columnsStr}) VALUES (${placeholders})`
            );

            const insertMany = newDb.transaction((rows) => {
                for (const row of rows) {
                    const values = columnNames.map(col => row[col]);
                    insert.run(values);
                }
            });

            insertMany(data);
            console.log(`  ✅ Copied ${data.length} rows`);

        } catch (error) {
            console.error(`  ❌ Error copying ${tableName}:`, error.message);
        }
    }

    backup.close();
    newDb.close();

    console.log('\n✅ Data restoration complete!');
    console.log('Please restart the server and test the Properties page.');

} catch (error) {
    console.error('❌ Fatal error:', error.message);
    console.error(error);
}
