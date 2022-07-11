import isUrl from "is-url";

export const isValidUrl = (url: string): boolean => {
  return isUrl(url);
};

export const isValidCustomLink = (customLink?: string): boolean => {
  const notProvided = !customLink || !customLink.length;
  if (notProvided) return true;

  if (customLink.length < 4) return false;

  return !!customLink.match(/^[\w-]+$/);
};
