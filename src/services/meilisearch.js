import { MeiliSearch } from 'meilisearch';

// Initialize Meilisearch client
// Update these values with your Meilisearch instance details
const client = new MeiliSearch({
  host: import.meta.env.VITE_MEILISEARCH_HOST || 'http://127.0.0.1:7700',
  apiKey: import.meta.env.VITE_MEILISEARCH_API_KEY || undefined, // Optional: only needed if your instance requires an API key
});

// Index name - update this to match your Meilisearch index
const INDEX_NAME = import.meta.env.VITE_MEILISEARCH_INDEX || 'shows';

/**
 * Configure Meilisearch index settings for typo tolerance
 * This function should be called once to set up the index
 */
export const configureIndexSettings = async () => {
  try {
    const index = client.index(INDEX_NAME);
    
    // Configure typo tolerance - Meilisearch handles typos by default, but we can make it more lenient
    await index.updateSettings({
      typoTolerance: {
        enabled: true,
        minWordSizeForTypos: {
          oneTypo: 4,  // Words with 4+ characters can have 1 typo
          twoTypos: 8  // Words with 8+ characters can have 2 typos
        },
        disableOnWords: [], // Don't disable typo tolerance on any words
        disableOnAttributes: [] // Don't disable typo tolerance on any attributes
      },
      // Make searchable attributes include title, description, synopsis, category, and actors for better AI matching
      // For natural language queries, description and synopsis are weighted more heavily as they contain richer contextual information
      searchableAttributes: [
        'title',           // Exact title matches are still most important
        'description',    // Rich contextual descriptions help with natural language queries
        'synopsis',        // Detailed synopses provide more matching opportunities for descriptive queries
        'category',        // Category helps with genre-based queries
        'actors'           // Actor names for cast-based searches
      ],
      // Ranking rules optimized for natural language queries
      // Prioritizes exact phrase matches, then word matches, then proximity
      rankingRules: [
        'words',           // Number of matching words (important for multi-word natural language queries)
        'typo',            // Typo tolerance
        'proximity',       // Words close together (critical for natural language - "crime show" vs "show crime")
        'attribute',       // Field importance (title > description > synopsis) - description/synopsis get good weight
        'exactness',       // Exact phrase matches - moved up to prioritize phrases like "best-selling novel"
        'sort'             // Custom sorting
      ],
      // Boost title matches for better relevance
      sortableAttributes: ['title']
    });
  } catch (error) {
    console.error('Error configuring index settings:', error);
    // Don't throw - settings might already be configured
  }
};

/**
 * Search function that queries Meilisearch with AI-powered features
 * @param {string} query - The search query
 * @param {object} options - Additional search options (limit, offset, filters, etc.)
 * @returns {Promise<object>} Search results
 */
export const searchShows = async (query, options = {}) => {
  try {
    const index = client.index(INDEX_NAME);
    
    const searchOptions = {
      limit: options.limit || 20,
      offset: options.offset || 0,
      // Attributes to search in - optimized for natural language queries
      // Description and synopsis are crucial for understanding natural language queries like
      // "show about solving crimes" or "drama set in Italy"
      // Order matters: earlier attributes are weighted more heavily
      attributesToSearchOn: ['title', 'description', 'synopsis', 'category', 'actors'],
      // Show matches and ranking details for better result highlighting
      showMatchesPosition: true,
      // Enable highlighting for better UX - highlight matches in description and synopsis
      highlightPreTag: '<mark>',
      highlightPostTag: '</mark>',
      // Attributes to highlight - include description and synopsis to show where matches occurred
      attributesToHighlight: ['title', 'description', 'synopsis', 'category'],
      // Enable crop for better snippet generation - increased length for natural language queries
      // Longer snippets help users see why a result matched their natural language query
      cropLength: options.cropLength || 300, // Increased from 250 to show more context
      attributesToCrop: ['description', 'synopsis'], // Crop these fields to show relevant snippets
      // Filter support for advanced queries
      filter: options.filter || undefined,
      // Facet support for filtering
      facets: options.facets || undefined,
      ...options,
    };

    const results = await index.search(query, searchOptions);
    return results;
  } catch (error) {
    console.error('Meilisearch error:', error);
    throw error;
  }
};

/**
 * Get all documents from the index (for popular searches or initial load)
 * @param {object} options - Query options (limit, offset, etc.)
 * @returns {Promise<object>} Documents
 */
export const getAllShows = async (options = {}) => {
  try {
    const index = client.index(INDEX_NAME);
    
    const queryOptions = {
      limit: options.limit || 20,
      offset: options.offset || 0,
    };

    const results = await index.getDocuments(queryOptions);
    return results;
  } catch (error) {
    console.error('Meilisearch error:', error);
    throw error;
  }
};

/**
 * Get a specific document by ID
 * @param {string} id - Document ID
 * @returns {Promise<object>} Document
 */
export const getShowById = async (id) => {
  try {
    const index = client.index(INDEX_NAME);
    const document = await index.getDocument(id);
    return document;
  } catch (error) {
    console.error('Meilisearch error:', error);
    throw error;
  }
};

export default client;

