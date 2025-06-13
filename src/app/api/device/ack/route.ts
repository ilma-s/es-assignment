import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('ESP32 ACK:', body);

    // No storage yet, just acknowledge
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing ACK:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 