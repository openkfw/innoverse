import dayjs, { type Dayjs } from 'dayjs';
import { z } from 'zod';

import { invalid_date, required_field } from '@/common/formValidation';

export const formValidationSchema = z
  .object({
    comment: z.string().min(1, required_field),
    projectId: z.string().min(1, required_field),
    date: z.custom<Dayjs>((val) => val instanceof dayjs, invalid_date),
  })
  .required();

export const handleProjectUpdateSchema = z
  .object({
    comment: z.string(),
    projectId: z.string(),
    date: z.string(),
  })
  .required();

export type UpdateFormValidationSchema = z.infer<typeof formValidationSchema>;
