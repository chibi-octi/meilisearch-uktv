import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the shows data
const showsPath = path.join(__dirname, '..', 'data', 'sample-shows.json');
const shows = JSON.parse(fs.readFileSync(showsPath, 'utf-8'));

// Known actor mappings for shows that are hard to scrape (can be expanded)
const knownActors = {
  "Hotel Portofino": ["Natasha McElhone", "Mark Umbers", "Louise Binder", "Elizabeth Carling", "Adam James"],
  "The Bill": ["Mark Wingett", "Graham Cole", "Trudie Goodwin", "Jeff Stewart", "Lisa Geoghan"],
  "Death in Paradise": ["Ben Miller", "Sara Martins", "Danny John-Jules", "Gary Carr", "Kris Marshall", "Joséphine Jobert", "Ardal O'Hanlon", "Ralf Little"],
  "Midsomer Murders": ["John Nettles", "Daniel Casey", "Neil Dudgeon", "Jason Hughes", "Nick Hendrix"],
  "Line of Duty": ["Martin Compston", "Vicky McClure", "Adrian Dunbar", "Craig Parkinson", "Keeley Hawes"],
  "Broadchurch": ["David Tennant", "Olivia Colman", "Jodie Whittaker", "Andrew Buchan", "Arthur Darvill"],
  "Vera": ["Brenda Blethyn", "David Leon", "Jon Morrison", "Kenny Doughty", "Cush Jumbo"],
  "Shetland": ["Douglas Henshall", "Alison O'Donnell", "Steven Robertson", "Mark Bonnar", "Julie Graham"],
  "Happy Valley": ["Sarah Lancashire", "Siobhan Finneran", "James Norton", "Steve Pemberton", "George Costigan"],
  "Luther": ["Idris Elba", "Ruth Wilson", "Dermot Crowley", "Michael Smiley", "Warren Brown"],
  "Silent Witness": ["Amanda Burton", "Emilia Fox", "William Gaminara", "Tom Ward", "David Caves"],
  "Poirot": ["David Suchet", "Hugh Fraser", "Philip Jackson", "Pauline Moran"],
  "Miss Marple": ["Joan Hickson", "Geraldine McEwan", "Julia McKenzie"],
  "Grantchester": ["James Norton", "Robson Green", "Tom Brittney", "Al Weaver"],
  "Father Brown": ["Mark Williams", "Sorcha Cusack", "Nancy Carroll", "Hugo Speer"],
  "The Office": ["Ricky Gervais", "Martin Freeman", "Mackenzie Crook", "Lucy Davis"],
  "Peep Show": ["David Mitchell", "Robert Webb", "Olivia Colman", "Matt King"],
  "The Inbetweeners": ["Simon Bird", "James Buckley", "Blake Harrison", "Joe Thomas"],
  "Only Fools and Horses": ["David Jason", "Nicholas Lyndhurst", "Buster Merryfield", "Roger Lloyd-Pack"],
  "Fawlty Towers": ["John Cleese", "Prunella Scales", "Andrew Sachs", "Connie Booth"],
  "Blackadder": ["Rowan Atkinson", "Tony Robinson", "Tim McInnerny", "Hugh Laurie"],
  "Monty Python's Flying Circus": ["John Cleese", "Michael Palin", "Graham Chapman", "Terry Jones", "Eric Idle", "Terry Gilliam"],
  "Parks and Recreation": ["Amy Poehler", "Rashida Jones", "Aziz Ansari", "Nick Offerman", "Aubrey Plaza"],
  "The Good Wife": ["Julianna Margulies", "Christine Baranski", "Josh Charles", "Matt Czuchry", "Archie Panjabi"],
  "Suits": ["Gabriel Macht", "Patrick J. Adams", "Rick Hoffman", "Meghan Markle", "Sarah Rafferty"],
  "Elementary": ["Jonny Lee Miller", "Lucy Liu", "Aidan Quinn", "Jon Michael Hill"],
  "The Good Fight": ["Christine Baranski", "Cush Jumbo", "Rose Leslie", "Delroy Lindo"],
  "Shetland": ["Douglas Henshall", "Alison O'Donnell", "Steven Robertson", "Mark Bonnar"],
  "Unforgotten": ["Nicola Walker", "Sanjeev Bhaskar", "Trevor Eve", "Tom Courtenay"],
  "The Missing": ["James Nesbitt", "Frances O'Connor", "Tchéky Karyo", "Ken Stott"],
  "New Tricks": ["James Bolam", "Alun Armstrong", "Dennis Waterman", "Amanda Redman"],
  "Foyle's War": ["Michael Kitchen", "Honeysuckle Weeks", "Anthony Howell"],
  "Inspector Morse": ["John Thaw", "Kevin Whately", "James Grout"],
  "Lewis": ["Kevin Whately", "Laurence Fox", "Clare Holman"],
  "Agatha Raisin": ["Ashley Jensen", "Matt McCooey", "Jason Merrells"],
  "The Brokenwood Mysteries": ["Neill Rea", "Fern Sutherland", "Nic Sampson"],
  "My Life is Murder": ["Lucy Lawless", "Bernie Van Tiel", "Edoardo Ballerini"],
  "The Doctor Blake Mysteries": ["Craig McLachlan", "Nadine Garner", "Joel Tobeck"],
  "Rake": ["Richard Roxburgh", "Matt Day", "Caroline Brazier"],
  "Kavanagh QC": ["John Thaw", "Lisa Harrow", "Oliver Ford Davies"],
  "Coronation Street": ["William Roache", "Barbara Knox", "Sue Nicholls"],
  "Emmerdale": ["Chris Chittell", "Charlotte Bellamy", "Jeff Hordley"],
  "Holby City": ["Hugh Quarshie", "Amanda Mealing", "Guy Henry"],
  "Extras": ["Ricky Gervais", "Ashley Jensen", "Stephen Merchant"],
  "The IT Crowd": ["Chris O'Dowd", "Richard Ayoade", "Katherine Parkinson"],
  "Black Books": ["Dylan Moran", "Bill Bailey", "Tamsin Greig"],
  "Spaced": ["Simon Pegg", "Jessica Hynes", "Nick Frost"],
  "Friday Night Dinner": ["Tamsin Greig", "Paul Ritter", "Simon Bird", "Tom Rosenthal"],
  "Outnumbered": ["Hugh Dennis", "Claire Skinner", "Tyger Drew-Honey"],
  "Miranda": ["Miranda Hart", "Tom Ellis", "Sarah Hadland"],
  "Not Going Out": ["Lee Mack", "Sally Bretton", "Tim Vine"],
  "My Family": ["Robert Lindsay", "Zoë Wanamaker", "Kris Marshall"],
  "Yes Minister": ["Paul Eddington", "Nigel Hawthorne", "Derek Fowlds"],
  "The Thick of It": ["Peter Capaldi", "Chris Addison", "James Smith"],
  "Veep": ["Julia Louis-Dreyfus", "Tony Hale", "Anna Chlumsky"],
  "30 Rock": ["Tina Fey", "Alec Baldwin", "Tracy Morgan"],
  "Community": ["Joel McHale", "Gillian Jacobs", "Danny Pudi"],
  "The Office (US)": ["Steve Carell", "John Krasinski", "Jenna Fischer"],
  "Blue Planet": ["David Attenborough"],
  "Planet Earth": ["David Attenborough"],
  "Frozen Planet": ["David Attenborough"],
  "Life on Earth": ["David Attenborough"],
  "The World at War": ["Laurence Olivier"],
  "Walking with Dinosaurs": ["Kenneth Branagh"],
  "Time Team": ["Tony Robinson", "Mick Aston", "Phil Harding"],
  "Coast": ["Neil Oliver", "Mark Horton", "Tessa Dunlop"],
  "Great British Railway Journeys": ["Michael Portillo"],
  "Antiques Roadshow": ["Fiona Bruce"],
  "Bargain Hunt": ["David Dickinson", "Tim Wonnacott"],
  "Countryfile": ["John Craven", "Matt Baker", "Helen Skelton"],
  "MasterChef": ["John Torode", "Gregg Wallace"],
  "A Place in the Sun": ["Jasmine Harman", "Laura Hamilton"]
};

// Function to fetch actors using web search (simulated with known data and Wikipedia)
async function fetchActors(show) {
  // First check known actors
  if (knownActors[show.title]) {
    return knownActors[show.title];
  }
  
  // Try to fetch from Wikipedia
  return await fetchActorsFromWikipedia(show);
}

// Function to fetch actors from Wikipedia
async function fetchActorsFromWikipedia(show) {
  return new Promise((resolve) => {
    const title = show.title.replace(/ /g, '_');
    const url = `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`;
    
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
        const actors = extractActorsFromWikipedia(html, show.title);
        resolve(actors);
      })
      .catch(() => {
        resolve([]);
      });
  });
}

// Function to extract actors from Wikipedia HTML
function extractActorsFromWikipedia(html, showTitle) {
  const actors = [];
  const seenActors = new Set();
  
  // Look for infobox starring section
  const starringPatterns = [
    /<th[^>]*>Starring<\/th>[\s\S]{0,3000}<td[^>]*>([\s\S]{0,3000})<\/td>/i,
    /<th[^>]*>Cast<\/th>[\s\S]{0,3000}<td[^>]*>([\s\S]{0,3000})<\/td>/i,
    /<th[^>]*>Main cast<\/th>[\s\S]{0,3000}<td[^>]*>([\s\S]{0,3000})<\/td>/i
  ];
  
  for (const pattern of starringPatterns) {
    const match = html.match(pattern);
    if (match) {
      const content = match[1];
      // Extract actor names from links
      const linkPattern = /<a[^>]*href="\/wiki\/[^"]*"[^>]*>([^<]+)<\/a>/g;
      let linkMatch;
      
      while ((linkMatch = linkPattern.exec(content)) !== null && actors.length < 15) {
        const actorName = linkMatch[1].trim();
        // Filter out non-actor links (common Wikipedia patterns)
        if (actorName && 
            actorName.length > 2 && 
            !seenActors.has(actorName.toLowerCase()) &&
            !actorName.match(/^(as|played|portrayed|character|role|cast|main|recurring|guest|series|season|episode|television|tv|show|programme|program)$/i) &&
            !actorName.match(/^\d+$/)) {
          actors.push(actorName);
          seenActors.add(actorName.toLowerCase());
        }
      }
      
      if (actors.length > 0) break;
    }
  }
  
  // Alternative: Look for cast section heading
  if (actors.length === 0) {
    const castSectionMatch = html.match(/<h[23][^>]*>.*?[Cc]ast.*?<\/h[23]>([\s\S]{0,5000})/i);
    if (castSectionMatch) {
      const castSection = castSectionMatch[1];
      const listItemPattern = /<li[^>]*>([\s\S]{0,500})<\/li>/g;
      let match;
      
      while ((match = listItemPattern.exec(castSection)) !== null && actors.length < 15) {
        const itemText = match[1];
        // Extract actor name from list item
        const actorLinkMatch = itemText.match(/<a[^>]*href="\/wiki\/[^"]*"[^>]*>([^<]+)<\/a>/);
        if (actorLinkMatch) {
          let actorName = actorLinkMatch[1].trim();
          // Clean up common prefixes
          actorName = actorName.replace(/^as\s+/i, '').split(/[–—\-–]/)[0].split(',')[0].trim();
          
          if (actorName && 
              actorName.length > 2 && 
              !seenActors.has(actorName.toLowerCase()) &&
              !actorName.match(/^(played|portrayed|character|role|cast|main|recurring|guest)$/i)) {
            actors.push(actorName);
            seenActors.add(actorName.toLowerCase());
          }
        }
      }
    }
  }
  
  return actors.slice(0, 15); // Limit to top 15 actors
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
      console.log(`  ✓ Found ${actors.length} actors for ${show.title}: ${actors.slice(0, 5).join(', ')}${actors.length > 5 ? '...' : ''}`);
    } else {
      show.actors = [];
      console.log(`  ✗ No actors found for ${show.title}`);
    }
    
    // Add a delay to avoid overwhelming servers
    await new Promise(resolve => setTimeout(resolve, 800));
    
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

