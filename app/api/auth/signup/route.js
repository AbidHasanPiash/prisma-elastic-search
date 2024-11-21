import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { hashPassword } from '@/utils/auth';
import crypto from '@/utils/crypto';
import { createResponse } from '@/utils/api-response';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { email, password, name } = await req.json();

    // Validation check
    if (!email || !password) {
      return NextResponse.json(
        createResponse({
          message: 'Email and password are required',
          status: 400,
        })
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        createResponse({
          message: 'User already exists',
          status: 400,
        })
      );
    }

    // Decrypt password
    const decryptedPassword = crypto.decrypt(password);

    // Hash the password before saving
    const hashedPassword = await hashPassword(decryptedPassword);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    return NextResponse.json(
      createResponse({
        message: 'Signup successful',
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        status: 201,
      })
    );
  } catch (error) {
    console.error('Error signing up:', error);

    return NextResponse.json(
      createResponse({
        message: 'Internal Server Error',
        error: error.message,
        status: 500,
      })
    );
  }
}
