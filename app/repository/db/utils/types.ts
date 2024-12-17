import { Prisma } from '@prisma/client';

export const defaultParamsComment = {
  include: {
    reactions: true,
    responses: true,
    likes: true,
  },
};

const withComment = Prisma.validator<Prisma.CommentDefaultArgs>()({
  ...defaultParamsComment,
});

export type CommentDB = Prisma.CommentGetPayload<typeof withComment>;

export type LikeDB = Prisma.LikeGetPayload<Prisma.LikeDefaultArgs>;
