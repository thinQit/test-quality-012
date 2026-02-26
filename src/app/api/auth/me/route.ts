import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getBearerToken, verifyToken } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const token = getBearerToken(req.headers.get('authorization'));
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, data: { ...user, passwordHash: undefined } },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to fetch user' }, { status: 500 });
  }
}
