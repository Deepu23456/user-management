// src/Shimmer.js
import React from 'react';

const ShimmerEffect = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="bg-gray-800 p-4 rounded shadow-lg animate-pulse flex flex-col justify-between"
        >
          <div className="h-6 bg-gray-700 rounded mb-4"></div>
          <div className="h-4 bg-gray-700 rounded mb-2"></div>
          <div className="h-4 bg-gray-700 rounded mb-2"></div>
          <div className="h-4 bg-gray-700 rounded"></div>
        </div>
      ))}
    </div>
  );
};

export default ShimmerEffect;
