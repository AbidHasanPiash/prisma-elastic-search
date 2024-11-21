"use client";
import { useState } from 'react';

const StorySearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!query.trim()) {
      setResults([]);
      setError("Please enter a search query.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/stories/search?searchQuery=${query}`);
      if (!res.ok) {
        throw new Error('Failed to fetch results');
      }
      const data = await res.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search stories..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <button
          onClick={handleSearch}
          disabled={loading}
          className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-400"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <ul>
        {results.length > 0 ? (
          results.map((story, index) => (
            <li key={index} className="mb-4 p-4 border-b border-gray-200">
              <h3 className="font-semibold text-xl text-gray-800">{story.title}</h3>
              <p className="text-gray-600">{story.content}</p>
            </li>
          ))
        ) : (
          !loading && <p className="text-gray-600">No stories found.</p>
        )}
      </ul>
    </div>
  );
};

export default StorySearch;
