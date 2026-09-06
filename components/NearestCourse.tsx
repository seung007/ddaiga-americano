"use client";

import { useState } from "react";

/**
 * 내 위치에서 가장 가까운 코스 찾기
 *
 * 왜 (2026-09-07)
 * ──────────────
 * 코스 페이지에 온 사람의 첫 질문은 "넷 중 어디로 갈까"다. 그런데 페이지는
 * **네 개를 나란히 놓고 알아서 고르라고** 한다. 서울 어디 사는지에 따라 답이
 * 거의 정해지는 질문인데도 그렇다.
 *
 * 이건 **없는 데이터를 지어내지 않고** 답할 수 있는 몇 안 되는 기능이다 —
 * 좌표는 이미 공식 자료에서 확인해 두었고, 사용자 위치는 브라우저가 준다.
 *
 * 정직하게 지킬 것 두 가지
 * ──────────────────────
 * ① **직선거리라고 적는다.** 실제 이동 거리가 아니다. 한강을 사이에 두면
 *    직선으로 2km 여도 다리를 돌아 5km 일 수 있다. 그 숫자를 '거리'라고만
 *    적으면 사람이 속는다.
 * ② **위치를 아무 데도 보내지 않는다.** 계산은 전부 브라우저 안에서 끝난다.
 *    그렇게 적어 두면 권한 창 앞에서 망설이는 이유가 하나 줄어든다.
 *
 * 버튼을 눌러야 물어본다. 페이지를 열자마자 권한 창을 띄우면
 * **아무것도 안 하고 나가는 사람에게 창부터 들이미는 것**이 된다.
 */

export type NearbyCourse = { slug: string; name: string; lat: number; lon: number };

/** 두 좌표 사이 대권거리(km). 지구를 구로 본 근사다 — 서울 안에서는 오차가 무시할 만하다. */
function haversineKm(aLat: number, aLon: number, bLat: number, bLon: number) {
  const R = 6371;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLon = ((bLon - aLon) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((aLat * Math.PI) / 180) *
      Math.cos((bLat * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

type Result = { slug: string; name: string; km: number };

export default function NearestCourse({ courses }: { courses: NearbyCourse[] }) {
  const [state, setState] = useState<"idle" | "asking" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const [ranked, setRanked] = useState<Result[]>([]);

  const find = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setState("error");
      setMessage("이 브라우저는 위치 기능을 지원하지 않습니다. 아래 목록에서 골라주세요.");
      return;
    }
    setState("asking");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const list = courses
          .map((c) => ({
            slug: c.slug,
            name: c.name,
            km: haversineKm(latitude, longitude, c.lat, c.lon),
          }))
          .sort((a, b) => a.km - b.km);
        setRanked(list);
        setState("done");
        // GA — 이 기능이 실제로 쓰이는지 보고 안 쓰이면 지운다.
        (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.(
          "event",
          "courses_nearest",
          { nearest: list[0]?.slug }
        );
      },
      (err) => {
        setState("error");
        setMessage(
          err.code === err.PERMISSION_DENIED
            ? "위치 권한이 거부되었습니다. 아래 목록에서 직접 골라주세요."
            : "위치를 가져오지 못했습니다. 실내에서는 자주 실패합니다 — 아래 목록에서 골라주세요."
        );
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300_000 }
    );
  };

  return (
    <div className="mb-8 rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4">
      {state !== "done" && (
        <>
          <p className="text-sm font-semibold text-gray-900">어디로 갈지 고민되시나요?</p>
          <p className="mt-1 text-xs leading-relaxed text-gray-600">
            현재 위치에서 가장 가까운 코스를 알려드립니다. 위치는{" "}
            <b className="font-semibold text-gray-800">브라우저 안에서만 계산하고 어디에도 보내지 않습니다.</b>
          </p>
          <button
            type="button"
            onClick={find}
            disabled={state === "asking"}
            className="mt-3 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
          >
            {state === "asking" ? "위치 확인 중…" : "가까운 코스 찾기"}
          </button>
          {state === "error" && (
            <p className="mt-2.5 text-xs leading-relaxed text-rose-700">{message}</p>
          )}
        </>
      )}

      {state === "done" && ranked.length > 0 && (
        <>
          <p className="text-sm text-gray-600">
            가장 가까운 곳은{" "}
            <a href={`#${ranked[0].slug}`} className="font-bold text-emerald-700 hover:underline">
              {ranked[0].name}
            </a>
            입니다.
          </p>
          <ol className="mt-3 flex flex-col gap-1.5">
            {ranked.map((r, i) => (
              <li key={r.slug}>
                <a
                  href={`#${r.slug}`}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm transition-colors hover:border-emerald-300"
                >
                  <span className={i === 0 ? "font-semibold text-gray-900" : "text-gray-700"}>
                    {i + 1}. {r.name}
                  </span>
                  <span className="text-xs font-medium text-gray-500">
                    직선 {r.km < 10 ? r.km.toFixed(1) : Math.round(r.km)}km
                  </span>
                </a>
              </li>
            ))}
          </ol>
          {/* 이 한 줄을 빼면 사람이 이 숫자를 이동 거리로 읽는다. */}
          <p className="mt-2.5 text-xs leading-relaxed text-gray-500">
            <b className="font-semibold text-gray-700">직선거리</b>입니다 — 실제 이동 거리가 아닙니다.
            한강을 사이에 두면 다리를 돌아야 해서 훨씬 멀 수 있습니다. 각 코스의 지하철 안내를
            확인하세요.
          </p>
        </>
      )}
    </div>
  );
}
