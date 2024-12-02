import { z } from 'zod';

import { UserSession } from '@/common/types';

export const handleUpdateUserSession = z.custom<UserSession & { image: FormData | string | null }>();

export type UserSessionFormValidationSchema = z.infer<typeof handleUpdateUserSession>;
