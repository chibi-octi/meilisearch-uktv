import { MeiliSearch } from 'meilisearch';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const client = new MeiliSearch({
  host: process.env.VITE_MEILISEARCH_HOST || 'http://127.0.0.1:7700',
  apiKey: process.env.VITE_MEILISEARCH_API_KEY || undefined,
});

const INDEX_NAME = process.env.VITE_MEILISEARCH_INDEX || 'shows';

// Load sample data from JSON file
// You can specify a custom file path via command line argument or use the default
const dataFile = process.argv[2] || join(__dirname, '../data/sample-shows.json');

let sampleShows;
try {
  const fileContent = readFileSync(dataFile, 'utf-8');
  sampleShows = JSON.parse(fileContent);
  console.log(`📄 Loading data from: ${dataFile}\n`);
} catch (error) {
  console.error(`❌ Error reading JSON file: ${dataFile}`);
  console.error(`   ${error.message}\n`);
  console.error('💡 Make sure the file exists and is valid JSON.');
  console.error('   You can specify a custom file: node scripts/setup-meilisearch.js path/to/your/data.json\n');
  process.exit(1);
}

async function setupMeilisearch() {
  try {
    console.log('🚀 Setting up Meilisearch...\n');

    // Check if Meilisearch is running
    try {
      await client.health();
      console.log('✅ Meilisearch is running\n');
    } catch (error) {
      console.error('❌ Cannot connect to Meilisearch. Please make sure it\'s running on http://127.0.0.1:7700');
      console.error('   Start Meilisearch with: docker run -d -p 7700:7700 getmeili/meilisearch:latest\n');
      process.exit(1);
    }

    // Get or create index
    let index;
    try {
      // Try to get the index
      index = client.index(INDEX_NAME);
      // Check if index exists by trying to get its info
      await index.getRawInfo();
      console.log(`📦 Using existing index: ${INDEX_NAME}\n`);
    } catch (error) {
      // Index doesn't exist, create it
      console.log(`📦 Creating new index: ${INDEX_NAME}\n`);
      await client.createIndex(INDEX_NAME, { primaryKey: 'id' });
      index = client.index(INDEX_NAME);
    }

    // Configure index settings for typo tolerance and better search
    console.log('⚙️  Configuring search settings (typo tolerance, ranking)...\n');
    try {
      await index.updateSettings({
        typoTolerance: {
          enabled: true,
          minWordSizeForTypos: {
            oneTypo: 4,  // Words with 4+ characters can have 1 typo
            twoTypos: 8  // Words with 8+ characters can have 2 typos
          },
          disableOnWords: [],
          disableOnAttributes: []
        },
        // Searchable attributes optimized for natural language queries
        // Description and synopsis are weighted heavily as they contain rich contextual information
        // that matches natural language queries like "show about solving crimes" or "drama set in Italy"
        searchableAttributes: [
          'title',           // Exact title matches are still most important
          'description',     // Rich contextual descriptions help with natural language queries
          'synopsis',        // Detailed synopses provide more matching opportunities for descriptive queries
          'category',        // Category helps with genre-based queries
          'actors'           // Actor names for cast-based searches
        ],
        rankingRules: [
          'words',           // Number of matching words (important for multi-word natural language queries)
          'typo',            // Typo tolerance
          'proximity',       // Words close together (critical for natural language - "crime show" vs "show crime")
          'attribute',       // Field importance (title > description > synopsis) - description/synopsis get good weight
          'exactness',       // Exact phrase matches - prioritize phrases like "best-selling novel"
          'sort'             // Custom sorting
        ],
        // Enable better natural language query handling
        sortableAttributes: ['title']
      });
      console.log('✅ Search settings configured!\n');
    } catch (error) {
      console.log('⚠️  Could not configure settings (this is okay if they\'re already set)\n');
    }

    // Add documents
    console.log('📝 Adding sample shows...\n');
    const task = await index.addDocuments(sampleShows);
    
    // Wait a moment for indexing to start (Meilisearch indexes very quickly)
    console.log('⏳ Waiting for indexing to complete...\n');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check task status
    try {
      const taskStatus = await client.getTask(task.taskUid);
      if (taskStatus.status === 'succeeded') {
        console.log('✅ Documents indexed successfully!\n');
      } else {
        console.log(`⏳ Task status: ${taskStatus.status} (this is normal, indexing may take a moment)\n`);
      }
    } catch (error) {
      // If we can't check task status, that's okay - documents will still be indexed
      console.log('⏳ Documents are being indexed...\n');
    }
    
    console.log('✅ Setup complete!');
    console.log(`   Index: ${INDEX_NAME}`);
    console.log(`   Documents added: ${sampleShows.length}`);
    console.log(`   Data source: ${dataFile}`);
    console.log('\n🎉 You can now use the search feature in your app!');
    console.log('💡 Tip: Edit data/sample-shows.json to add or modify shows, then run this script again.\n');
    
  } catch (error) {
    console.error('❌ Error setting up Meilisearch:', error.message);
    if (error.message.includes('ECONNREFUSED')) {
      console.error('\n💡 Make sure Meilisearch is running:');
      console.error('   docker run -d -p 7700:7700 getmeili/meilisearch:latest');
    }
    process.exit(1);
  }
}

setupMeilisearch();

