const Database = require('better-sqlite3');
const fs = require('fs');

const db = new Database('./prisma/dev.db');

console.log('=== Exporting Local Data ===\n');

// Get all tables
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('Tables:', tables.map(t => t.name).join(', '));

// Export Users
const users = db.prepare('SELECT * FROM "User"').all();
console.log('\n--- Users:', users.length);

// Export Leads
const leads = db.prepare('SELECT * FROM Lead').all();
console.log('\n--- Leads:', leads.length);

// Export Properties
const properties = db.prepare('SELECT * FROM Property').all();
console.log('\n--- Properties:', properties.length);

// Export Projects
const projects = db.prepare('SELECT * FROM Project').all();
console.log('\n--- Projects:', projects.length);

// Export SubProjects
const subProjects = db.prepare('SELECT * FROM SubProject').all();
console.log('\n--- SubProjects:', subProjects.length);

// Export Notes
const notes = db.prepare('SELECT * FROM Note').all();
console.log('\n--- Notes:', notes.length);

// Export Transactions
const transactions = db.prepare('SELECT * FROM "Transaction"').all();
console.log('\n--- Transactions:', transactions.length);

// Save to JSON file
const data = {
    users,
    leads,
    properties,
    projects,
    subProjects,
    notes,
    transactions
};

fs.writeFileSync('./local_data_export.json', JSON.stringify(data, null, 2));
console.log('\n✅ Data exported to local_data_export.json');
console.log('\nSummary:');
console.log('  Users:', users.length);
console.log('  Leads:', leads.length);
console.log('  Properties:', properties.length);
console.log('  Projects:', projects.length);

db.close();
