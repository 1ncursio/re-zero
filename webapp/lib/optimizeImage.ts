export default function optimizeImage(url?: string | null) {
  if (!url) return url;
  // if (/^https?:\/\/.+/.test(url)) return url;

  // /assets 로 시작하면 그대로 리턴
  if (/^\/assets\//.test(url)) {
    return url;
  }

  // if not start with http or https, then add http://
  if (!/^https?:\/\//.test(url)) {
    return `http://localhost:8000/storage/images/${url}`;
  }

  // if (!/\.(jpe?g|png)$/i.test(url)) return url;

  return url;
  // TODO: optimize image on upload
}
