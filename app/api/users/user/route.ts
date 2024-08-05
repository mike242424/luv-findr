import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth';
import { formatDateWithLeadingZeros } from '@/lib/utils';
import { authOptions } from '@/lib/authOptions';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession({ req, ...authOptions });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    const email = session?.user?.email!;

    let user;
    if (userId) {
      user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          email: true,
          firstName: true,
          lastName: true,
          dateOfBirth: true,
          usersGender: true,
          interestedInGender: true,
          about: true,
          profession: true,
          matches: true,
          profilePhoto: true,
        },
      });
    } else if (email) {
      user = await prisma.user.findUnique({
        where: { email },
        select: {
          email: true,
          firstName: true,
          lastName: true,
          dateOfBirth: true,
          usersGender: true,
          interestedInGender: true,
          about: true,
          profession: true,
          matches: true,
          profilePhoto: true,
        },
      });
    }

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

    await prisma.user.update({
      where: { email },
      data: {
        matches: updatedMatches,
      },
    });

    const matchedUser = await prisma.user.findUnique({
      where: { id: matchUserId },
      select: { matches: true },
    });

    if (matchedUser && matchedUser.matches.includes(currentUser.id)) {
      return NextResponse.json({ matchSuccess: true }, { status: 200 });
    }

    return NextResponse.json({ matchSuccess: false }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error.' },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
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

    const updatedMatches = currentUser.matches.filter(
      (id) => id !== matchUserId,
    );

    await prisma.user.update({
      where: { email },
      data: {
        matches: updatedMatches,
      },
    });

    return NextResponse.json({ unmatchSuccess: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error.' },
      { status: 500 },
    );
  }
}
