# Natural Language Search Guide

## ✅ Yes! You Can Describe What You Want to Watch

Your Meilisearch setup **already supports natural language queries**! You can describe what you want to watch in plain English, and Meilisearch will find relevant shows.

## 🎯 How It Works Now

Your current setup uses **intelligent keyword matching** across multiple fields, which handles natural language queries very well:

### What's Enabled:
- ✅ **Multi-field search**: Searches across title, description, synopsis, category, and actors
- ✅ **Word proximity matching**: Understands when words appear close together (important for phrases)
- ✅ **Intelligent ranking**: Prioritizes results based on relevance
- ✅ **Typo tolerance**: Still works even with spelling mistakes
- ✅ **Context awareness**: Matches related concepts through keyword overlap

### Example Queries That Work:

Try these natural language descriptions:

1. **"a crime show with a detective"**
   - Will find: Harry Wild, Sister Boniface Mysteries, The Bill, etc.
   - Matches: "crime" + "detective" keywords in descriptions/synopses

2. **"something funny or comedic"**
   - Will find: Comedy shows
   - Matches: Keywords in category and descriptions

3. **"drama set in Italy"**
   - Will find: Hotel Portofino
   - Matches: "drama" + "Italy" keywords across multiple fields

4. **"show with Jane Seymour"**
   - Will find: Harry Wild
   - Matches: Actor name in the actors array

5. **"mystery solving show"**
   - Will find: Crime/mystery shows
   - Matches: Related keywords in synopsis/description

6. **"british police drama"**
   - Will find: The Bill, other British dramas
   - Matches: Multiple keywords across fields

## 🚀 Try It Now!

1. Start your app:
   ```powershell
   npm run dev
   ```

2. In the search box, try typing natural descriptions like:
   - "I want to watch a crime show"
   - "something with detectives"
   - "funny comedy series"
   - "drama about hotels"

## 🧠 How It Works (Technical Details)

### Current Approach: Intelligent Keyword Matching

Your search works by:
1. **Tokenization**: Breaks your query into words
2. **Multi-field search**: Searches across title, description, synopsis, category, actors
   - **Description and synopsis are heavily weighted** for natural language queries as they contain rich contextual information
3. **Proximity scoring**: Rewards results where query words appear close together (critical for phrases like "crime show")
4. **Attribute weighting**: Title matches rank highest, but description and synopsis matches are weighted heavily for natural language queries
5. **Ranking**: Combines all factors to show most relevant results first

### Example:
Query: **"crime show with detective"**

Meilisearch will:
- Find shows containing "crime" AND "detective" (or related words)
- Prioritize shows where these words appear close together
- Rank shows with "crime" in the title higher, but also heavily weight matches in description and synopsis
- Consider all fields: title, description, synopsis, category
- **Description and synopsis matches are particularly important** for natural language queries as they contain more contextual information that matches descriptive phrases

## 🎨 Enhanced Features Available

### Full Semantic Search (Optional Upgrade)

For even better natural language understanding, you can enable **semantic/vector search**:

**What it adds:**
- Understands **meaning**, not just keywords
- Example: "whodunit mystery" would match "detective show" even without shared keywords
- Better at understanding synonyms and related concepts
- More accurate for complex, descriptive queries

**How to enable:**
1. Requires an embedder (like OpenAI, Hugging Face, etc.)
2. Needs API key for the embedder service
3. Configure in Meilisearch settings

**Example with semantic search:**
- Query: "I want something suspenseful with plot twists"
- Would match shows described as "thrilling", "mysterious", "complex" even if those exact words aren't in your query

### Current Setup vs. Semantic Search

| Feature | Current Setup | With Semantic Search |
|---------|--------------|---------------------|
| Keyword matching | ✅ Excellent | ✅ Excellent |
| Phrase understanding | ✅ Good | ✅ Excellent |
| Synonym matching | ⚠️ Limited | ✅ Excellent |
| Meaning understanding | ⚠️ Limited | ✅ Excellent |
| Setup complexity | ✅ Simple | ⚠️ Requires API keys |
| Cost | ✅ Free | ⚠️ May have API costs |

## 💡 Tips for Best Results

### What Works Best Now:

1. **Include key terms**: "crime show" works better than just "crime"
2. **Use descriptive words**: "detective mystery" is better than "mystery"
3. **Combine concepts**: "british police drama" finds more specific results
4. **Use category words**: "comedy", "drama", "crime" are recognized

### Example Queries:

✅ **Good queries:**
- "crime show with detective"
- "british drama series"
- "mystery solving show"
- "comedy series"
- "show with [actor name]"

⚠️ **Less effective (but still works):**
- Very abstract: "something entertaining" (too vague)
- Single word: "funny" (works, but broader results)

## 🔧 Current Configuration

Your search is optimized for natural language queries:
- **Search across**: `title`, `description`, `synopsis`, `category`, `actors`
  - **Description and synopsis are weighted heavily** - these fields contain rich contextual information that matches natural language queries like "show about solving crimes" or "drama set in Italy"
- **Rank by**: word matches → typo tolerance → proximity → attribute importance
  - Proximity scoring is critical for natural language (e.g., "crime show" vs "show crime")
- **Highlight**: Matching terms in results (including description and synopsis)
- **Crop**: Long descriptions/synopses to show relevant snippets (300 characters for better context)

## 📊 Testing Your Natural Language Search

Try these queries to see how well it works:

1. **"I want to watch a show about solving crimes"**
   - Should find: Crime shows, detective shows

2. **"something set in Italy"**
   - Should find: Hotel Portofino

3. **"british police show"**
   - Should find: The Bill

4. **"mystery with a nun"**
   - Should find: Sister Boniface Mysteries

5. **"retired professor detective"**
   - Should find: Harry Wild

## 🎉 Summary

**Yes, you can write natural language descriptions!** Your current setup handles this very well through intelligent multi-field keyword matching with proximity scoring.

**What works:**
- ✅ Descriptive queries like "crime show with detective"
- ✅ Multi-word phrases
- ✅ Category-based searches
- ✅ Actor-based searches
- ✅ Combining multiple concepts

**For even better results:**
- Use specific keywords when possible
- Combine concepts (e.g., "british crime drama")
- Include category words (comedy, drama, crime)

**Want semantic search?**
- Requires embedder setup (OpenAI, Hugging Face, etc.)
- Better for abstract/conceptual queries
- See Meilisearch AI documentation for setup

Your search is ready to use! Just start typing natural language descriptions and see the magic happen! 🚀

