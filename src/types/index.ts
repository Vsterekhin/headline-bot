export type Mode = "default" | "official" | "loud" | "social" | "short" | "mediapack";

export interface HeadlineResponse {
  official: string[];
  loud: string[];
  social: string[];
}

export interface MediaPackResponse extends HeadlineResponse {
  lead: string;
  telegram_post: string;
  short_news: string;
  announcement: string;
}

export interface UserContext {
  telegramId: number;
  username?: string;
  firstName?: string;
  lastName?: string;
}
