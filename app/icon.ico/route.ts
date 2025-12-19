import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Serve the icon.svg as favicon.ico to prevent 404 errors
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
    // If icon.svg doesn't exist, return 204 No Content
    return new NextResponse(null, { status: 204 });
  }
}

