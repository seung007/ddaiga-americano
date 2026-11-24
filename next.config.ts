import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: { root: import.meta.dirname },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "static.nike.com" },
      { protocol: "https", hostname: "www.hoka.com" },
      { protocol: "https", hostname: "images.asics.com" },
      { protocol: "https", hostname: "brooks-res.cloudinary.com" },
      { protocol: "https", hostname: "nb.scene7.com" },
      { protocol: "https", hostname: "www.saucony.com" },
      { protocol: "https", hostname: "assets.mizuno.com" },
      // 2026-09-06: assets.mizuno.com 3장이 전부 죽어 한국몰로 옮겼다
      { protocol: "https", hostname: "kor.mizuno.com" },
      { protocol: "https", hostname: "assets.adidas.com" },
      { protocol: "https", hostname: "www.on-running.com" },
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "image.msscdn.net" },
      { protocol: "https", hostname: "www.on.com" },
      { protocol: "https", hostname: "cdn.runrepeat.com" },
      { protocol: "https", hostname: "images.puma.com" },
      { protocol: "https", hostname: "images.hoka.com" },
      { protocol: "https", hostname: "img.soldout.co.kr" },
      { protocol: "https", hostname: "gazellesports.com" },
    ],
  },
  // 2026-11-24: 신발 id 를 바꾼 옛 주소를 새 주소로 잇는다(검색에 걸린 옛 링크가 404 가 되지 않게)
  async redirects() {
    return [
      { source: "/shoes/adidas-ultraboost-25", destination: "/shoes/adidas-ultraboost-5x", permanent: true },
      { source: "/compare/adidas-ultraboost-25-vs-nike-pegasus-42", destination: "/compare/adidas-ultraboost-5x-vs-nike-pegasus-42", permanent: true },
    ];
  },
};

export default nextConfig;
