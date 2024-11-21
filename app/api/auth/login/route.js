import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { verifyPassword, generateJWT } from '@/utils/auth';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 400 });
    }

    // Verify the password
    const isValid = await verifyPassword(password, user.password);

    if (!isValid) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 400 });
    }

    // Generate JWT token
    const token = generateJWT(user);

    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    console.error('Error logging in:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
