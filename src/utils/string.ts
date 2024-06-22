export function normalizeString(str: string) {
  if(!str) return str;
  return str.normalize("NFKD").replace(/[\u0300-\u036F]/g, "");
}
