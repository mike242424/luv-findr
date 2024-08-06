import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/db';
import { authOptions } from '@/lib/authOptions';

export async function GET(
  req: NextRequest,
  { params }: { params: { matchId: string } },
) {
  const { matchId } = params;

  const session = await getServerSession({ req, ...authOptions });
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const email = session?.user?.email!;

  const currentUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true, matches: true },
  });

  if (!currentUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  if (!currentUser.matches.includes(matchId)) {
    return NextResponse.json(
      { error: 'Not authorized to view these messages' },
      { status: 403 },
    );
  }

  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { from: currentUser.id, to: matchId },
          { from: matchId, to: currentUser.id },
        ],
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error.' },
      { status: 500 },
    );
  }
}
