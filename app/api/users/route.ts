import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth';
import { updateUserSchema } from '@/validation/updateUserSchema';
import { authOptions } from '@/lib/authOptions';
import { put } from '@vercel/blob';

async function uploadFileToBlob(file: Buffer, filename: string) {
  try {
    const blob = await put(filename, file, {
      access: 'public',
    });
    return blob.url;
  } catch (error) {
    console.error('Failed to upload file to Vercel Blob:', error);
    throw new Error('Failed to upload file.');
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
      city,
      state,
      usersGender,
      interestedInGender,
      profession,
      about,
      profilePhoto,
    } = await req.json();

    const validate = updateUserSchema.safeParse({
      firstName,
      lastName,
      dateOfBirth,
      city,
      state,
      usersGender,
      interestedInGender,
      profession,
      about,
      profilePhoto,
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

    let profilePhotoUrl: string | undefined;

    if (profilePhoto instanceof Buffer) {
      profilePhotoUrl = await uploadFileToBlob(
        profilePhoto,
        'profile_photo.jpg',
      );
    }

    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        firstName,
        lastName,
        dateOfBirth: formattedDateOfBirth,
        city,
        state,
        usersGender,
        interestedInGender,
        profession,
        about,
        profilePhoto: profilePhotoUrl || profilePhoto,
      },
    });

    return NextResponse.json({ updatedUser }, { status: 200 });
  } catch (error) {
    console.error('Error updating user details:', error);
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
        city: true,
        state: true,
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
          { email: { not: email } },
          { id: { notIn: matchedUserIds.concat(currentUser.id) } },
          { firstName: { not: null } },
          { lastName: { not: null } },
          { dateOfBirth: { not: null } },
          { usersGender: { not: null } },
          { interestedInGender: { not: null } },
          { about: { not: null } },
          { usersGender: currentUser.interestedInGender },
          { interestedInGender: currentUser.usersGender },
          {
            AND: [{ city: { not: null } }, { city: currentUser.city }],
          },
          {
            AND: [{ state: { not: null } }, { state: currentUser.state }],
          },
        ],
      },
      orderBy: {
        id: 'asc',
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        dateOfBirth: true,
        city: true,
        state: true,
        profession: true,
        about: true,
        profilePhoto: true,
      },
    });

    const shuffledUsers = allUsers.sort(() => Math.random() - 0.5);

    return NextResponse.json({ allUsers: shuffledUsers }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error.' },
      { status: 500 },
    );
  }
}
