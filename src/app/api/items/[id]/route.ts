import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';

const updateItemSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional()
});

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const item = await prisma.item.findUnique({ where: { id: params.id } });
    if (!item) {
      return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: { item } }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to fetch item' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const parsed = updateItemSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.message }, { status: 400 });
    }

    const existing = await prisma.item.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });
    }

    const item = await prisma.item.update({
      where: { id: params.id },
      data: parsed.data
    });

    return NextResponse.json({ success: true, data: { item } }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to update item' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const existing = await prisma.item.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });
    }

    await prisma.item.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true, data: null }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to delete item' }, { status: 500 });
  }
}
