# SafeD 웹사이트 프론트엔드 기술 입증자료

> **프로젝트:** SafeD 기업 웹사이트 (safed.co.kr)
> **역할:** 프론트엔드 전체 설계 및 구현
> **기간:** 2025 ~
> **빌드 상태:** Production (Static Site Generation)

---

## 1. 기술 스택 총괄

| 영역 | 기술 | 버전 | 용도 |
|------|------|------|------|
| **프레임워크** | Astro | 5.17 | SSG 기반 Island Architecture |
| **UI 라이브러리** | React | 19.2 | 인터랙티브 컴포넌트 (캐러셀, 폼, 패럴랙스) |
| **스타일링** | Tailwind CSS | 4.2 | Lightning CSS 엔진 기반 유틸리티 CSS |
| **애니메이션** | Framer Motion | 12.34 | React 컴포넌트 모션 (Ken Burns, 페이드, 스케일) |
| **캐러셀** | Swiper | 12.1 | 터치 슬라이더 (FreeMode, Autoplay) |
| **HTTP** | Axios | 1.13 | API 통신 (문의 폼 전송) |
| **검색** | Fuse.js | 7.1 | 클라이언트 사이드 퍼지 검색 |
| **콘텐츠** | @astrojs/mdx | 5.0 | MDX 기반 블로그 시스템 |
| **SEO** | @astrojs/sitemap | 3.7 | 자동 사이트맵 생성 |
| **피드** | @astrojs/rss | 4.0 | RSS 피드 생성 |
| **QA 자동화** | Puppeteer Core | 24.40 | 멀티뷰포트 스크린샷 캡처 |
| **폰트** | Pretendard, DM Sans | - | 한국어/영문 듀얼 타이포그래피 |

---

## 2. 프로젝트 규모

| 항목 | 수량 |
|------|------|
| 정적 페이지 | 15개 |
| 동적 라우트 (블로그) | 4개 (`[slug]`, `[...page]`, `tags/[tag]`, `tags/index`) |
| Astro 컴포넌트 | 20개 |
| React (TSX) 컴포넌트 | 9개 |
| 레이아웃 | 3개 (Base, SubPage, BlogPost) |
| CSS 커스텀 키프레임 | 14개 이상 |
| 반응형 브레이크포인트 | 3단계 (Mobile / Tablet / Desktop) |

---

## 3. 페이지별 구현 상세

### 3.1 메인 페이지 (`index.astro`)

| 섹션 | 구현 기술 |
|------|-----------|
| Hero SlideShow | Framer Motion Ken Burns 효과, 자동재생 6초, 프로그래스바, 이미지 프리로딩 |
| Pin Scroll Section | IntersectionObserver 기반 Sticky 좌측 패널 + 우측 스크롤, 모바일 스와이프 캐러셀 |
| Feature Carousel | 3D Perspective 캐러셀, 원형 회전, 자동재생 4초 |
| Testimonial Carousel | 2-그리드 카드, 별점 시스템, 자동 로테이션 |
| Multi Slide | Swiper FreeMode + Autoplay, 반응형 slidesPerView |

### 3.2 SafeD Features (`safed-features.astro`)

| 섹션 | 구현 기술 |
|------|-----------|
| Features Infographic | CSS Grid 3단 (카드 - 폰목업 - 카드), SVG 커넥션 라인 |
| Phone Mockup | 순수 CSS iPhone 15 Pro 목업 (268x580px), Dynamic Island |
| Feature Cards | 8장 카드 (좌4 / 우4), IntersectionObserver 진입 애니메이션 |
| Connection Lines | `getBoundingClientRect()` 동적 좌표 계산, hover 하이라이트 |

### 3.3 Welcome 페이지 (`welcome.astro`)

시네마틱 저니 애니메이션 (스크롤 기반 시퀀스), `hj-*` 프리픽스 CSS 클래스 체계

### 3.4 블로그 시스템

| 기능 | 구현 |
|------|------|
| Content Collection | Zod 스키마 검증, MDX 렌더링 |
| 목록 페이지 | 9개/페이지 페이지네이션, 3단 그리드 |
| 상세 페이지 | 2단 레이아웃 (Prose + Sticky TOC) |
| 태그 시스템 | 동적 라우트 생성, 태그별 필터링 |
| RSS | `/rss.xml` 자동 생성 |
| 관련 글 | 태그 매칭 알고리즘으로 관련도 순 정렬 |

---

## 4. 프론트엔드 핵심 구현 기술

### 4.1 애니메이션 시스템

```
구현한 애니메이션 유형:
- Ken Burns (확대/이동 조합) — SlideShow.tsx
- 3D Perspective Tilt — CardParallax.tsx
- Scroll-Triggered Reveal — IntersectionObserver + CSS transform
- Opacity Crossfade — Framer Motion AnimatePresence
- Staggered Entry — 100~800ms 딜레이 순차 진입
- Progress Bar — requestAnimationFrame 기반 세그먼트 바
- Marquee — CSS @keyframes infinite 수평 스크롤
- Glassmorphism — backdrop-filter: blur() + rgba
```

### 4.2 반응형 설계

```
데스크톱 (≥1024px):
- 3~4단 그리드, Sticky 레이아웃, 풀사이즈 캐러셀
- TOC 사이드바 노출, SVG 커넥션 라인 표시

태블릿 (640~1024px):
- 2단 그리드, 캐러셀 slidesPerView 조정
- 네비게이션 → 햄버거 전환 (999px)

모바일 (<640px):
- 1단 레이아웃, 터치 스와이프 제스처
- 클램프 타이포그래피 (clamp 함수)
- TOC/커넥션 라인 비표시
```

### 4.3 성능 최적화

| 기법 | 적용 위치 |
|------|-----------|
| Image Preloading | SlideShow — `new Image()` useEffect |
| Lazy Loading | 카드 이미지 `loading="lazy"` |
| Island Hydration | `client:load` (즉시), `client:visible` (뷰포트 진입 시) |
| Carousel Culling | FeatureCarousel — 화면 밖 카드 미렌더링 |
| useCallback Memoization | 이벤트 핸들러 재생성 방지 |
| Passive Event Listener | 스크롤/리사이즈 이벤트 `{ passive: true }` |

### 4.4 SEO / 메타데이터

| 항목 | 구현 |
|------|------|
| JSON-LD | Organization, WebSite, SoftwareApplication 스키마 |
| Open Graph | og:title, og:description, og:image, og:url |
| Twitter Card | summary_large_image |
| Canonical URL | 페이지별 자동 생성 |
| Sitemap | @astrojs/sitemap 자동 생성 |
| RSS Feed | @astrojs/rss 블로그 피드 |
| Naver Search Advisor | 네이버 사이트 검증 메타 |
| robots | 페이지별 noindex 옵션 |

### 4.5 커스텀 스크롤바

네이티브 스크롤바를 완전히 숨기고, JavaScript로 커스텀 오버레이 스크롤바 구현:
- 배경 밝기 감지 (`elementFromPoint` + 휘도 계산) → 밝은/어두운 섹션에서 자동 색상 전환
- 호버 시 트랙 배경 + 썸 확대 (3px → 5px)
- 1.2초 후 자동 페이드아웃
- 클릭-투-스크롤 (트랙 클릭 → smooth scroll 이동)

### 4.6 폼 처리 (`ContactForm.tsx`)

- 실시간 유효성 검사 (이메일 정규식, 전화번호 자동 포맷팅)
- 필드별 터치 기반 에러 표시
- Axios POST → API 엔드포인트 통신
- 성공/실패 토스트 메시지
- 폼 리셋 및 상태 관리 (useReducer 패턴)

---

## 5. CSS 아키텍처

### 디자인 시스템 (`global.css`)

```css
/* 컬러 토큰 */
--color-primary: #007BFF
--color-secondary: #20275a
--color-accent: #ff6f61
--color-gray-[100~900]: 9단계 그레이스케일

/* 타이포그래피 */
Pretendard Variable (한국어) + DM Sans (영문/숫자)
font-feature-settings: 'tnum' (탭 숫자 정렬)

/* 유틸리티 클래스 */
.reveal / .reveal-left / .reveal-right / .reveal-scale
.text-gradient / .glass / .glass-dark / .glow
.hero-headline (clamp 2.5rem ~ 5rem)
.counter-num (탭 숫자)
.sticky-section
```

### 스코프 전략

- **글로벌:** `global.css` → 디자인 토큰, 리셋, 유틸리티
- **컴포넌트:** `.astro` 파일 내 `<style>` → 자동 스코프 (BEM-like 프리픽스)
- **다이나믹:** React 인라인 스타일 → Framer Motion transform 값
- **바이패스:** `<style is:inline>` → Tailwind v4 파이프라인 우회 (스크롤바 등)

---

## 6. 개발 자동화

### QA 스크린샷 도구 (`scripts/capture-qa.mjs`)

Puppeteer Core 기반 자동화 스크립트:
- 15개 페이지 x 2개 뷰포트 (Desktop 1440px / Mobile 390px) = 30장 캡처
- 각 페이지별 상태 코드, 파일 크기, 로딩 시간 측정
- HTML 대시보드 자동 생성 (그리드 갤러리)
- 브라우저 자동 실행

---

## 7. 파일 구조

```
safed-astro/
├── astro.config.mjs              # Astro 설정 (React, MDX, Sitemap, Shiki)
├── package.json                   # 13개 런타임 의존성
├── src/
│   ├── content/
│   │   ├── config.ts              # Zod 스키마 (블로그 컬렉션)
│   │   └── blog/                  # MDX 포스트 파일
│   ├── layouts/
│   │   ├── BaseLayout.astro       # 마스터 레이아웃 (SEO, JSON-LD, 스크롤바)
│   │   ├── SubPageLayout.astro    # 서브페이지 레이아웃
│   │   └── BlogPostLayout.astro   # 블로그 상세 레이아웃
│   ├── pages/                     # 15개 정적 + 4개 동적 라우트
│   ├── components/
│   │   ├── common/    (6)         # GNB, Footer, FixedButtons, HorizontalNav
│   │   ├── ui/        (9+ TSX)   # SlideShow, PinScroll, FeatureCarousel, ContactForm
│   │   ├── safed/     (5)         # 폰 목업, 피처카드, SVG 커넥션
│   │   └── blog/      (6)         # PostCard, TOC, Pagination, TagBadge
│   ├── utils/
│   │   └── blog.ts                # 날짜, 읽기시간, 정렬, 필터, 관련글 알고리즘
│   └── styles/
│       └── global.css             # 디자인 시스템 + 14개 키프레임
├── public/images/                 # 20개+ 이미지 에셋
└── scripts/
    └── capture-qa.mjs             # Puppeteer QA 자동화
```

---

## 8. 프론트엔드 역량 요약

### 직접 구현한 기술 영역

| 영역 | 세부 내용 |
|------|-----------|
| **프레임워크 설계** | Astro 5 Island Architecture 기반 SSG 사이트 설계 |
| **컴포넌트 개발** | React 19 + TypeScript 기반 인터랙티브 UI 9개 컴포넌트 |
| **애니메이션** | Framer Motion + CSS @keyframes 복합 모션 시스템 |
| **반응형 UI** | Mobile-first 3단 브레이크포인트, 터치 제스처, clamp 타이포 |
| **CSS 설계** | Tailwind v4 + 커스텀 디자인 시스템, 스코프 전략 |
| **SEO** | JSON-LD 구조화 데이터, OG/Twitter 메타, Sitemap, RSS |
| **폼 처리** | 실시간 밸리데이션, API 통신, 에러 핸들링 |
| **블로그 시스템** | MDX Content Collection, 페이지네이션, 태그, TOC, 관련 글 |
| **성능 최적화** | 이미지 프리로딩, Island Hydration, Lazy Loading, Passive Events |
| **DX 자동화** | Puppeteer QA 캡처 스크립트, 멀티뷰포트 테스트 |
| **접근성** | ARIA 라벨, 시맨틱 HTML, 키보드 내비게이션 |
| **커스텀 UX** | 밝기 감지 스크롤바, 3D 패럴랙스, 스크롤 리빌 시스템 |

---

*이 문서는 SafeD 웹사이트(safed.co.kr) 프론트엔드 전체를 단독으로 설계 및 구현했음을 기술적으로 입증하기 위해 작성되었습니다.*
