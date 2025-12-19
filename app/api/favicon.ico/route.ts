import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Handle /favicon.ico requests to prevent 404 errors
// Browsers automatically request this, so we serve the icon.svg
export async function GET() {
  try {
    const iconPath = path.join(process.cwd(), 'app', 'icon.svg');
    const iconContent = fs.readFileSync(iconPath, 'utf-8');
    
    return new NextResponse(iconContent, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    // Return 204 No Content if icon doesn't exist
    return new NextResponse(null, { status: 204 });
  }
}

