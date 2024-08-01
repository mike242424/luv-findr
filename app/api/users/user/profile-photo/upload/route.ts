import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const filename = file.name;

    const blob = await put(filename, file.stream(), {
      access: 'public',
    });

    return NextResponse.json(blob);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error.' },
      { status: 500 },
    );
  }
}
