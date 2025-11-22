import React from 'react';

const SearchCard = ({ title, image, description, category, episodeCount }) => {
  return (
    <div className="group cursor-pointer">
      <div className="relative overflow-hidden rounded-lg bg-gray-200 aspect-[2/3] mb-3 flex items-center justify-center">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
            <span className="text-gray-500 text-xs font-medium px-2 text-center line-clamp-2">{title}</span>
          </div>
        )}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
        {title}
      </h3>
    </div>
  );
};

export default SearchCard;

