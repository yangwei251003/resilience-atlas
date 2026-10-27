/** Resolve local public media beneath the build-time GitHub Pages base path. */
export function mediaUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_BASE_PATH || ""}${path}`;
}
