# Quick Start Guide - Meilisearch Setup

## 🚀 Quick Setup (3 Steps)

### Step 1: Start Meilisearch

**Using Docker (easiest):**
```bash
docker run -d --name meilisearch -p 7700:7700 getmeili/meilisearch:latest
```

**Or download and run:**
- Download from: https://github.com/meilisearch/meilisearch/releases
- Run: `./meilisearch`

### Step 2: Verify Meilisearch is Running

Open in browser: http://127.0.0.1:7700

You should see Meilisearch's welcome page.

### Step 3: Create Index and Add Sample Data

Run this command:
```bash
npm run setup-meilisearch
```

This will load data from `data/sample-shows.json` into Meilisearch.

**💡 Tip:** You can edit `data/sample-shows.json` to add your own shows, then run the setup script again to update Meilisearch.

That's it! 🎉 Your app should now work.

## 🔍 Verify It's Working

1. Start your app: `npm run dev`
2. The "Popular Searches" section should load automatically
3. Try searching for "crime" or "drama"

## ❌ Troubleshooting

**"Unable to load shows" error:**
- Make sure Meilisearch is running: Check http://127.0.0.1:7700
- Run the setup script: `npm run setup-meilisearch`

**Connection refused:**
- Start Meilisearch: `docker run -d -p 7700:7700 getmeili/meilisearch:latest`
- Or check if port 7700 is already in use

**Index not found:**
- Run: `npm run setup-meilisearch`

**Using your own data:**
- Edit `data/sample-shows.json` with your shows
- Or use a custom file: `npm run setup-meilisearch path/to/your/data.json`

## 📝 Need More Help?

See `MEILISEARCH_SETUP.md` for detailed instructions.

