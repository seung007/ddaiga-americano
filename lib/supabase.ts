import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * 환경변수가 하나라도 비어 있으면 false.
 *
 * 이전 코드는 `process.env.NEXT_PUBLIC_SUPABASE_URL!` 처럼 non-null 단정을 써서,
 * 값이 없으면 createClient 가 모듈 평가 시점에 "supabaseUrl is required" 를 던졌다.
 * 클라이언트 컴포넌트에서 그게 터지면 하이드레이션이 아예 실패해서 화면이
 * 초기 SSR 상태("불러오는 중…")에 영구 고착된다 — try/catch 로도 구제 불가.
 * 그래서 여기서는 절대 던지지 않고, 호출부가 상태를 보고 정직하게 표시하도록 한다.
 */
export const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!supabaseConfigured && typeof window !== "undefined") {
  console.error(
    "[supabase] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY 가 설정되지 않았습니다. " +
      "Vercel → Settings → Environment Variables 를 확인하세요."
  );
}

// 클라이언트 싱글톤 — 브라우저 환경에서만 사용.
// 미설정 시에도 던지지 않도록 형식만 유효한 자리표시자를 넣는다.
// 이 클라이언트로 요청하면 네트워크 단계에서 실패하고 { data: null, error } 로 돌아온다.
export const supabase = createClient(
  supabaseUrl || "https://unconfigured.invalid",
  supabaseAnonKey || "unconfigured"
);
