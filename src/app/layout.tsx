import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "용인시 생활 정보 | 행사·혜택·지원금 안내",
  description: "용인시 주민을 위한 지역 행사, 축제, 지원금, 혜택 정보를 매일 업데이트합니다.",
  keywords: ["용인시", "용인 행사", "용인 축제", "용인 지원금", "용인 혜택", "수지구", "기흥구", "처인구", "동네 소식", "용인 맛집"],
  openGraph: {
    title: "용인시 생활 정보 | 행사·혜택·지원금 안내",
    description: "용인시 주민을 위한 지역 행사, 축제, 지원금, 혜택 정보를 매일 업데이트합니다.",
    url: "https://yongin-love-info.com",
    siteName: "용인시 생활 정보",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "용인시 생활 정보 대표 이미지",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "용인시 생활 정보 | 행사·혜택·지원금 안내",
    description: "용인시 주민을 위한 지역 행사, 축제, 지원금, 혜택 정보를 매일 업데이트합니다.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const showGa = gaId && gaId !== "나중에_입력";

  return (
    <html lang="ko">
      <head>
        {showGa && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}></script>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}');
                `,
              }}
            />
          </>
        )}
        {/* 구글 애드센스 확인 코드 */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2764192052550924"
          crossOrigin="anonymous"
        ></script>
        <meta name="google-adsense-account" content="ca-pub-2764192052550924" />
        <meta name="naver-site-verification" content="1daf4177364df2f359bc5fa40a9329dddad6673b" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "용인시 생활 정보",
              "url": "https://yongin-love-info.com",
              "description": "용인시 주민을 위한 지역 행사, 축제, 지원금, 혜택 정보"
            })
          }}
        />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
