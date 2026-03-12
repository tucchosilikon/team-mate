const fs = require('fs');
const path = require('path');

const csvDir = path.join(__dirname);

const propertyFiles = fs.readdirSync(csvDir)
  .filter(f => f.startsWith('OBX Sharp Stays') && f.endsWith('.csv'));

const parseCSV = (content) => {
  const lines = content.split('\n').filter(l => l.trim());
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  
  const records = [];
  for (let i = 1; i < lines.length; i++) {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (const char of lines[i]) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim().replace(/"/g, ''));
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim().replace(/"/g, ''));
    
    const record = {};
    headers.forEach((h, idx) => {
      record[h] = values[idx] || '';
    });
    records.push(record);
  }
  return records;
};

const extractPropertyName = (filename) => {
  const match = filename.match(/FAQ.*?-\s*(.+)\.csv$/);
  return match ? match[1].trim() : filename;
};

function combinePropertyDetails() {
  const combined = [];
  
  for (const file of propertyFiles) {
    const propertyName = extractPropertyName(file);
    const filePath = path.join(csvDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const records = parseCSV(content);
    
    const propertyData = { 'Property Name': propertyName };
    
    for (const record of records) {
      const field = record.Field?.trim();
      const value = record.Value?.trim();
      if (field && value) {
        propertyData[field] = value;
      }
    }
    
    combined.push(propertyData);
  }
  
  const allFields = new Set();
  combined.forEach(p => Object.keys(p).forEach(k => allFields.add(k)));
  
  const headers = ['Property Name', ...Array.from(allFields).filter(f => f !== 'Property Name')];
  
  let csvContent = headers.join(',') + '\n';
  
  for (const prop of combined) {
    const row = headers.map(h => {
      const val = prop[h] || '';
      const escaped = val.replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvContent += row.join(',') + '\n';
  }
  
  fs.writeFileSync(path.join(csvDir, 'combined', 'all_properties.csv'), csvContent);
  console.log(`✅ Created combined property details: ${combined.length} properties`);
}

function combineCheckInOut() {
  const filePath = path.join(csvDir, 'check-in-check-out.csv');
  fs.copyFileSync(filePath, path.join(csvDir, 'combined', 'check_in_check_out.csv'));
  console.log('✅ Copied check-in-check-out.csv');
}

function combineTasks() {
  const filePath = path.join(csvDir, 'Tasks.csv');
  fs.copyFileSync(filePath, path.join(csvDir, 'combined', 'tasks.csv'));
  console.log('✅ Copied tasks.csv');
}

console.log('📁 Combining CSV files...\n');

combinePropertyDetails();
combineCheckInOut();
combineTasks();

console.log('\n🎉 All files combined successfully!');
console.log('Output folder: csv/combined/');
