const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function scrapeFromText(html) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setContent(html);

  const data = await page.evaluate(() => {
    const result = {
      title: '',
      description: '',
      images: [],
      amenities: [],
      details: {},
      location: '',
      price: '',
      bedInfo: [],
      guestCapacity: ''
    };

    // Get title
    const title = document.querySelector('h1, title');
    result.title = title ? title.textContent.trim() : '';

    // Get all text content
    const bodyText = document.body.innerText;

    // Extract bed/bath info
    const bedMatch = bodyText.match(/(\d+)\s*(bed|bedroom|bedrooms)/i);
    if (bedMatch) result.details['Bedrooms'] = bedMatch[0];
    
    const bathMatch = bodyText.match(/(\d+)\s*(bath|bathroom|bathrooms)/i);
    if (bathMatch) result.details['Bathrooms'] = bathMatch[0];
    
    const guestMatch = bodyText.match(/(\d+)\s*(guest|guests|people|person)/i);
    if (guestMatch) result.guestCapacity = guestMatch[0];

    // Extract address
    const addressMatch = bodyText.match(/(\d+\s+[\w\s]+,?\s*[A-Z]{2}\s*\d{5})/);
    if (addressMatch) result.location = addressMatch[0];

    // Get images
    document.querySelectorAll('img').forEach(img => {
      const src = img.src || img.dataset.src;
      if (src && (src.includes('photos') || src.includes('images') || src.includes('cdn'))) {
        result.images.push(src);
      }
    });

    return result;
  });

  await browser.close();
  return data;
}

// Manual property data entry based on research
const manualData = {
  title: 'Sugar Shack | Private | Kayaks | Bikes | MP7.5',
  location: 'Kill Devil Hills, NC',
  address: 'Kill Devil Hills, NC 27948',
  description: 'Private efficiency suite with kayaks, bikes, and more. Great location between ocean and sound.',
  bedrooms: 1,
  bathrooms: 1,
  beds: 1,
  guestCapacity: 2,
  checkInTime: '4:00 PM',
  checkOutTime: '10:00 AM',
  petsAllowed: true,
  maxPets: 2,
  petFee: 10,
  amenities: [
    'Air Conditioning',
    'Kitchen',
    'Parking',
    'TV',
    'Kayaks',
    'Bikes',
    'Beach Access',
    'Balcony/Terrace',
    'Pet Friendly'
  ],
  images: [],
  pricePerNight: 149,
  type: 'Private guest suite',
  wifiName: 'ABNB 5G',
  wifiPassword: '5StarStay',
  entryMethod: 'Key under shell / Lockbox',
  parkingInstructions: '1 vehicle - grass area by green electrical box',
  houseRules: 'No smoking, no towels to beach, quiet hours 11pm-7am'
};

// Save manual data
const outputPath = path.join(__dirname, 'airbnb_import_template.json');
fs.writeFileSync(outputPath, JSON.stringify(manualData, null, 2));

console.log('📋 Property data for import:');
console.log(JSON.stringify(manualData, null, 2));
console.log(`\n💾 Saved to: ${outputPath}`);
