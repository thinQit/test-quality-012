import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const uptimeSeconds = Math.floor(process.uptime());
    return NextResponse.json(
      {
        success: true,
        data: {
          status: 'ok',
          version: '1.0.0',
          uptimeSeconds
        }
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Health check failed' }, { status: 500 });
  }
}
