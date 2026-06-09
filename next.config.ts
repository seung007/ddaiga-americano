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
};

export default nextConfig;
