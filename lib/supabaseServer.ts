// lib/supabaseServer.ts
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";

export const createSupabaseServerClient = (ctx: GetServerSidePropsContext) => {
  return createPagesServerClient(ctx);
};
