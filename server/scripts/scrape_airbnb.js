const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function scrapeAirbnb(url) {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-blink-features=AutomationControlled',
      '--disable-features=IsolateOrigins,site-per-process',
      '--window-size=1920,1080',
      '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      '--accept-lang=en-US,en;q=0.9',
      '--enable-features=NetworkService,NetworkServiceInProcess',
      '--disable-web-security',
      '--allow-running-insecure-content',
      '--disable-extensions',
      '--disable-default-apps',
      '--disable-sync',
      '--metrics-recording-only',
      '--mute-audio',
      '--no-first-run',
      '--safebrowsing-disable-auto-update'
    ]
  });

  const page = await browser.newPage();
  
  await page.setRequestInterception(true);
  
  // Block requests that might reveal automation
  page.on('request', (req) => {
    const resourceType = req.resourceType();
    if (['font', 'media', 'websocket'].includes(resourceType)) {
      req.abort();
    } else {
      req.continue();
    }
  });

  console.log(`📡 Fetching: ${url}`);
  
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Wait for page to fully load
    await page.waitForFunction(() => document.readyState === 'complete', { timeout: 30000 });
    
    // Try to wait for key elements
    try {
      await page.waitForSelector('h1', { timeout: 15000 });
    } catch (e) {
      console.log('⚠️ H1 not found, page might be blocked');
    }
    
    // Additional wait for dynamic content
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Extract property data
    const data = await page.evaluate(() => {
      const result = {
        title: '',
        description: '',
        details: {},
        images: [],
        amenities: [],
        price: '',
        location: '',
        bedInfo: [],
        guestCapacity: '',
        checkIn: '',
        checkOut: '',
        host: ''
      };
      
      // Title - try multiple selectors
      const selectors = ['h1', '[data-testid="title"]', '.h1', '#title', '.text-h2'];
      for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (el) {
          result.title = el.textContent.trim();
          break;
        }
      }
      
      // Description - try multiple selectors
      const descSelectors = ['[data-testid="description"]', '.description', '#description', '[class*="description"]'];
      for (const sel of descSelectors) {
        const el = document.querySelector(sel);
        if (el) {
          result.description = el.textContent.trim().substring(0, 1000);
          break;
        }
      }
      
      // Property details section
      const detailSelectors = ['[data-testid="property-details"]', '.property-details', '#details'];
      for (const sel of detailSelectors) {
        const container = document.querySelector(sel);
        if (container) {
          container.querySelectorAll('li, span, div').forEach(el => {
            const text = el.textContent.trim();
            if (text && text.length < 100) {
              result.details[text.substring(0, 40)] = text;
            }
          });
        }
      }
      
      // Images - look for actual property images
      const imgSelectors = ['img[src*="airbnb.com"]', '.image-gallery img', '[class*="photo"] img', '[class*="gallery"] img'];
      for (const sel of imgSelectors) {
        document.querySelectorAll(sel).forEach(img => {
          const src = img.src || img.dataset.src;
          if (src && src.includes('airbnb') && !src.includes('avatar') && !src.includes('icon') && !src.includes('logo')) {
            // Get higher resolution URL
            const highRes = src.replace(/im_w=\d+/, 'im_w=1200').replace(/im_h=\d+/, 'im_h=800');
            if (!result.images.includes(highRes) && !result.images.includes(src)) {
              result.images.push(highRes);
            }
          }
        });
      }
      
      // Try to get images from meta tags
      document.querySelectorAll('meta[property="og:image"]').forEach(meta => {
        const src = meta.content;
        if (src && src.includes('airbnb') && !result.images.includes(src)) {
          result.images.push(src);
        }
      });
      
      // Amenities
      const amenitySelectors = ['[data-testid="amenities"]', '.amenities', '#amenities', '[class*="amenity"]'];
      for (const sel of amenitySelectors) {
        const container = document.querySelector(sel);
        if (container) {
          container.querySelectorAll('li, span, div').forEach(el => {
            const text = el.textContent.trim();
            if (text && text.length < 80 && !result.amenities.includes(text)) {
              result.amenities.push(text);
            }
          });
        }
      }
      
      // Price
      const priceSelectors = ['[data-testid="price"]', '.price', '#price', '[class*="price"]', '.h2_price'];
      for (const sel of priceSelectors) {
        const el = document.querySelector(sel);
        if (el) {
          result.price = el.textContent.trim();
          break;
        }
      }
      
      // Get text content for more data
      const bodyText = document.body.innerText;
      
      // Extract bed/bath info
      const bedMatch = bodyText.match(/(\d+)\s*(bed|bedroom|bedroom)/i);
      if (bedMatch) result.bedInfo.push(bedMatch[0]);
      
      const bathMatch = bodyText.match(/(\d+)\s*(bath|bathroom)/i);
      if (bathMatch) result.bedInfo.push(bathMatch[0]);
      
      const guestMatch = bodyText.match(/(\d+)\s*(guest|person)/i);
      if (guestMatch) result.guestCapacity = guestMatch[0];
      
      return result;
    });
    
    console.log('\n✅ Scraped data:');
    console.log('Title:', data.title);
    console.log('Images found:', data.images.length);
    console.log('Description:', data.description.substring(0, 100) + '...');
    
    // Save to file
    const outputPath = path.join(__dirname, 'scraped_property.json');
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    console.log(`\n💾 Saved to: ${outputPath}`);
    
    return data;
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    // Take screenshot for debugging
    try {
      await page.screenshot({ path: path.join(__dirname, 'error_screenshot.png') });
      console.log('📸 Screenshot saved to error_screenshot.png');
    } catch (e) {}
    
    return null;
  } finally {
    await browser.close();
  }
}

// Run with URL from command line
const url = process.argv[2] || 'https://www.airbnb.com/rooms/4937374';
scrapeAirbnb(url);
