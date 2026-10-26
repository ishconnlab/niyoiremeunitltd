const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;

export function extractYouTubeVideoId(input) {
  if (typeof input !== 'string' || !input.trim()) return '';
  const value = input.trim();
  if (VIDEO_ID.test(value)) return value;

  let url;
  try {
    url = new URL(value);
  } catch {
    return '';
  }
  if (!['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be', 'www.youtu.be'].includes(url.hostname)) return '';
  let id = '';
  if (url.hostname.endsWith('youtu.be')) id = url.pathname.split('/').filter(Boolean)[0] || '';
  else if (url.pathname === '/watch') id = url.searchParams.get('v') || '';
  else if (/^\/(embed|shorts)\//.test(url.pathname)) id = url.pathname.split('/')[2] || '';
  return VIDEO_ID.test(id) ? id : '';
}
