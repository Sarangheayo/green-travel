// public/sw.js
const SW_VERSION = 'v3';
const PRECACHE_NAME = `precache-${SW_VERSION}`;
const RUNTIME_NAME  = `runtime-${SW_VERSION}`;

// 빌드시 알고 있는 정적 파일(원하면 추가)
// Vite라면 index.html만 프리캐시하고, 나머지는 런타임 캐싱 권장
const PRECACHE_URLS = [
  '/',              // navigate 폴백
  '/index.html',
  // '/assets/index-xxxx.js', '/assets/style-xxxx.css' // 정적 경로가 고정이면 명시 가능
];

// 설치: 프리캐시 + 즉시 대기 종료
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      // 프리캐시
      const cache = await caches.open(PRECACHE_NAME);
      await cache.addAll(PRECACHE_URLS);
      // 바로 새 SW 활성화 대기 종료
      await self.skipWaiting();
    })()
  );
});

// 활성화: 이전 버전 캐시 정리 + 즉시 컨트롤
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k !== PRECACHE_NAME && k !== RUNTIME_NAME)
          .map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

// 네트워크 요청 가로채기
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // 0) 외부(origin 다른) 요청은 절대 간섭하지 않음 (TourAPI 등)
  if (url.origin !== self.location.origin) return;

  // 1) POST/PUT 등은 캐시 안 함
  if (req.method !== 'GET') return;

  // 2) SPA 네비게이션은 Network-First → 실패 시 index.html 폴백
  if (req.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          // 최신 index.html 시도
          const fresh = await fetch(req, { cache: 'no-store' });
          // 성공하면 최신 것을 PRECACHE에 갱신해둠
          const cache = await caches.open(PRECACHE_NAME);
          cache.put('/index.html', fresh.clone());
          return fresh;
        } catch {
          // 오프라인/실패 시 프리캐시된 index.html 폴백
          const cache = await caches.open(PRECACHE_NAME);
          const fallback = await cache.match('/index.html');
          return fallback || new Response('Offline', { status: 503 });
        }
      })()
    );
    return;
  }

  // 3) 정적 자산(css/js)와 이미지: Cache-First (Stale-While-Revalidate)
  //    - 캐시가 있으면 즉시 응답
  //    - 백그라운드에서 최신 리소스를 받아 캐시에 갱신
  const isStaticAsset =
    url.pathname.startsWith('/assets/') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.woff2') ||
    url.pathname.endsWith('.woff') ||
    url.pathname.endsWith('.ttf');

  const isImage =
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.jpeg') ||
    url.pathname.endsWith('.gif') ||
    url.pathname.endsWith('.webp') ||
    url.pathname.endsWith('.svg');

  if (isStaticAsset || isImage) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(RUNTIME_NAME);
        const cached = await cache.match(req);
        const fetchAndUpdate = fetch(req)
          .then((res) => {
            // 성공한 것만 캐시에 저장
            if (res && res.status === 200) {
              cache.put(req, res.clone());
            }
            return res;
          })
          .catch(() => null);

        // 캐시가 있으면 즉시 반환 + 백그라운드 업데이트
        if (cached) {
          event.waitUntil(fetchAndUpdate); // 업데이트는 비동기로
          return cached;
        }

        // 캐시 없으면 네트워크로 시도
        const fresh = await fetchAndUpdate;
        if (fresh) return fresh;

        // 오프라인일 때 최소 폴백 (옵션)
        if (isImage) {
          return new Response('', { status: 404 }); // 이미지 폴백 이미지를 쓰고 싶으면 여기서 제공
        }
        return new Response('Offline', { status: 503 });
      })()
    );
    return;
  }

  // 4) 나머지 GET 요청(동일 오리진 API 등)은 Network-First로 통과
  event.respondWith(
    (async () => {
      try {
        return await fetch(req);
      } catch {
        // 오프라인이면 캐시 시도 (있다면)
        const cache = await caches.open(RUNTIME_NAME);
        const cached = await cache.match(req);
        return cached || new Response('Offline', { status: 503 });
      }
    })()
  );
});

// 클라이언트에서 버전 적용 강제
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING' || event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
