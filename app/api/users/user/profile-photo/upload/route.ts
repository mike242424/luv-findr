import { NextRequest, NextResponse } from 'next/server';
import { uploadFileToBlob } from '@/lib/uploadToBlob';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    const blob = await uploadFileToBlob(file);
    return NextResponse.json(blob);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error.' },
      { status: 500 },
    );
  }
}
