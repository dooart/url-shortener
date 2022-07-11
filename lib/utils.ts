import { format, formatDistance } from "date-fns";
import { customAlphabet } from "nanoid";

// eliminates visual ambiguity by excluding certain characters such as 0, O, I, l
const BASE58_SCHEME_ALPHABET =
  "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

export const getDomain = (): string => {
  return process.env.NEXT_PUBLIC_APP_DOMAIN as string;
};

export const getDomainWithoutScheme = (): string => {
  return new URL(getDomain()).host;
};

export function newId() {
  const nanoid = customAlphabet(BASE58_SCHEME_ALPHABET, 6);
  return nanoid();
}

export function formatUnixTime(unixTime?: number): string | null {
  if (!unixTime) return null;

  const pattern = "MMMM d, yyyy h:mm aaa";
  return format(new Date(unixTime), pattern);
}

export function formatRelativeUnixTime(unixTime?: number): string | null {
  if (!unixTime) return null;

  return formatDistance(new Date(unixTime), new Date(), { addSuffix: true });
}
