import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/db';
import { registerUserSchema } from '@/validation/registerUserSchema';

export async function POST(req: NextRequest) {
  try {
    const { email, password, confirmPassword } = await req.json();

    const validate = registerUserSchema.safeParse({
      email,
      password,
      confirmPassword,
    });

    if (!validate.success) {
      return NextResponse.json(
        { error: validate.error.errors[0].message },
        { status: 400 },
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already in use.' },
        { status: 409 },
      );
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName: null,
        lastName: null,
        dateOfBirth: null,
        usersGender: null,
        interestedInGender: null,
        about: null,
        matches: [],
      },
    });

    return NextResponse.json({ newUser }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Internal Server Error.' },
      { status: 500 },
    );
  }
}
