import { z } from 'zod';

import { required_field } from '@/common/formValidation';

export const handleUpdateSchema = z.object({
  comment: z.string().min(1, required_field),
  project: z.object({ id: z.string().optional(), label: z.string().optional() }).nullable(),
  anonymous: z.boolean().optional(),
});

export const handleCreatePostSchema = z.object({
  comment: z.string().min(1, required_field),
  anonymous: z.boolean().optional(),
});

export const handleUpdatePostSchema = z.object({
  comment: z.string().min(1, required_field),
  anonymous: z.boolean().optional(),
});

export type UpdateFormValidationSchema = z.infer<typeof handleUpdateSchema>;
export type CreatePostValidationSchema = z.infer<typeof handleCreatePostSchema>;
export type UpdatePostValidationSchema = z.infer<typeof handleUpdatePostSchema>;
