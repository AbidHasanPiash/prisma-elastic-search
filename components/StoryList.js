"use client";
import apiConfig from '@/configs/apiConfig';
import { fetchData } from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';
import Spinner from '@/components/common/Spinner';
import { Card } from '@/components/ui/card';

const StoryList = () => {

  const { isLoading, data, error } = useQuery({
    queryKey: ['stories'],
    queryFn: () => fetchData(apiConfig.GET_STORIES),
  });

  if (isLoading) {
    return <Spinner/>
  }

  return (
    <div className="p-4 space-y-4">
      {error && <p className="text-red-500 font-semibold">{`Error: ${error}`}</p> }
      <div className="space-y-4">
        {Array.isArray(data) && data?.map((story) => (
          <Card key={story.id} className="p-4">
            <h3 className="text-xl font-semibold">{story.title}</h3>
            <p>{story.content}</p>
            <p className="text-sm mt-2">Created At: {new Date(story.createdAt).toLocaleString()}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StoryList;
