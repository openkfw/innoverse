import { z } from 'zod';

import { required_field } from '@/common/formValidation';

export const formValidationSchema = z
  .object({
    comment: z.string().min(1, required_field),
  })
  .required();

export type CommentFormValidationSchema = z.infer<typeof formValidationSchema>;
