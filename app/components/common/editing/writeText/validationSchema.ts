import { z } from 'zod';

import { required_field } from '@/common/formValidation';

export const formValidationSchema = z
  .object({
    text: z.string().min(1, required_field),
  })
  .required();

export type TextFormValidationSchema = z.infer<typeof formValidationSchema>;
