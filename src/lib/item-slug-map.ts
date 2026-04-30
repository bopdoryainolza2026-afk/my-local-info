/**
 * 카드 아이디 → 블로그 슬러그 하드코딩 매핑 테이블
 * 이 파일은 scripts/generate-id-map.js 로 자동 생성됩니다.
 * 새 블로그 글을 추가한 뒤에는 이 파일을 반드시 갱신하세요.
 */
export const ITEM_SLUG_MAP: Record<string, string> = {
  // === 행사/축제 ===
  "evt-2026-001": "2026-05-01-everland-rose-festival",
  "evt-2026-002": "2026-05-01-yongin-market-5day",
  "evt-2026-003": "2026-05-01-korean-folk-village-night",
  "evt-2026-004": "2026-05-01-yongin-library-author",
  "evt-2026-005": "2026-05-01-giheung-busking",
  "evt-2026-006": "2026-05-01-yongin-nongchon",
  "evt-2026-007": "2026-05-01-yongin-youth-lab",
  "evt-2026-008": "2026-05-01-yongin-cityhall-movie",
  "evt-2026-009": "2026-05-01-hantaek-flower",
  "evt-2026-010": "2026-04-29-yongin-wipay-alley-event",
  "evt-2026-011": "2026-05-01-poeun-matinee",
  "evt-2026-012": "2026-05-01-childrens-museum-origami",
  "evt-2026-013": "2026-05-01-cheoin-youth-farmer",
  "evt-2026-014": "2026-05-01-namjune-paik-festival",
  "evt-2026-015": "2026-05-01-yongin-job-fair",
  "evt-2026-016": "2026-05-01-volunteer-family",

  // === 지원금/혜택 ===
  "ben-2026-001": "2026-05-01-yongin-pregnant-transport",
  "ben-2026-002": "2026-05-01-yongin-birth-grant",
  "ben-2026-003": "2026-05-01-youth-rent-interest",
  "ben-2026-004": "2026-05-01-yongin-youth-suit",
  "ben-2026-005": "2026-05-01-multichild-jeonse-interest",
  "ben-2026-006": "2026-05-01-senior-basic-pension",
  "ben-2026-007": "2026-04-29-yongin-youth-dream-support",
  "ben-2026-008": "2026-04-29-yongin-small-business-design-support",
  "ben-2026-009": "2026-04-29-yongin-citizen-safety-insurance",
  "ben-2026-010": "2026-05-01-yongin-citizen-card",
  "ben-2026-011": "2026-04-29-yongin-health-support",
  "ben-2026-012": "2026-04-29-yongin-veterans-honor-allowance",
  "ben-2026-013": "2026-04-29-yongin-sme-online-support",
  "ben-2026-014": "2026-05-01-yongin-child-allowance",
  "ben-2026-015": "2026-04-30-yongin-housing-allowance",
  "ben-2026-016": "2026-05-01-yongin-disability-support",
  "ben-2026-017": "2026-04-30-yongin-hope-dream-job",
  "ben-2026-018": "2026-04-30-yongin-small-business-support",

  // === 맛집 ===
  "res-001": "2026-04-30-gogiri-makguksu",
  "res-002": "2026-04-30-yongin-baegam-sundae",
  "res-003": "2026-04-30-giheung-sanmotongi-pork",
  "res-004": "2026-04-30-suji-miga-huoguo",
  "res-005": "2026-04-30-yongin-central-market-kalguksu",
  "res-006": "2026-04-30-yongin-hwangso-gojib",
  "res-007": "2026-04-30-yongin-memillae-review",
  "res-008": "2026-04-30-bojeong-moons-brunch",
  "res-009": "2026-04-30-yongin-eoryang-jjamppong",
  "res-010": "2026-04-30-baegam-jungang-restaurant",
  "res-011": "2026-04-30-yongin-gokiri-makguksu",
  "res-012": "2026-04-30-yongin-sansarang-review",
  "res-013": "2026-04-30-aloafslicepiece-yongin",
  "res-014": "2026-04-30-yongin-calliope-review",
  "res-015": "2026-04-30-giheung-jangsuchon-review",
  "res-016": "2026-04-30-giheung-owasushi-review",

  // === 교육/강좌 ===
  "edu-001": "2026-04-30-yongin-citizen-university",
  "edu-002": "2026-04-30-yongin-youth-lab",
  "edu-003": "2026-04-30-yongin-senior-it",
  "edu-004": "2026-04-30-yongin-library-special",

  // === 일자리 ===
  "job-001": "2026-04-30-yongin-job-fair",
  "job-002": "2026-04-30-yongin-semiconductor-training",
  "job-003": "2026-04-30-yongin-middle-aged-job",
  // job-004는 블로그 글 없음 → auto-post 페이지 사용

  // === 문화/예술 ===
  "cul-001": "2026-04-30-yongin-matinee-concert",
  "cul-002": "2026-04-30-yongin-njp-art-center",
  "cul-003": "2026-04-30-yongin-city-hall-cinema",
  "cul-004": "2026-04-30-yongin-busking-event",
};

/**
 * 아이디로 블로그 링크 주소를 반환합니다.
 * 매핑이 없으면 /blog/auto-post/{id} 페이지로 이동합니다.
 */
export function getItemBlogLink(itemId: string): string {
  const slug = ITEM_SLUG_MAP[itemId];
  if (slug) return `/blog/${slug}`;
  return `/blog/auto-post/${itemId}`;
}
