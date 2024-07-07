import { NextRequest, NextResponse } from 'next/server';
import bcypt from 'bcryptjs';
import prisma from '@/lib/db';
import { registerUserSchema } from '@/validation/registerUserSchema';

export async function POST(req: NextRequest) {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      dateOfBirth,
      showGender,
      usersGender,
      interestedInGender,
      about,
    } = await req.json();

    const validate = registerUserSchema.safeParse({
      email,
      password,
      firstName,
      lastName,
      dateOfBirth,
      showGender,
      usersGender,
      interestedInGender,
      about,
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

    const salt = await bcypt.genSalt(12);
    const hashedPassword = await bcypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        dateOfBirth: validate.data.dateOfBirth,
        showGender,
        usersGender,
        interestedInGender,
        about,
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
