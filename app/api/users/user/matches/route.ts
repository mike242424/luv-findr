import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

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
        matches: true,
      },
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    const matchedUserIds = currentUser.matches;

    const matches = await prisma.user.findMany({
      where: {
        id: { in: matchedUserIds },
        matches: { has: currentUser.id },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        profilePhoto: true,
        profession: true,
        about: true,
        dateOfBirth: true,
      },
    });

    return NextResponse.json({ matchedUsers: matches }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error.' },
      { status: 500 },
    );
  }
}
