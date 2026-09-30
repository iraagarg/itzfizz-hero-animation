// Files in /public are not rewritten by basePath, so every reference to one
// must go through this helper or it will 404 on GitHub Pages.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function assetPath(path: string): string {
  return `${BASE_PATH}${path.startsWith("/") ? path : `/${path}`}`;
}
