import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET() {
  try {
    const session = await auth();
    return NextResponse.json({ session });
  } catch (err: any) {
    return NextResponse.json({ session: null, error: String(err) }, { status: 500 });
  }
}
