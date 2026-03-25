import { z } from 'zod';

export const updateProfileSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
});

export const uploadKycSchema = z.object({
  documentUrl: z.string().url(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UploadKycInput = z.infer<typeof uploadKycSchema>;
