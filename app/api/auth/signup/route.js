import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { hashPassword } from '@/utils/auth';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    // Hash the password before saving
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('Error signing up:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
