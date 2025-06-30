function vimeoUrlChack(url: string) {
  let number = null;
  //****************************** */
  // const url = "https://vimeo.com/829783962?share=copy";
  // const url = "https://vimeo.com/829783962";
  const regex = /vimeo\.com\/(\d+)/;
  const match = url.match(regex);
  if (match && match[1]) {
    number = match[1];
  } else {
    //https://player.vimeo.com/video/829783962?h=47a19669a0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479.mp4
    if (url.includes('https://player.vimeo.com/video')) {
      const start = 'https://player.vimeo.com/video/'.length;
      const end = url.indexOf('?');
      number = url.slice(start, end);
    }
  }

  //***************************** */
  if (!number || !Number(number)) {
    // return Error_model_hook("please provide valid vimeo URL")
    return null;
  }
  return Number(number);
}

export default vimeoUrlChack;

export function extractVimeoParams(url: string) {
  try {
    const parsedUrl = new URL(url);
    const pathParts = parsedUrl.pathname.split('/').filter(Boolean); // removes empty strings
    const n = pathParts[0] || null;
    const h = pathParts[1] || null;

    return { n, h };
  } catch (e) {
    return { n: null, h: null, error: 'Invalid URL' };
  }
}
