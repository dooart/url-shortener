export interface ShortenedLink {
  id: string;
  url: string;
  timesAccessed: number;
  createdAt: number;
  lastAccessedAt?: number;
  existing?: boolean;
}

export interface NewLinkFormData {
  url: string;
  customLink: string;
}
