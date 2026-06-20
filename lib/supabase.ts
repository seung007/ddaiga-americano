import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 클라이언트 싱글톤 — 브라우저 환경에서만 사용
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
