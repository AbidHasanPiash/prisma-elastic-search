import StoryForm from "@/components/StoryForm";
import StoryList from "@/components/StoryList";
import StorySearch from "@/components/StorySearch";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Story Sharing Platform
        </h1>
        
        {/* Story Form Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Share Your Story</h2>
          <StoryForm />
        </div>

        {/* Story Search Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Search Stories</h2>
          <StorySearch />
        </div>

        {/* Story List Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">All Stories</h2>
          <StoryList />
        </div>
      </div>
    </div>
  );
}
