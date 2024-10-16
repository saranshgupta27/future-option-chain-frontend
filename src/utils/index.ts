import { parseISO } from "date-fns";

export function convertKeysToLowercase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map((item) => convertKeysToLowercase(item));
  } else if (typeof obj === "object" && obj !== null) {
    return Object.keys(obj).reduce((acc, key) => {
      const lowerKey = key.toLowerCase();
      acc[lowerKey] = convertKeysToLowercase(obj[key]);
      return acc;
    }, {} as any);
  }
  return obj;
}

export function sortExpiries(expiries: string[]): string[] {
  return expiries
    .slice()
    .sort((a, b) => parseISO(a).getTime() - parseISO(b).getTime());
}
