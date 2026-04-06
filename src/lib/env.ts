import { z } from "zod";

const publicSupabaseEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

export const envSchema = publicSupabaseEnvSchema;

export const supabaseServiceRoleEnvSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
});

export type Env = z.infer<typeof envSchema>;
export type SupabaseServiceRoleEnv = z.infer<
  typeof supabaseServiceRoleEnvSchema
>;

export function getEnv(input: NodeJS.ProcessEnv = process.env): Env {
  return envSchema.parse(input);
}

export function getPublicSupabaseEnv(input: NodeJS.ProcessEnv = process.env) {
  const result = publicSupabaseEnvSchema.safeParse(input);

  if (!result.success) {
    const missing = result.error.issues
      .map((i) => i.path.join("."))
      .join(", ");
    throw new Error(
      `Missing Supabase environment variables: ${missing}. ` +
        `Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your Vercel project settings and redeploy.`
    );
  }

  return result.data;
}

export function getSupabaseServiceRoleEnv(
  input: NodeJS.ProcessEnv = process.env,
): SupabaseServiceRoleEnv {
  return supabaseServiceRoleEnvSchema.parse(input);
}
