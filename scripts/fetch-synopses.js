import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the shows data
const showsPath = path.join(__dirname, '..', 'data', 'sample-shows.json');
const shows = JSON.parse(fs.readFileSync(showsPath, 'utf-8'));

// Function to convert show title to URL-friendly slug
function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Function to fetch synopsis from u.co.uk
async function fetchSynopsis(show) {
  const slug = slugify(show.title);
  const url = `https://u.co.uk/shows/${slug}`;
  
  return new Promise((resolve) => {
    console.log(`Fetching synopsis for: ${show.title}...`);
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    };
    
    function fetchUrl(targetUrl) {
      return new Promise((resolveUrl, rejectUrl) => {
        const urlObj = new URL(targetUrl);
        const options = {
          hostname: urlObj.hostname,
          path: urlObj.pathname + urlObj.search,
          method: 'GET',
          headers: headers
        };
        
        const req = https.request(options, (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => {
            if (res.statusCode === 200) {
              resolveUrl(data);
            } else {
              rejectUrl(new Error(`HTTP ${res.statusCode}`));
            }
          });
        });
        
        req.on('error', (error) => {
          rejectUrl(error);
        });
        
        req.end();
      });
    }
    
    function extractSynopsis(html) {
      // Try to extract meta description
      const metaDescMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i) ||
                            html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i);
      if (metaDescMatch) {
        return metaDescMatch[1].trim();
      }
      
      // Try to extract from common class names
      const synopsisMatch = html.match(/<[^>]*class=["'][^"']*synopsis[^"']*["'][^>]*>([^<]+)</i) ||
                           html.match(/<[^>]*class=["'][^"']*description[^"']*["'][^>]*>([^<]+)</i);
      if (synopsisMatch) {
        return synopsisMatch[1].trim();
      }
      
      // Try to extract first paragraph
      const pMatch = html.match(/<p[^>]*>([^<]+)</i);
      if (pMatch) {
        return pMatch[1].trim();
      }
      
      return null;
    }
    
    fetchUrl(url)
      .then((html) => {
        const synopsis = extractSynopsis(html);
        resolve(synopsis);
      })
      .catch(() => {
        // Try alternative URL patterns
        const altUrl = `https://u.co.uk/shows/${slug}/watch-online`;
        fetchUrl(altUrl)
          .then((html) => {
            const synopsis = extractSynopsis(html);
            resolve(synopsis);
          })
          .catch(() => {
            console.log(`  Could not find page for ${show.title}`);
            resolve(null);
          });
      });
  });
}

// Process all shows
async function processShows() {
  console.log(`Processing ${shows.length} shows...\n`);
  
  for (let i = 0; i < shows.length; i++) {
    const show = shows[i];
    
    // Skip if synopsis already exists
    if (show.synopsis) {
      console.log(`Skipping ${show.title} (synopsis already exists)`);
      continue;
    }
    
    const synopsis = await fetchSynopsis(show);
    
    if (synopsis) {
      show.synopsis = synopsis;
      console.log(`  ✓ Found synopsis for ${show.title}`);
    } else {
      // Use description as fallback synopsis
      show.synopsis = show.description || 'Synopsis not available.';
      console.log(`  ✗ Using description as synopsis for ${show.title}`);
    }
    
    // Add a small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Write updated data back to file
  fs.writeFileSync(showsPath, JSON.stringify(shows, null, 2));
  console.log(`\n✓ Updated ${showsPath} with synopsis data`);
}

// Run the script
processShows().catch(console.error);

