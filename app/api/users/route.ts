import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { updateUserSchema } from '@/validation/updateUserSchema';

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

    const currentUser = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        usersGender: true,
        interestedInGender: true,
        matches: true,
      },
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    const matchedUserIds = currentUser.matches;

    const allUsers = await prisma.user.findMany({
      where: {
        AND: [
          { email: { not: email } }, // Exclude current user
          { id: { notIn: matchedUserIds.concat(currentUser.id) } }, // Exclude matched users and current user
          { firstName: { not: null } },
          { lastName: { not: null } },
          { dateOfBirth: { not: null } },
          { usersGender: { not: null } },
          { interestedInGender: { not: null } },
          { about: { not: null } },
          { usersGender: currentUser.interestedInGender },
          { interestedInGender: currentUser.usersGender },
        ],
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        dateOfBirth: true,
        about: true,
      },
    });

    return NextResponse.json({ allUsers }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error.' },
      { status: 500 },
    );
  }
}
