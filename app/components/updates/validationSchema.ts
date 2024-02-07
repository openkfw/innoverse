import { z } from 'zod';

export const handleProjectUpdatesSchema = z
  .object({
    projectId: z.string(),
  })
  .required();
