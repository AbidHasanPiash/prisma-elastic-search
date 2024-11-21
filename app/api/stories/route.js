import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { verifyJWT } from '@/utils/auth';
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

export async function POST(req) {
    try {
      // Get the token from the Authorization header
      const token = req.headers.get('Authorization')?.split(' ')[1];
  
      if (!token) {
        return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
      }
  
      const decoded = verifyJWT(token);
  
      if (!decoded) {
        return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
      }
  
      // Parse the request body
      const { title, content } = await req.json();
  
      if (!title || !content) {
        return NextResponse.json({ message: 'Title and content are required' }, { status: 400 });
      }
  
      // Save the story to the database
      const story = await prisma.story.create({
        data: { title, content, userId: decoded.userId },
      });
  
      // Index the story in Elasticsearch asynchronously
      indexStoryInElasticsearch(story);
  
      return NextResponse.json(story, { status: 201 });
    } catch (error) {
      console.error('Error creating story:', error);
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
  }
  
  export async function GET(req) {
    try {
      // Parse the query parameters and token
      const token = req.headers.get('Authorization')?.split(' ')[1];
      const decoded = token ? verifyJWT(token) : null;
  
      // Fetch stories based on user authentication
      const { query = '', page = 1, pageSize = 10 } = req.nextUrl.searchParams;
  
      const stories = await prisma.story.findMany({
        where: decoded ? { userId: decoded.userId } : {},
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      });
  
      return NextResponse.json(stories, { status: 200 });
    } catch (error) {
      console.error('Error fetching stories:', error);
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
  }