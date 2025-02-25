import { z } from 'zod';

import { invalid_file_size } from '@/common/formValidation';
import { clientConfig } from '@/config/client';

const MAX_FILE_SIZE = clientConfig.NEXT_PUBLIC_BODY_SIZE_LIMIT;

const userSessionSchemaForm = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  role: z.string().optional(),
  department: z.string().optional(),
});

const userSessionSchema = z.object({
  role: z.string().optional(),
  department: z.string().optional(),
});

export const handleUpdateUserSessionForm = userSessionSchemaForm.extend({
  image: z.union([
    z.null(),
    z.string(),
    z.instanceof(File).refine((file) => file.size < MAX_FILE_SIZE, invalid_file_size),
  ]),
});

export const handleUpdateUserSession = userSessionSchema.extend({
  image: z.instanceof(FormData),
});

export type UserSessionFormValidationSchema = z.infer<typeof handleUpdateUserSessionForm>;
export type UserSessionValidationSchema = z.infer<typeof handleUpdateUserSession>;
