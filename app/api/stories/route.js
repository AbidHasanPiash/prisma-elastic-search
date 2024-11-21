import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import client from '@/utils/elasticsearch';

const prisma = new PrismaClient();

// Helper function to handle Elasticsearch indexing in the background
async function indexStoryInElasticsearch(story) {
    try {
        await client.index({
            index: 'stories',
            id: `${story.id}`,
            body: {
                title: story.title,
                content: story.content,
                createdAt: story.createdAt,
            },
        });
        console.log('Story indexed successfully in Elasticsearch');
    } catch (elasticError) {
        console.error('Elasticsearch indexing error:', elasticError);
    }
}

// Create story API route
export async function POST(req) {
    try {
        // Parse the request body
        const { title, content } = await req.json();

        // Validate input
        if (!title || !content) {
            return NextResponse.json({ message: 'Title and content are required' }, { status: 400 });
        }

        // Save the story to the database
        const story = await prisma.story.create({
            data: { title, content },
        });

        console.log('Story saved to database:', story);

        // Index the story in Elasticsearch asynchronously
        indexStoryInElasticsearch(story);

        // Return the saved story
        return NextResponse.json(story, { status: 201 });
    } catch (error) {
        console.error('Error creating story:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

// Fetch stories API route with pagination and search
export async function GET(req) {
    try {
        // Parse the query parameters (with pagination support)
        const { query = '', page = 1, pageSize = 10 } = req.nextUrl.searchParams;

        // If there is a search query, perform an Elasticsearch search
        if (query) {
            const { body } = await client.search({
                index: 'stories',
                from: (page - 1) * pageSize, // Calculate pagination
                size: pageSize, // Limit the number of results per page
                body: {
                    query: {
                        multi_match: {
                            query,
                            fields: ['title', 'content'], // Search in title and content fields
                        },
                    },
                },
            });

            // Map Elasticsearch results to the response format
            const storiesFromSearch = body.hits.hits.map((hit) => ({
                id: hit._id,
                title: hit._source.title,
                content: hit._source.content,
                createdAt: hit._source.createdAt,
            }));

            return NextResponse.json(storiesFromSearch, { status: 200 });
        } else {
            // If there's no search query, return a paginated list from the database
            const storiesFromDb = await prisma.story.findMany({
                skip: (page - 1) * pageSize, // Pagination
                take: pageSize, // Limit number of stories per page
                orderBy: {
                    createdAt: 'desc', // Optional: Order by creation date (latest first)
                },
            });

            return NextResponse.json(storiesFromDb, { status: 200 });
        }
    } catch (error) {
        console.error('Error fetching stories:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
