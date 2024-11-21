import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { verifyPassword, generateJWT } from '@/utils/auth';
import crypto from '@/utils/crypto';
import { createResponse } from '@/utils/api-response';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        createResponse({
          message: 'Email and password are required',
          status: 400,
        })
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        createResponse({
          message: 'Invalid email or password',
          status: 400,
        })
      );
    }

    // Decrypt password
    const decryptedPassword = crypto.decrypt(password);

    // Verify the password
    const isValid = await verifyPassword(decryptedPassword, user.password);

    if (!isValid) {
      return NextResponse.json(
        createResponse({
          message: 'Invalid email or password',
          status: 400,
        })
      );
    }

    // Generate JWT token
    const token = generateJWT(user);

    return NextResponse.json(
      createResponse({
        message: 'Login successful',
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
          },
        },
        status: 200,
      })
    );
  } catch (error) {
    console.error('Error logging in:', error);

    return NextResponse.json(
      createResponse({
        message: 'Internal Server Error',
        error: error.message,
        status: 500,
      })
    );
  }
}
