export type Emoji = {
  nativeSymbol: string;
  shortCode: string;
};

export type Reaction = {
  createdAt: Date;
  reactedBy: string;
  reactedWith: Emoji;
};

export type CountReaction = {
  count: number;
  shortCode: string;
};
