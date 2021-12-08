export default function optimizeImage(url: string, width?: number) {
  // if (/^https?:\/\/.+/.test(url)) return url;

  // if not start with http or https, then add http://
  if (!/^https?:\/\//.test(url)) {
    return `http://localhost:8000/storage/images/${url}`;
  }

  // if (!/\.(jpe?g|png)$/i.test(url)) return url;

  return url;
  // TODO: optimize image on upload
}
