# Meilisearch AI Features & API Keys Guide

## ✅ Your Data is Already Added!

Great news! Your JSON data from `data/sample-shows.json` has been successfully added to Meilisearch. The search feature is now fully functional and using Meilisearch's AI-powered search capabilities.

## 🔑 API Keys - Do You Need Them?

### **Short Answer: NO, not for local development!**

For local development (running Meilisearch on your machine), **API keys are NOT required**. Your current setup works perfectly without them.

### When Do You Need API Keys?

API keys are only needed if:

1. **Production/Cloud Deployment**: If you're using Meilisearch Cloud or a production instance with authentication enabled
2. **Secured Instance**: If you've manually configured Meilisearch with a master key for security
3. **Team/Shared Instance**: If multiple people need access with different permission levels

### How to Use API Keys (If Needed)

If you do need to set up API keys:

1. **Start Meilisearch with a master key**:
   ```powershell
   .\meilisearch.exe --master-key="your-master-key-here-min-16-chars"
   ```

2. **Get your API keys**:
   ```powershell
   curl http://127.0.0.1:7700/keys -H "Authorization: Bearer your-master-key"
   ```

3. **Add to your `.env` file**:
   ```env
   VITE_MEILISEARCH_HOST=http://127.0.0.1:7700
   VITE_MEILISEARCH_INDEX=shows
   VITE_MEILISEARCH_API_KEY=your-search-api-key-here
   ```

**Note**: The code already handles API keys gracefully - if you don't provide one, it will work without authentication (perfect for local development).

## 🤖 AI Features Enabled

Your Meilisearch instance is now configured with several AI-powered features:

### 1. **Intelligent Typo Tolerance** ✅
- Automatically corrects typos in search queries
- Words with 4+ characters can have 1 typo
- Words with 8+ characters can have 2 typos
- **Example**: Searching "hotel portofino" will find "Hotel Portofino" even with typos

### 2. **Smart Ranking** ✅
- Prioritizes exact matches
- Considers word proximity
- Attributes-based ranking (title matches rank higher than description matches)
- **Example**: Searching "crime" will show crime shows first, ranked by relevance

### 3. **Multi-Attribute Search** ✅
- Searches across multiple fields simultaneously:
  - `title` - Show titles
  - `description` - Show descriptions
  - `synopsis` - Detailed synopses
  - `category` - Show categories
  - `actors` - Actor names
- **Example**: Searching "Jane Seymour" will find shows where she's an actor

### 4. **Result Highlighting** ✅
- Automatically highlights matching terms in results
- Makes it easy to see why results matched your query

### 5. **Intelligent Snippets** ✅
- Automatically crops long descriptions to show relevant snippets
- Focuses on the most relevant parts of the content

## 🔍 How Search Works Through Meilisearch

Your app is **already configured** to use Meilisearch! Here's how it works:

1. **User types a search query** → `SearchSection` component
2. **Query sent to Meilisearch** → `searchShows()` function in `src/services/meilisearch.js`
3. **Meilisearch processes with AI** → Typo tolerance, ranking, multi-attribute search
4. **Results returned** → Formatted and displayed in `PopularSearches` component

### Current Search Flow:

```
User Input → App.jsx (handleSearch) 
           → meilisearch.js (searchShows) 
           → Meilisearch Server (AI processing)
           → Results → App.jsx → PopularSearches Component
```

## 🚀 Testing Your Setup

1. **Start your app**:
   ```powershell
   npm run dev
   ```

2. **Try these searches** to see AI features in action:
   - `"crime"` - Should find all crime shows
   - `"jane seymour"` - Should find shows with this actor
   - `"hotel portofino"` (with typos like "hotel portofino") - Should still find it
   - `"drama"` - Should find drama shows, ranked by relevance

## 📊 Advanced AI Features (Available in Meilisearch Cloud)

For even more AI power, Meilisearch Cloud offers:

- **Semantic Search**: Understands meaning, not just keywords
- **Vector Search**: Uses embeddings for similarity matching
- **Auto-complete**: Intelligent query suggestions
- **Faceted Search**: Filter by categories, actors, etc.

To enable these, you'd need:
- Meilisearch Cloud account, OR
- Self-hosted instance with embedding models configured

## 🛠️ Troubleshooting

### Search Not Working?

1. **Check Meilisearch is running**:
   ```powershell
   curl http://127.0.0.1:7700/health
   ```
   Should return: `{"status":"available"}`

2. **Verify data is indexed**:
   ```powershell
   curl http://127.0.0.1:7700/indexes/shows/stats
   ```
   Should show document count

3. **Re-run setup**:
   ```powershell
   npm run setup-meilisearch
   ```

### Connection Errors?

- Make sure Meilisearch is running on port 7700
- Check firewall settings
- Verify `VITE_MEILISEARCH_HOST` in `.env` (if using)

## 📝 Summary

✅ **Data Added**: Your JSON data is in Meilisearch  
✅ **API Keys**: Not needed for local development  
✅ **AI Features**: Typo tolerance, smart ranking, multi-attribute search enabled  
✅ **Search Working**: Your app is already using Meilisearch  

You're all set! Just run `npm run dev` and start searching! 🎉

