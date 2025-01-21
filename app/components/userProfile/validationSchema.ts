import { z } from 'zod';

import { UserSession } from '@/common/types';

export const handleUpdateUserSession = z.custom<UserSession & { image: FormData | null | string }>();

export type UserSessionFormValidationSchema = z.infer<typeof handleUpdateUserSession>;
