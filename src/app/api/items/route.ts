import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';

const listQuerySchema = z.object({
  page: z.preprocess(val => Number(val ?? 1), z.number().int().positive().default(1)),
  pageSize: z.preprocess(val => Number(val ?? 10), z.number().int().positive().max(100).default(10)),
  q: z.string().optional()
});

const createItemSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  ownerId: z.string().uuid().optional()
});

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const query = Object.fromEntries(url.searchParams.entries());
    const parsed = listQuerySchema.safeParse(query);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.message }, { status: 400 });
    }

    const { page, pageSize, q } = parsed.data;
    const where = q
      ? {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } }
          ]
        }
      : {};

    const [items, total] = await Promise.all([
      prisma.item.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.item.count({ where })
    ]);

    return NextResponse.json(
      { success: true, data: { items, total, page, pageSize } },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to fetch items' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = createItemSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.message }, { status: 400 });
    }

    const { name, description, ownerId } = parsed.data;

    if (ownerId) {
      const owner = await prisma.user.findUnique({ where: { id: ownerId } });
      if (!owner) {
        return NextResponse.json({ success: false, error: 'Owner not found' }, { status: 400 });
      }
    }

    const item = await prisma.item.create({
      data: { name, description, ownerId }
    });

    return NextResponse.json({ success: true, data: { item } }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to create item' }, { status: 500 });
  }
}
