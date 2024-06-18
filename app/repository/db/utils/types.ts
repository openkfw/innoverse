import { Prisma } from '@prisma/client';

export const defaultParamsComment = {
  include: {
    comment: {
      include: {
        reactions: true,
        responses: true,
        parent: true,
      },
    },
  },
};

const withPostComment = Prisma.validator<Prisma.PostCommentDefaultArgs>()({
  ...defaultParamsComment,
});

const withNewsComment = Prisma.validator<Prisma.NewsCommentDefaultArgs>()({
  ...defaultParamsComment,
});

export type PostCommentDB = Prisma.PostCommentGetPayload<typeof withPostComment>;

export type NewsCommentDB = Prisma.NewsCommentGetPayload<typeof withNewsComment>;
