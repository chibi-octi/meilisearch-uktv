# Sample Data

This directory contains sample data files for testing Meilisearch.

## Files

- `sample-shows.json` - Sample TV shows data matching the U.co.uk format

## Using Custom Data

You can use your own JSON file by passing it as an argument to the setup script:

```bash
npm run setup-meilisearch path/to/your/data.json
```

Or directly:

```bash
node scripts/setup-meilisearch.js path/to/your/data.json
```

## JSON Format

Your JSON file should be an array of objects. Each object should have:

- `id` (required) - Unique identifier for the show
- `title` (recommended) - Show title
- `description` (recommended) - Show description
- `category` (optional) - Show category/genre
- `episodeCount` (optional) - Number of episodes

Example:

```json
[
  {
    "id": "1",
    "title": "Show Title",
    "description": "Show description here",
    "category": "Drama",
    "episodeCount": 10
  }
]
```

## Updating Data

1. Edit `sample-shows.json` (or your custom file)
2. Run the setup script: `npm run setup-meilisearch`
3. The data will be updated in Meilisearch

Note: Running the setup script will replace all existing data in the index with the data from the JSON file.

