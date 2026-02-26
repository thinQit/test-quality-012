import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';
import { hashPassword, signToken } from '@/lib/auth';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  role: z.enum(['customer', 'admin']).optional()
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.message }, { status: 400 });
    }

    const { email, password, name, role } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Email already registered' }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email, name, role: role ?? 'customer', passwordHash }
    });

    const token = signToken({ sub: user.id, role: user.role });

    return NextResponse.json(
      { success: true, data: { user: { ...user, passwordHash: undefined }, token } },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to register user' }, { status: 500 });
  }
}
