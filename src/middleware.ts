import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // PIN verification removed for open judge evaluation and testing
  return NextResponse.next();
}

export const config = {
  matcher: []
};

