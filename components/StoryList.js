"use client";
import { useEffect, useState } from 'react';

const StoryList = () => {
  const [stories, setStories] = useState([]);
  const [error, setError] = useState(null);  // State for error handling

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await fetch('/api/stories');
        if (!res.ok) {
          throw new Error('Failed to fetch stories');
        }
        const data = await res.json();

        // Check if the data is an array
        if (Array.isArray(data)) {
          setStories(data);
        } else {
          throw new Error('Data is not in the expected format (array)');
        }
      } catch (err) {
        setError(err.message);  // Set error message if there's an issue
      }
    };

    fetchStories();
  }, []);

  return (
    <div className="p-4 space-y-4">
      {error ? (
        <p className="text-red-500 font-semibold">{`Error: ${error}`}</p>  // Display error message
      ) : (
        <ul className="space-y-4">
          {Array.isArray(stories) && stories?.map((story) => (
            <li key={story.id} className="p-4 border rounded-lg shadow-md hover:bg-gray-50 transition-colors">
              <h3 className="text-xl font-semibold text-gray-800">{story.title}</h3>
              <p className="text-gray-600">{story.content}</p>
              <p className="text-sm text-gray-500 mt-2">Created At: {new Date(story.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StoryList;
