// schema/onboarding.schema.ts
import { z } from 'zod';

export const onboardingSchema = z.object({
  nickname: z
    .string()
    .min(1, '닉네임은 필수입니다.')
    .min(2, '닉네임은 2글자 이상이어야 합니다.'),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^010-\d{3,4}-\d{4}$/.test(val),
      '올바른 휴대전화 번호 형식이 아닙니다 (예: 010-1234-5678).'
    ),
});

export type OnboardingForm = z.infer<typeof onboardingSchema>;