import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages 정적 배포용 설정
  output: "export",          // 정적 HTML 파일로 내보내기
  trailingSlash: true,       // 모든 URL 끝에 / 붙이기 (예: /blog/)
  images: {
    unoptimized: true,       // Cloudflare에서는 Next.js 이미지 최적화 비활성화
  },
};

export default nextConfig;
