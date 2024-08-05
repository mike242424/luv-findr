import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function POST(req: NextRequest) {
  const { matchId, content } = await req.json();

  if (!matchId || !content) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 },
    );
  }

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
      { error: 'Not authorized to send messages to this user' },
      { status: 403 },
    );
  }

  try {
    const message = await prisma.message.create({
      data: {
        from: currentUser.id,
        to: matchId,
        content,
      },
    });
    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: 'Internal Server Error.' },
      { status: 500 },
    );
  }
}
