import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export function GET() {
  return NextResponse.json({
    ok: true,
    service: 'techvaults-exam-system',
    timestamp: new Date().toISOString(),
  });
}
