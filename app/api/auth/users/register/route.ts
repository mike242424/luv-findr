import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/db';
import { registerUserSchema } from '@/validation/registerUserSchema';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { updateUserSchema } from '@/validation/updateUserSchema';
import { formatDateWithLeadingZeros } from '@/lib/utils';

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
    return NextResponse.json(
      { error: 'Internal Server Error.' },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession({ req, ...authOptions });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const {
      firstName,
      lastName,
      dateOfBirth,
      usersGender,
      interestedInGender,
      about,
    } = await req.json();

    const validate = updateUserSchema.safeParse({
      firstName,
      lastName,
      dateOfBirth,
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

    const [month, day, year] = dateOfBirth.split('/');
    const formattedDateOfBirth = new Date(`${year}-${month}-${day}`);

    if (isNaN(formattedDateOfBirth.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format.' },
        { status: 400 },
      );
    }

    const email = session?.user?.email!;

    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        firstName,
        lastName,
        dateOfBirth: formattedDateOfBirth,
        usersGender,
        interestedInGender,
        about,
      },
    });

    return NextResponse.json({ updatedUser }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error.' },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession({ req, ...authOptions });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const email = session?.user?.email!;

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        email: true,
        firstName: true,
        lastName: true,
        dateOfBirth: true,
        usersGender: true,
        interestedInGender: true,
        about: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    const formattedUser = {
      ...user,
      dateOfBirth: user.dateOfBirth
        ? `${formatDateWithLeadingZeros(
            user.dateOfBirth.getMonth() + 1,
          )}/${formatDateWithLeadingZeros(
            user.dateOfBirth.getDate(),
          )}/${user.dateOfBirth.getFullYear()}`
        : '',
    };

    return NextResponse.json({ user: formattedUser }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Internal Server Error.' },
      { status: 500 },
    );
  }
}
