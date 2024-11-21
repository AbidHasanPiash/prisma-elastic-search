import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { verifyJWT } from '@/utils/auth';
import client from '@/utils/elasticsearch';
import { createResponse } from '@/utils/api-response';

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

export async function POST(req) {
  try {
    // Get the token from the Authorization header
    const token = req.headers.get('Authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json(
        createResponse({
          message: 'Authentication required',
          status: 401,
        })
      );
    }

    const decoded = verifyJWT(token);

    if (!decoded) {
      return NextResponse.json(
        createResponse({
          message: 'Invalid or expired token',
          status: 401,
        })
      );
    }

    // Parse the request body
    const { title, content } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        createResponse({
          message: 'Title and content are required',
          status: 400,
        })
      );
    }

    // Save the story to the database
    const story = await prisma.story.create({
      data: { title, content, userId: decoded.userId },
    });

    // Index the story in Elasticsearch asynchronously
    indexStoryInElasticsearch(story);

    return NextResponse.json(
      createResponse({
        message: 'Story created successfully',
        data: story,
        status: 201,
      })
    );
  } catch (error) {
    console.error('Error creating story:', error);
    return NextResponse.json(
      createResponse({
        message: 'Internal Server Error',
        error: error.message,
        status: 500,
      })
    );
  }
}

export async function GET(req) {
  try {
    // Parse the query parameters and token
    const token = req.headers.get('Authorization')?.split(' ')[1];
    const decoded = token ? verifyJWT(token) : null;

    const { query = '', page = 1, pageSize = 10 } = Object.fromEntries(
      req.nextUrl.searchParams
    );

    const stories = await prisma.story.findMany({
      where: decoded ? { userId: decoded.userId } : {},
      skip: (page - 1) * pageSize,
      take: parseInt(pageSize),
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(
      createResponse({
        message: 'Stories fetched successfully',
        data: stories,
        status: 200,
      })
    );
  } catch (error) {
    console.error('Error fetching stories:', error);
    return NextResponse.json(
      createResponse({
        message: 'Internal Server Error',
        error: error.message,
        status: 500,
      })
    );
  }
}
