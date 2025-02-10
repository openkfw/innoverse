import { z, ZodType } from 'zod';

import { invalid_file_size } from '@/common/formValidation';
import { UserSession } from '@/common/types';
import { clientConfig } from '@/config/client';

const MAX_FILE_SIZE = clientConfig.NEXT_PUBLIC_BODY_SIZE_LIMIT;

const userSessionSchema = z.object({
  providerId: z.string(),
  provider: z.string(),
  name: z.string(),
  username: z.string().optional(),
  role: z.string().optional(),
  department: z.string().optional(),
  email: z.string().email(),
}) satisfies ZodType<UserSession>;

export const handleUpdateUserSession = userSessionSchema.extend({
  image: z
    .union([
      z.string(),
      z.number(),
      z.instanceof(File).refine((file) => file.size < MAX_FILE_SIZE, invalid_file_size),
      z.any(),
    ])
    .optional(),
});

export type UserSessionFormValidationSchema = z.infer<typeof handleUpdateUserSession>;
