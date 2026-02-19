
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge'; // Use Edge Runtime for better streaming performance

export async function GET(request: NextRequest) {
    const url = request.nextUrl.searchParams.get('url');

    if (!url) {
        return new NextResponse('Missing URL parameter', { status: 400 });
    }

    try {
        const response = await fetch(url);

        if (!response.ok) {
            return new NextResponse(`Failed to fetch: ${response.statusText}`, { status: response.status });
        }

        const headers = new Headers(response.headers);
        // Ensure we allow CORS for the client if needed, though usually same-origin is fine
        headers.set('Access-Control-Allow-Origin', '*');

        // Forward content-type and length if available
        if (response.headers.get('content-length')) {
            headers.set('Content-Length', response.headers.get('content-length')!);
        }

        return new NextResponse(response.body, {
            status: 200,
            headers: headers
        });

    } catch (error) {
        console.error('Proxy fetch error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
