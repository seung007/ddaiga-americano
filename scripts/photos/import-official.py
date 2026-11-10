"""공식몰 제품 사진 묶음(ddaiga-photos-<brand>.json) → public/shoes/photo/<id>.webp + lib/shoes/photos.json

왜 있나 (2026-11-10)
  홈 타일 컷아웃은 원본 주소가 기록되지 않았고 신발 끝이 잘려 세로줄이 보였다.
  목록 사진(RunRepeat 대표 사진)은 착용 사진이라 카드 회색 안에 다른 회색이 겹쳤다.
  → 공식몰 옆모습 제품 사진을 같은 방식으로 다듬어 쓴다(패턴 15: 배경·각도·크기 통일).

묶음 파일 형식: {"<shoe id>": {"src": 원본 주소, "type": "image/png", "b64": "..."}}
  Chrome 에서 공식몰 페이지를 열고 받은 파일이다. 이 스크립트는 네트워크를 쓰지 않는다.

처리
  · 투명 PNG(아식스 패키샷)는 그대로, 흰 바탕 JPG 는 가장자리에서 이어진 흰색만 지운다(신발 안의 흰 부분은 남긴다).
  · 신발 둘레를 잘라 내고 여백을 6% 둔다 — 신발이 그림 테두리에 닿으면 연두 바탕에서 잘린 줄이 보인다.
  · 가로 800px 까지만 줄인다(키우지 않는다). webp 품질 88.

사용: python3 -I scripts/photos/import-official.py <묶음.json>... [--checked 2026-11-10]
"""
import base64
import io
import json
import sys
from collections import deque
from pathlib import Path

from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "public" / "shoes" / "photo"
LEDGER = ROOT / "lib" / "shoes" / "photos.json"
MAX_W = 800
PAD = 0.06


def clear_white(im: Image.Image, tol: int = 18) -> Image.Image:
    """가장자리에서 이어진 흰 바탕만 투명하게 한다."""
    im = im.convert("RGBA")
    w, h = im.size
    px = im.load()
    seen = bytearray(w * h)
    q = deque()
    for x in range(w):
        q.append((x, 0)); q.append((x, h - 1))
    for y in range(h):
        q.append((0, y)); q.append((w - 1, y))
    lim = 255 - tol
    while q:
        x, y = q.popleft()
        i = y * w + x
        if seen[i]:
            continue
        seen[i] = 1
        r, g, b, _ = px[x, y]
        if r < lim or g < lim or b < lim:
            continue
        px[x, y] = (r, g, b, 0)
        if x > 0: q.append((x - 1, y))
        if x < w - 1: q.append((x + 1, y))
        if y > 0: q.append((x, y - 1))
        if y < h - 1: q.append((x, y + 1))
    a = im.split()[3].filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1))
    im.putalpha(a)
    return im


def tidy(im: Image.Image) -> Image.Image:
    a = im.split()[3].point(lambda v: 255 if v > 12 else 0)
    box = a.getbbox()
    if not box:
        raise ValueError("빈 그림")
    im = im.crop(box)
    w, h = im.size
    p = round(w * PAD)
    canvas = Image.new("RGBA", (w + 2 * p, h + 2 * p), (0, 0, 0, 0))
    canvas.paste(im, (p, p))
    if canvas.width > MAX_W:
        canvas = canvas.resize((MAX_W, round(canvas.height * MAX_W / canvas.width)), Image.LANCZOS)
    return canvas


def main(argv: list[str]) -> None:
    checked = "2026-11-10"
    if "--checked" in argv:
        i = argv.index("--checked"); checked = argv[i + 1]; del argv[i:i + 2]
    OUT.mkdir(parents=True, exist_ok=True)
    ledger = json.loads(LEDGER.read_text()) if LEDGER.exists() else {}
    for f in argv:
        bundle = json.loads(Path(f).read_text())
        for sid, v in bundle.items():
            im = Image.open(io.BytesIO(base64.b64decode(v["b64"])))
            im.load()
            has_alpha = im.mode in ("RGBA", "LA") or "transparency" in im.info
            im = im.convert("RGBA") if has_alpha else clear_white(im)
            im = tidy(im)
            im.save(OUT / f"{sid}.webp", "WEBP", quality=88, method=6)
            ledger[sid] = {"src": v["src"], "w": im.width, "h": im.height, "checkedAt": checked}
            print(sid, im.size)
    LEDGER.write_text(json.dumps(dict(sorted(ledger.items())), ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    main(sys.argv[1:])
