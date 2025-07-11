// app/api/vimeo/search/route.ts
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query');

  if (!query) {
    return new Response(JSON.stringify({ error: 'Missing query parameter' }), {
      status: 400,
    });
  }
  const token = process.env.VIMEO_ACCESS_TOKEN;
  try {
    const res = await fetch(
      `https://api.vimeo.com/me/videos?query=${encodeURIComponent(query)}&per_page=10`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.vimeo.*+json;version=3.4',
        },
      },
    );

    if (!res.ok) {
      const text = await res.text();
      console.error('Vimeo API error response:', text);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch Vimeo videos', details: text }),
        {
          status: res.status,
        },
      );
    }

    const raw = await res.json();

    return new Response(
      JSON.stringify({
        data: raw.data,
        total: raw.total,
      }),
      { status: 200 },
    );
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Unexpected server error', message: error?.message }),
      {
        status: 500,
      },
    );
  }
}
