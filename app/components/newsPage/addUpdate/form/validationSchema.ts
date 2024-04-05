import { z } from 'zod';

import { required_field } from '@/common/formValidation';

export const formValidationSchema = z
  .object({
    comment: z.string().min(1, required_field),
    projectId: z.string().min(1, required_field),
  })
  .required();

export const handleProjectUpdateSchema = z
  .object({
    comment: z.string(),
    projectId: z.string(),
  })
  .required();

export type UpdateFormValidationSchema = z.infer<typeof formValidationSchema>;
