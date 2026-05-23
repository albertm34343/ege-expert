import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        'проверка-сочиненийегэ.рф',
        'www.проверка-сочиненийегэ.рф',
        'xn----7sbbbqf0afdv1aeezab0a.xn--p1ai',
        'localhost:3000',
      ],
    },
  },
};

export default nextConfig;
