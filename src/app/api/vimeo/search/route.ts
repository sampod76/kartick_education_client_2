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

  try {
    const res = await fetch(
      `https://api.vimeo.com/videos?query=${encodeURIComponent(query)}&per_page=10&sort=relevant&direction=desc`,
      {
        headers: {
          //   Authorization: `Bearer ${process.env.VIMEO_ACCESS_TOKEN}`,
          Authorization: `Bearer 2f7f420a6604b9d24f1bfb437c292b08`,
          Accept: 'application/vnd.vimeo.*+json;version=3.4',
        },
      },
    );

    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Vimeo API error' }), { status: 500 });
  }
}
