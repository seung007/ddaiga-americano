"use client";

import { useCallback, useState } from "react";
import type { HangangCourse } from "@/lib/courses";
import type { Runner } from "@/components/courseMapShared";
import CourseMapLive from "@/components/CourseMapLive";
import CourseMapKakao, { kakaoEnabled } from "@/components/CourseMapKakao";

/**
 * 코스 지도 고르기 (2026-10-14)
 * 카카오 JavaScript 키(공유 버튼과 같은 NEXT_PUBLIC_KAKAO_JS_KEY)가 있으면 카카오맵, 없거나 실패하면 기존 Leaflet(OpenStreetMap).
 * 키는 있는데 콘솔에서 「카카오맵」 사용 설정이 꺼져 있으면 SDK 가 실패 → 역시 Leaflet(GA course_map_fallback 으로 보인다).
 * 키를 Vercel 에 넣기 전에 배포해도 화면은 지금과 같다.
 */
export default function CourseMap({ course, runners }: { course: HangangCourse; runners?: Runner[] }) {
  const [failed, setFailed] = useState(false);
  const onFail = useCallback(() => {
    setFailed(true);
    const g = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
    if (typeof g === "function") g("event", "course_map_fallback", { course: course.slug });
  }, [course.slug]);
  if (kakaoEnabled() && !failed) return <CourseMapKakao course={course} runners={runners} onFail={onFail} />;
  return <CourseMapLive course={course} runners={runners} />;
}
