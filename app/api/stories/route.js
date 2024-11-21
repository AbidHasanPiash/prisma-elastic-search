import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import client from '@/utils/elasticsearch';

const prisma = new PrismaClient();

// Create story API route
export async function POST(req) {
    try {
        // Parse the request body
        const { title, content } = await req.json();

        if (!title || !content) {
            return NextResponse.json({ message: 'Title and content are required' }, { status: 400 });
        }

        // Save the story to the database
        const story = await prisma.story.create({
            data: { title, content },
        });

        console.log('Story saved to database:', story);

        // Index the story in Elasticsearch
        // try {
        //     await client.index({
        //         index: 'stories',
        //         id: `${story.id}`, // Convert integer ID to string
        //         body: {
        //             title: story.title,
        //             content: story.content,
        //             createdAt: story.createdAt,
        //         },
        //     });
        //     console.log('Story indexed successfully in Elasticsearch');
        // } catch (elasticError) {
        //     console.error('Elasticsearch indexing error:', elasticError);
        // }

        return NextResponse.json(story, { status: 201 });
    } catch (error) {
        console.error('Error creating story:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

// Fetch stories API route
export async function GET(req) {
    try {
        // Parse the query parameters
        const { query = '' } = req.nextUrl.searchParams; // Get query parameter from URL

        // 1. Fetch stories from the database
        const storiesFromDb = await prisma.story.findMany();

        let storiesFromSearch = [];
        // If there's a query parameter, search in Elasticsearch
        if (query) {
            const { body } = await client.search({
                index: 'stories', // Elasticsearch index
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
            storiesFromSearch = body.hits.hits.map((hit) => ({
                id: hit._id,
                title: hit._source.title,
                content: hit._source.content,
                createdAt: hit._source.createdAt,
            }));
        }

        // If a search query was provided, return Elasticsearch results; otherwise, return all stories from the database
        const responseStories = query ? storiesFromSearch : storiesFromDb;

        return NextResponse.json(responseStories, { status: 200 });
    } catch (error) {
        console.error('Error fetching stories:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
