import { DateTime } from 'next-auth/providers/kakao';

export type Emoji = {
  nativeSymbol: string;
  shortCode: string;
};

export type Reaction = {
  createdAt: DateTime;
  id: string;
  reactedBy: string;
  reactedWith: Emoji;
  updateId: string;
};

export type CountReaction = {
  count: number;
  shortCode: string;
};
