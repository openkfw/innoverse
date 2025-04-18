import { z } from 'zod';

export const handleCheckinSchema = z.object({
  dailyCheckinVotes: z.array(
    z.object({
      vote: z.number(),
      checkinQuestionId: z.string(),
    }),
  ),
});
