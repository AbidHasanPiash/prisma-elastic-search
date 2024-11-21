import { NextResponse } from 'next/server';
import client from '@/utils/elasticsearch';

export async function GET(req) {
  try {
    // Use req.nextUrl.searchParams to get query parameters in Next.js 13+ app directory
    const searchQuery = req.nextUrl.searchParams.get('searchQuery');

    console.log('Received searchQuery:', searchQuery); // Log the searchQuery to verify it's being parsed

    // If searchQuery is not provided, return a 400 response
    if (!searchQuery) {
      return NextResponse.json({ message: 'Query parameter is required' }, { status: 400 });
    }

    // Elasticsearch search query
    const { body } = await client.search({
      index: 'stories',
      body: {
        query: {
          multi_match: {
            query: searchQuery,
            fields: ['title', 'content'],
          },
        },
      },
    });

    // Extracting the results from Elasticsearch response
    const results = body.hits.hits.map((hit) => hit._source);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
