// src/schema/signup.schema.tsx
import { z } from "zod";

export const signupSchema = z
  .object({
    email: z
      .string()
      .min(1, "이메일을 입력해주세요.")
      .email("올바른 이메일 형식이 아닙니다."),
      
    name: z
      .string()
      .min(1, "이름을 입력해주세요.")
      .max(15, "이름은 15자 이하여야 합니다."),

    phone: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^010-\d{3,4}-\d{4}$/.test(val),
        "올바른 휴대전화 번호 형식이 아닙니다 (예: 010-1234-5678)."
      ),

    nickname: z
      .string()
      .min(1, "닉네임을 입력해주세요.")
      .min(2, "닉네임은 2글자 이상이어야 합니다.")
      .max(20, "닉네임은 20자 이하여야 합니다."),

    password: z
      .string()
      .min(1, "비밀번호를 입력해주세요.")
      .min(8, "비밀번호는 8자 이상이어야 합니다.")
      .max(20, "비밀번호는 20자 이하여야 합니다."),

    passwordCheck: z
      .string()
      .min(1, "비밀번호 확인을 입력해주세요."),
  })
  .refine((data) => data.password === data.passwordCheck, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordCheck"],
  });

export type SignupForm = z.infer<typeof signupSchema>;
