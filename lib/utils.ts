import { format } from "date-fns";
import { customAlphabet } from "nanoid";

// eliminates visual ambiguity by excluding certain characters such as 0, O, I, l
const BASE58_SCHEME_ALPHABET =
  "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

export const getDomain = (): string => {
  return "https://dooart.link";
};

export const getDomainWithoutScheme = (): string => {
  return getDomain().substring("https://".length);
};

export const isValidCustomLink = (customLink: string): boolean => {
  return !!customLink.match(/^[\w-]+$/);
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
