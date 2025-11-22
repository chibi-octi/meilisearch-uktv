# Meilisearch Setup Guide

This guide will help you set up Meilisearch for the search feature.

## Step 1: Install and Run Meilisearch

### Option A: Using Docker (Recommended)

```bash
docker run -d \
  --name meilisearch \
  -p 7700:7700 \
  -v $(pwd)/meili_data:/meili_data \
  getmeili/meilisearch:latest
```

### Option B: Using Homebrew (macOS)

```bash
brew update && brew install meilisearch
meilisearch
```

### Option C: Using cURL (Linux/macOS)

```bash
curl -L https://install.meilisearch.com | sh
./meilisearch
```

### Option D: Download Binary

Download from [Meilisearch releases](https://github.com/meilisearch/meilisearch/releases) and run:
```bash
./meilisearch
```

## Step 2: Verify Meilisearch is Running

Open your browser and go to: http://127.0.0.1:7700

You should see Meilisearch's welcome page or API documentation.

## Step 3: Create Index and Add Sample Data

Run the setup script:

```bash
npm run setup-meilisearch
```

Or manually use the provided script:

```bash
node scripts/setup-meilisearch.js
```

## Step 4: Configure Environment Variables (Optional)

Create a `.env` file in the project root:

```env
VITE_MEILISEARCH_HOST=http://127.0.0.1:7700
VITE_MEILISEARCH_INDEX=shows
VITE_MEILISEARCH_API_KEY=  # Leave empty if no auth required
```

## Step 5: Test the Connection

Start your development server:

```bash
npm run dev
```

The app should now connect to Meilisearch and load shows automatically.

## Troubleshooting

### Connection Refused Error
- Make sure Meilisearch is running on port 7700
- Check if another service is using port 7700
- Verify the host URL in your `.env` file

### Index Not Found Error
- Run the setup script to create the index and add sample data
- Check that the index name matches `VITE_MEILISEARCH_INDEX` in your `.env`

### CORS Errors
- Meilisearch allows CORS by default in development
- If using a remote instance, ensure CORS is configured

## Manual Setup via API

If you prefer to set up manually, you can use curl:

### 1. Create the index:
```bash
curl -X POST 'http://127.0.0.1:7700/indexes' \
  -H 'Content-Type: application/json' \
  --data-binary '{
    "uid": "shows",
    "primaryKey": "id"
  }'
```

### 2. Add documents:
```bash
curl -X POST 'http://127.0.0.1:7700/indexes/shows/documents' \
  -H 'Content-Type: application/json' \
  --data-binary @scripts/sample-data.json
```

