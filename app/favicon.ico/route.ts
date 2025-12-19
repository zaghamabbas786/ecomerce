import { NextResponse } from 'next/server';

// Redirect favicon.ico requests to the icon.svg
// This prevents 404 errors when browsers automatically request /favicon.ico
export async function GET() {
  // Return a 204 No Content response to prevent 404 errors
  // Browsers will use the icon.svg from app/icon.svg automatically
  return new NextResponse(null, { status: 204 });
}

