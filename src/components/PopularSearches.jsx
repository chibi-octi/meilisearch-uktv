import React from 'react';
import SearchCard from './SearchCard';

const PopularSearches = ({ searches = [], hasSearched = false, isLoading = false }) => {
  const defaultSearches = [
    {
      title: 'Hotel Portofino',
      description: 'Drama series following a woman who moves to the Italian Riviera in the 1920s to set up a British hotel.',
      category: 'Drama',
      episodeCount: 18
    },
    {
      title: 'The Bill',
      description: 'Drama with the bobbies and detectives of Sun Hill.',
      category: 'Drama',
      episodeCount: 2389
    },
    {
      title: 'Harry Wild',
      description: 'A retired English professor (Jane Seymour) interferes with the cases assigned to her police detective son.',
      category: 'Crime',
      episodeCount: 20
    },
    {
      title: 'Sister Boniface Mysteries',
      description: 'Sister Boniface - nun, moped rider, wine maker - and part-time forensic scientist.',
      category: 'Crime',
      episodeCount: 36
    },
    {
      title: 'The Good Fight',
      description: 'Spin-off of legal drama The Good Wife, following Diane Lockhart (Christine Baranski).',
      category: 'Legal Drama',
      episodeCount: 60
    },
    {
      title: 'Classic EastEnders',
      description: "Look back on the early days of Britain's favourite soap.",
      category: 'Soap',
      episodeCount: 458
    },
    {
      title: 'Art Detectives',
      description: 'Crime drama set in the art world, starring Stephen Moyer.',
      category: 'Crime',
      episodeCount: 6
    },
    {
      title: 'Elementary',
      description: 'Modern-day Sherlock Holmes adventure following the troubled sleuth as he works as a consultant for the NYPD.',
      category: 'Crime',
      episodeCount: 154
    },
    {
      title: 'Bangers & Cash: Restoring Classics',
      description: 'Bangers & Cash spin-off series.',
      category: 'Documentary',
      episodeCount: 42
    },
    {
      title: 'Robson Green: World\'s Most Amazing Walks',
      description: 'Robson Green walks some of the world\'s most awe-inspiring trails.',
      category: 'Documentary',
      episodeCount: 8
    },
    {
      title: 'Parks and Recreation',
      description: 'Comedy series about a mid-level bureaucrat in the parks department of a town in Indiana.',
      category: 'Comedy',
      episodeCount: 125
    },
    {
      title: 'The Chelsea Detective',
      description: 'Crime drama set in London\'s wealthy and beautiful Chelsea neighbourhood.',
      category: 'Crime',
      episodeCount: 16
    }
  ];

  const displaySearches = searches.length > 0 ? searches : defaultSearches;
  const sectionTitle = hasSearched 
    ? `Search Results (${searches.length} found)`
    : 'Popular Searches';

  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">{sectionTitle}</h2>
        {displaySearches.length === 0 && hasSearched ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No results found. Try a different search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {displaySearches.map((search, index) => (
              <SearchCard
                key={search.id || `${search.title}-${index}`}
                title={search.title}
                image={search.image}
                description={search.description}
                category={search.category}
                episodeCount={search.episodeCount}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularSearches;

