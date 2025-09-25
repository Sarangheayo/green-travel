import { useEffect, useMemo, useRef, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { stayIndex, stayCount } from "../../store/thunks/stayThunk";
import { fetchSidos, fetchSigungu } from "../../store/thunks/areaThunk";
import { setAreaSelection } from "../../store/slices/areaSlice";
import { resetStay } from "../../store/slices/staySlice";
import "./StayList.css";
import { ListTitleLimit } from "../../utils/ListTitleLimit.js";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=60&auto=format&fit=crop";

const getThumb = (item) => item?.firstimage || item?.firstimage2 || PLACEHOLDER;

export default function StayList() {
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  // stay
  const list = useSelector((s) => s?.stay?.list ?? []);
  const page = useSelector((s) => s?.stay?.page ?? 1);
  const totalCount = useSelector((s) => s?.stay?.totalCount ?? 0);
  const loading = useSelector((s) => s?.stay?.loading ?? false);
  const canScroll = useSelector((s) => s?.stay?.scrollEventFlg ?? true);
  const error = useSelector((s) => s?.stay?.error ?? null);

  // area
  const sidos = useSelector((s) => s?.area?.sidos ?? []);
  const sigunguMap = useSelector((s) => s?.area?.sigunguMap ?? {});
  const selectedArea = useSelector((s) => s?.area?.selected ?? { areaCode: "", sigunguCode: "" });

  // 검색어
  const [q, setQ] = useState("");

  // 최신 canScroll
  const canScrollRef = useRef(canScroll);
  useEffect(() => { canScrollRef.current = canScroll; }, [canScroll]);

  // 최초 진입: 주소옵션/카운트/1페이지
  useEffect(() => {
    dispatch(fetchSidos());
    // 첫 페이지/카운트 로드
    dispatch(stayCount({}));            // 전체 카운트
    if (!Array.isArray(list) || list.length === 0) {
      dispatch(stayIndex({ pageNo: 1 })); // 전체에서 1페이지
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, dispatch]);

  useEffect(() => {
    console.log(`[Stay] page=${page} list=${list.length} total=${totalCount} loading=${loading} err=${error}`);
  }, [page, list.length, totalCount, loading, error]);

  // 무한스크롤
  const sentinelRef = useRef(null);
  const loadMore = useCallback(() => {
    if (loading) return;
    if (!canScrollRef.current) return;
    if (totalCount > 0 && list.length >= totalCount) return;

    const { areaCode, sigunguCode } = selectedArea;
    dispatch(stayIndex({ pageNo: (page ?? 1) + 1, areaCode, sigunguCode }));
  }, [dispatch, loading, list.length, page, totalCount, selectedArea]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) =>
        es.some((e) => e.isIntersecting) &&
        canScrollRef.current &&
        !loading &&
        loadMore(),
      { root: null, rootMargin: "0px 0px 400px 0px", threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [loadMore, loading]);

  // 시/도 변경
  const onChangeSido = async (e) => {
    const areaCode = e.target.value;
    // 선택 상태 반영
    dispatch(setAreaSelection({ areaCode, sigunguCode: "" }));
    if (areaCode) dispatch(fetchSigungu(areaCode));

    // 리스트 리셋 후 해당 조건으로 새로 카운트/첫 페이지
    dispatch(resetStay());
    dispatch(stayCount({ areaCode }));
    dispatch(stayIndex({ pageNo: 1, areaCode }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 시군구 변경
  const onChangeSigungu = (e) => {
    const sigunguCode = e.target.value;
    const { areaCode } = selectedArea;

    dispatch(setAreaSelection({ areaCode, sigunguCode }));

    dispatch(resetStay());
    dispatch(stayCount({ areaCode, sigunguCode }));
    dispatch(stayIndex({ pageNo: 1, areaCode, sigunguCode }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 검색(클라 필터: 제목/주소에 포함)
  const filteredList = useMemo(() => {
    const ql = q.trim().toLowerCase();
    if (!ql) return list;
    return list.filter((it) => {
      const title = String(it?.title ?? "").toLowerCase();
      const addr = String(it?.addr1 ?? "").toLowerCase();
      return title.includes(ql) || addr.includes(ql);
    });
  }, [list, q]);

  // 카드 변환
  const cards = useMemo(
    () =>
      (filteredList ?? []).map((it) => ({
        id: String(it?.contentid ?? ""),
        title: it?.title ?? "",
        addr: it?.addr1 ?? "",
        img: getThumb(it),
      })),
    [filteredList]
  );

  // 옵션
  const sigunguOptions = selectedArea.areaCode ? (sigunguMap[selectedArea.areaCode] ?? []) : [];

return (
  <main className="stay page">
    <section className="stay-hero">
      <h2 className="stay-hero__title">Find your stay</h2>
      <p className="stay-hero__desc">
        숙박 리스트를 아래에서 확인하세요. (총 {totalCount || 0}건)
      </p>

      {/* 상단 툴바: 지역 필터 + 검색 */}
      <div className="toolbar">
        <div className="filterbar" role="group" aria-label="지역 필터">
          {/* 시/도 선택 */}
          <select
            className="filterbar__select"
            value={selectedArea.areaCode}
            onChange={onChangeSido}
            aria-label="시/도 선택"
          >
            <option value="">전체 시/도</option>
            {sidos.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name}
              </option>
            ))}
          </select>

          {/* 시군구 선택 (시/도 선택 시만 활성화) */}
          <select
            className="filterbar__select"
            value={selectedArea.sigunguCode}
            onChange={onChangeSigungu}
            aria-label="시/군/구 선택"
            disabled={!selectedArea.areaCode}
          >
            <option value="">전체 시/군/구</option>
            {sigunguOptions.map((x) => (
              <option key={x.code} value={x.code}>
                {x.name}
              </option>
            ))}
          </select>
        </div>

        {/* 검색 */}
        <div className="search">
          <input
            className="search__input"
            type="search"
            placeholder="제목/주소 검색"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="검색어 입력"
          />
          {q && (
            <button
              type="button"
              className="search__clear"
              onClick={() => setQ("")}
              aria-label="검색어 지우기"
              title="검색어 지우기"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* 맨 위로 버튼 */}
      <button
        type="button"
        className="btn-top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="맨 위로"
      >
        ↑
      </button>

      {error && <div className="alert">요청 실패: {String(error)}</div>}
    </section>

    {/* 숙박 카드 리스트 */}
    <section className="stay-grid">
      {cards.map((c) => (
        <Link key={c.id} to={`/stays/${c.id}`} className="stay-card">
          <div className="stay-card__thumb">
            <img src={c.img} alt={c.title} loading="lazy" />
          </div>
          <div className="stay-card__body">
            <h3 className="stay-card__title">{ListTitleLimit(c.title, 10)}</h3>
            <p className="stay-card__addr">{ListTitleLimit(c.addr, 36)}</p>
          </div>
        </Link>
      ))}

      {loading &&
        Array.from({ length: 6 }).map((_, i) => (
          <div className="stay-card stay-card--skeleton" key={`sk-${i}`}>
            <div className="stay-card__thumb skeleton" />
            <div className="stay-card__body">
              <div className="skeleton line w-70" />
              <div className="skeleton line w-50" />
              <div className="skeleton chiprow" />
            </div>
          </div>
        ))}
    </section>

    {/* 무한스크롤 센티넬 */}
    <div style={{ height: 220 }} />
    <div ref={sentinelRef} style={{ height: 1 }} />

    {/* 데이터 없음 안내 */}
    {!loading && !error && (cards?.length ?? 0) === 0 && (
      <div className="empty">선택/검색 조건에 해당하는 데이터가 없습니다.</div>
    )}
  </main>
);
}