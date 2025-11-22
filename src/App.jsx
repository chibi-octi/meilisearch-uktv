import { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchSection from './components/SearchSection';
import PopularSearches from './components/PopularSearches';
import UsefulLinks from './components/UsefulLinks';
import Footer from './components/Footer';
import { searchShows, getAllShows } from './services/meilisearch';
import './App.css';

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Load popular shows on initial mount and configure index settings
  useEffect(() => {
    const initialize = async () => {
      try {
        // Configure Meilisearch settings for typo tolerance
        const { configureIndexSettings } = await import('./services/meilisearch');
        await configureIndexSettings();
      } catch (err) {
        console.error('Error configuring index settings:', err);
      }

      // Load popular shows
      try {
        setIsLoading(true);
        const results = await getAllShows({ limit: 12 });
        // Transform Meilisearch results to match our component format
        const formattedResults = results.results.map((doc) => ({
          title: doc.title || doc.name || 'Untitled',
          image: doc.image || doc.poster || doc.thumbnail || null,
          description: doc.description || doc.summary || '',
          category: doc.category || doc.genre || 'Unknown',
          episodeCount: doc.episodeCount || doc.episodes || 0,
        }));
        setSearchResults(formattedResults);
      } catch (err) {
        console.error('Error loading popular shows:', err);
        // If there's an error, we'll just use the default searches
        setError('Unable to load shows. Please check your Meilisearch connection.');
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      // Only reset if we've actually searched before
      if (hasSearched) {
        setHasSearched(false);
        // Reload popular shows if search is empty
        try {
          setIsLoading(true);
          const results = await getAllShows({ limit: 12 });
          const formattedResults = results.results.map((doc) => ({
            title: doc.title || doc.name || 'Untitled',
            image: doc.image || doc.poster || doc.thumbnail || null,
            description: doc.description || doc.summary || '',
            category: doc.category || doc.genre || 'Unknown',
            episodeCount: doc.episodeCount || doc.episodes || 0,
          }));
          setSearchResults(formattedResults);
        } catch (err) {
          console.error('Error loading shows:', err);
        } finally {
          setIsLoading(false);
        }
      }
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setHasSearched(true);
      
      const results = await searchShows(query, { limit: 20 });
      
      // Transform Meilisearch results to match our component format
      const formattedResults = results.hits.map((hit) => ({
        title: hit.title || hit.name || 'Untitled',
        image: hit.image || hit.poster || hit.thumbnail || null,
        description: hit.description || hit.summary || '',
        category: hit.category || hit.genre || 'Unknown',
        episodeCount: hit.episodeCount || hit.episodes || 0,
      }));
      
      setSearchResults(formattedResults);
    } catch (err) {
      console.error('Search error:', err);
      setError('Search failed. Please check your Meilisearch connection.');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <SearchSection onSearch={handleSearch} />
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      )}
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          </div>
        )}
        <PopularSearches searches={searchResults} hasSearched={hasSearched} isLoading={isLoading} />
      </div>
      <UsefulLinks />
      <Footer />
    </div>
  );
}

export default App;
