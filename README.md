This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs)## ⚙️ 환경 변수 설정 (중요)
이 프로젝트는 AI 자동화와 자동 배포를 위해 아래의 환경 변수(Secrets) 설정이 필수입니다.

### GitHub Secrets 설정 방법
1. GitHub 저장소의 **Settings > Secrets and variables > Actions** 메뉴로 이동합니다.
2. **New repository secret** 버튼을 눌러 아래 항목들을 입력합니다.

| 이름 | 설명 |
| :--- | :--- |
| `PUBLIC_DATA_API_KEY` | 공공데이터포털(data.go.kr) API 키 |
| `GEMINI_API_KEY` | Google AI Studio에서 발급받은 Gemini API 키 |
| `CLOUDFLARE_API_TOKEN` | Cloudflare My Profile > API Tokens에서 생성 (Pages 편집 권한 필요) |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare 대시보드 URL 또는 Workers & Pages에서 확인 가능 |

### Cloudflare API 토큰 권한 설정 팁
배포 시 `code: 10000` 오류가 발생한다면 토큰의 권한을 확인하세요.
- **권한 범위:** Account -> Cloudflare Pages -> Edit
- **리소스:** All accounts (또는 본인 계정)

---

## 📅 자동화 (GitHub Actions)
- **매일 오전 7시(KST)**: 자동으로 공공데이터를 수집하고 블로그 글을 생성하여 배포합니다.
- **Push 트리거**: 코드를 수정하여 `main` 브랜치에 올리면 즉시 빌드 및 배포가 시작됩니다.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
