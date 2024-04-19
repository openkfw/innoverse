import { z } from 'zod';

import { required_field } from '@/common/formValidation';

export const formValidationSchema = z.object({
  comment: z.string().min(1, required_field),
  project: z
    .object({ id: z.string(), label: z.string() })
    .nullable()
    .refine((data) => data?.id && data?.label, required_field),
});

export const handleProjectUpdateSchema = z
  .object({
    comment: z.string(),
    projectId: z.string(),
  })
  .required();

export type UpdateFormValidationSchema = z.infer<typeof formValidationSchema>;
