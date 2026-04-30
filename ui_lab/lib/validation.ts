import { z } from "zod"

// ── Universal Zod Schema Presets ───────────────────────────────────────
// Drop-in schemas for forms, API validation, and server actions.
// Inspired by next-saas-starter's validatedAction() pattern.

// ── Primitives ─────────────────────────────────────────────────────────

export const email = z
  .string()
  .min(1, "Email is required")
  .email("Invalid email address")
  .transform((v) => v.toLowerCase().trim())

export const password = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password is too long")
  .regex(/[A-Z]/, "Must contain an uppercase letter")
  .regex(/[a-z]/, "Must contain a lowercase letter")
  .regex(/[0-9]/, "Must contain a number")

export const username = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(30, "Username is too long")
  .regex(/^[a-zA-Z0-9_-]+$/, "Only letters, numbers, _ and -")

export const displayName = z
  .string()
  .min(1, "Name is required")
  .max(100, "Name is too long")
  .transform((v) => v.trim())

export const phone = z
  .string()
  .regex(/^\+?[1-9]\d{6,14}$/, "Invalid phone number")

export const url = z.string().url("Invalid URL")

export const slug = z
  .string()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format")

export const positiveInt = z.number().int().positive()

export const price = z.number().nonnegative("Price cannot be negative")

export const pagination = z.object({
  page: z.coerce.number().int().positive().default(1),
  size: z.coerce.number().int().min(1).max(100).default(20),
})

// ── Compound Schemas ───────────────────────────────────────────────────

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Password is required"),
})

export const registerSchema = z
  .object({
    email,
    username,
    password,
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: password,
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export const contactSchema = z.object({
  name: displayName,
  email,
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
})

export const searchSchema = z.object({
  q: z.string().min(1).max(200).trim(),
  ...pagination.shape,
})

// ── Helper: Validated Server Action (Next.js) ──────────────────────────
// Wraps a Server Action with Zod validation (from next-saas-starter pattern).

type ActionState = {
  error?: string
  success?: string
  [key: string]: unknown
}

type ValidatedAction<S extends z.ZodType, R extends ActionState> = (
  data: z.infer<S>,
  formData: FormData,
) => Promise<R>

export function validatedAction<S extends z.ZodType, R extends ActionState>(
  schema: S,
  action: ValidatedAction<S, R>,
) {
  return async (_prevState: R, formData: FormData): Promise<R> => {
    const raw = Object.fromEntries(formData)
    const result = schema.safeParse(raw)

    if (!result.success) {
      return { error: result.error.errors[0]?.message ?? "Validation failed" } as R
    }

    return action(result.data, formData)
  }
}
