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

// Function to fetch actors from IMDb
async function fetchActorsFromIMDb(show) {
  return new Promise((resolve) => {
    const slug = slugify(show.title);
    const url = `https://www.imdb.com/find?q=${encodeURIComponent(show.title)}&s=tt&ttype=tv`;
    
    console.log(`Searching IMDb for: ${show.title}...`);
    
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5'
    };
    
    function fetchUrl(targetUrl) {
      return new Promise((resolveUrl, rejectUrl) => {
        try {
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
              if (res.statusCode === 200 || res.statusCode === 301 || res.statusCode === 302) {
                resolveUrl(data);
              } else {
                rejectUrl(new Error(`HTTP ${res.statusCode}`));
              }
            });
          });
          
          req.on('error', (error) => {
            rejectUrl(error);
          });
          
          req.setTimeout(10000, () => {
            req.destroy();
            rejectUrl(new Error('Request timeout'));
          });
          
          req.end();
        } catch (error) {
          rejectUrl(error);
        }
      });
    }
    
    fetchUrl(url)
      .then((html) => {
        // Try to extract show ID from search results
        const showIdMatch = html.match(/\/title\/(tt\d+)\//);
        if (showIdMatch) {
          const showId = showIdMatch[1];
          const castUrl = `https://www.imdb.com/title/${showId}/fullcredits`;
          
          fetchUrl(castUrl)
            .then((castHtml) => {
              const actors = extractActorsFromIMDb(castHtml);
              resolve(actors);
            })
            .catch(() => {
              resolve([]);
            });
        } else {
          resolve([]);
        }
      })
      .catch(() => {
        resolve([]);
      });
  });
}

// Function to extract actors from IMDb HTML
function extractActorsFromIMDb(html) {
  const actors = [];
  
  // Try to match actor names in the cast table
  // IMDb cast page has a table with actor names
  const actorPattern = /<td class="primary_photo">[\s\S]*?<a href="\/name\/nm\d+\/"[^>]*>([^<]+)<\/a>/g;
  let match;
  const seenActors = new Set();
  
  while ((match = actorPattern.exec(html)) !== null && actors.length < 10) {
    const actorName = match[1].trim();
    if (actorName && !seenActors.has(actorName.toLowerCase())) {
      actors.push(actorName);
      seenActors.add(actorName.toLowerCase());
    }
  }
  
  // Alternative pattern for cast list
  if (actors.length === 0) {
    const altPattern = /<a href="\/name\/nm\d+\/"[^>]*>([^<]+)<\/a>/g;
    while ((match = altPattern.exec(html)) !== null && actors.length < 10) {
      const actorName = match[1].trim();
      if (actorName && actorName.length > 2 && !seenActors.has(actorName.toLowerCase())) {
        // Filter out common non-actor links
        if (!actorName.match(/^(See|More|Full|Cast|Crew|IMDb|Pro|More|Less)$/i)) {
          actors.push(actorName);
          seenActors.add(actorName.toLowerCase());
        }
      }
    }
  }
  
  return actors.slice(0, 10); // Limit to top 10 actors
}

// Function to fetch actors from Wikipedia
async function fetchActorsFromWikipedia(show) {
  return new Promise((resolve) => {
    const slug = slugify(show.title);
    const url = `https://en.wikipedia.org/wiki/${encodeURIComponent(show.title.replace(/ /g, '_'))}`;
    
    console.log(`Searching Wikipedia for: ${show.title}...`);
    
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    };
    
    function fetchUrl(targetUrl) {
      return new Promise((resolveUrl, rejectUrl) => {
        try {
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
          
          req.setTimeout(10000, () => {
            req.destroy();
            rejectUrl(new Error('Request timeout'));
          });
          
          req.end();
        } catch (error) {
          rejectUrl(error);
        }
      });
    }
    
    fetchUrl(url)
      .then((html) => {
        const actors = extractActorsFromWikipedia(html);
        resolve(actors);
      })
      .catch(() => {
        resolve([]);
      });
  });
}

// Function to extract actors from Wikipedia HTML
function extractActorsFromWikipedia(html) {
  const actors = [];
  const seenActors = new Set();
  
  // Look for cast section in Wikipedia
  // Common patterns: "Cast" or "Main cast" sections
  const castSectionMatch = html.match(/<h[23][^>]*>.*?[Cc]ast.*?<\/h[23]>([\s\S]{0,5000})/i);
  if (castSectionMatch) {
    const castSection = castSectionMatch[1];
    
    // Extract actor names from list items
    const listItemPattern = /<li[^>]*>([^<]+(?:<[^>]+>[^<]+<\/[^>]+>)*[^<]*)<\/li>/g;
    let match;
    
    while ((match = listItemPattern.exec(castSection)) !== null && actors.length < 10) {
      let actorText = match[1].replace(/<[^>]+>/g, '').trim();
      // Extract actor name (usually before a dash or comma)
      actorText = actorText.split(/[–—\-–]/)[0].split(',')[0].trim();
      
      if (actorText && actorText.length > 2 && !seenActors.has(actorText.toLowerCase())) {
        // Filter out common non-actor text
        if (!actorText.match(/^(as|played|portrayed|character|role|cast|main|recurring|guest)$/i)) {
          actors.push(actorText);
          seenActors.add(actorText.toLowerCase());
        }
      }
    }
  }
  
  // Alternative: Look for infobox cast list
  const infoboxMatch = html.match(/<th[^>]*>Starring<\/th>[\s\S]{0,2000}<td[^>]*>([\s\S]{0,2000})<\/td>/i);
  if (infoboxMatch && actors.length < 5) {
    const infoboxContent = infoboxMatch[1];
    const linkPattern = /<a[^>]*>([^<]+)<\/a>/g;
    let match;
    
    while ((match = linkPattern.exec(infoboxContent)) !== null && actors.length < 10) {
      const actorName = match[1].trim();
      if (actorName && !seenActors.has(actorName.toLowerCase())) {
        actors.push(actorName);
        seenActors.add(actorName.toLowerCase());
      }
    }
  }
  
  return actors.slice(0, 10);
}

// Main function to fetch actors for a show
async function fetchActors(show) {
  // Try IMDb first
  let actors = await fetchActorsFromIMDb(show);
  
  // If IMDb fails, try Wikipedia
  if (actors.length === 0) {
    actors = await fetchActorsFromWikipedia(show);
  }
  
  return actors;
}

// Process all shows
async function processShows() {
  console.log(`Processing ${shows.length} shows for actor data...\n`);
  
  for (let i = 0; i < shows.length; i++) {
    const show = shows[i];
    
    // Skip if actors already exist
    if (show.actors && show.actors.length > 0) {
      console.log(`Skipping ${show.title} (actors already exist)`);
      continue;
    }
    
    const actors = await fetchActors(show);
    
    if (actors.length > 0) {
      show.actors = actors;
      console.log(`  ✓ Found ${actors.length} actors for ${show.title}: ${actors.slice(0, 3).join(', ')}${actors.length > 3 ? '...' : ''}`);
    } else {
      show.actors = [];
      console.log(`  ✗ No actors found for ${show.title}`);
    }
    
    // Add a delay to avoid overwhelming servers
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Save progress every 10 shows
    if ((i + 1) % 10 === 0) {
      fs.writeFileSync(showsPath, JSON.stringify(shows, null, 2));
      console.log(`  Progress saved (${i + 1}/${shows.length})`);
    }
  }
  
  // Final save
  fs.writeFileSync(showsPath, JSON.stringify(shows, null, 2));
  console.log(`\n✓ Updated ${showsPath} with actor data`);
}

// Run the script
processShows().catch(console.error);
