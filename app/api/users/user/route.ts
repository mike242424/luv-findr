import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { formatDateWithLeadingZeros } from '@/lib/utils';

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
        matches: true,
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
            user.dateOfBirth.getDate() + 1,
          )}/${user.dateOfBirth.getFullYear()}`
        : '',
    };

    return NextResponse.json({ user: formattedUser }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error.' },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession({ req, ...authOptions });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const email = session?.user?.email!;
    const { matchUserId } = await req.json();

    const currentUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    const updatedMatches = [...currentUser.matches, matchUserId];

    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        matches: updatedMatches,
      },
    });

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal Server Error.' },
      { status: 500 },
    );
  }
}
