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
  return envSchema.parse({
    NEXT_PUBLIC_SUPABASE_URL: input.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: input.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });
}

export function getPublicSupabaseEnv(input?: NodeJS.ProcessEnv) {
  // Keep direct process.env reads for NEXT_PUBLIC_* so Next.js can inline them
  // into client bundles during build.
  const source = input ?? {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };

  const result = publicSupabaseEnvSchema.safeParse(source);

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
  return supabaseServiceRoleEnvSchema.parse({
    SUPABASE_SERVICE_ROLE_KEY: input.SUPABASE_SERVICE_ROLE_KEY,
  });
}
