import { z } from 'zod';

export const handleOpportunitySchema = z
  .object({
    opportunityId: z.string(),
  })
  .required();
