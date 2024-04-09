export type Emoji = {
  nativeSymbol: string;
  shortCode: string;
};

export type Reaction = {
  createdAt: Date;
  reactedBy: string;
  shortCode: string;
  nativeSymbol: string;
};

export type ReactionCount = {
  count: number;
  emoji: Emoji;
};
