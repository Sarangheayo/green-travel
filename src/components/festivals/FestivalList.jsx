// src/components/festivals/FestivalList.jsx
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import "./FestivalList.css";
import { festivalIndex, festivalCount } from "../../store/thunks/festivalThunk.js";
import { setScrollEventFlg, resetFestival } from "../../store/slices/festivalSlice.js";
import { selectFestivalListVM } from "../../store/selectors/festivalSelectors.js";
import { dateFormatter } from "../../utils/dateFormatter.js";

// 지역
import { fetchSidos, fetchSigungu } from "../../store/thunks/areaThunk.js";
import { setAreaSelection } from "../../store/slices/areaSlice.js";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=60&auto=format&fit=crop";

const getThumb = (it) => it?.firstimage || it?.firstimage2 || PLACEHOLDER;
const fmt = (d) => (d ? dateFormatter.withHyphenYMD(d) : "");
const periodText = (it) => {
  const s = fmt(it?.eventstartdate);
  const e = fmt(it?.eventenddate);
  if (!s && !e) return "";
  return `${s}${s && e ? " ~ " : ""}${e}`;
};

export default function FestivalList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const list = useSelector(selectFestivalListVM) || [];
  const scrollEventFlg = useSelector((s) => s.festival.scrollEventFlg);
  const totalCount = useSelector((s) => s.festival.totalCount) || 0;

  // 지역 상태
  const sidos = useSelector((s) => s.area.sidos) || [];
  const sigunguMap = useSelector((s) => s.area.sigunguMap) || {};
  const selected = useSelector((s) => s.area.selected) || { areaCode: "", sigunguCode: "" };

  // 검색어
  const [q, setQ] = useState("");

  // 최초 로드
  useEffect(() => {
    dispatch(fetchSidos());
    dispatch(festivalCount());
    if (!list || list.length === 0) dispatch(festivalIndex());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 시/도 변경 → 시군구 갱신
  useEffect(() => {
    if (selected.areaCode) dispatch(fetchSigungu(selected.areaCode));
  }, [dispatch, selected.areaCode]);

  // ✅ 필터 변경 시: Stay처럼 완전 초기화 후 1페이지부터 + 카운트 동기
  useEffect(() => {
    dispatch(resetFestival());
    dispatch(festivalCount({ areaCode: selected.areaCode, sigunguCode: selected.sigunguCode }));
    dispatch(festivalIndex({ areaCode: selected.areaCode, sigunguCode: selected.sigunguCode }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected.areaCode, selected.sigunguCode]);

  // 무한 스크롤
  useEffect(() => {
    const onScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (nearBottom && scrollEventFlg) {
        dispatch(setScrollEventFlg(false));
        dispatch(
          festivalIndex({
            areaCode: selected.areaCode,
            sigunguCode: selected.sigunguCode,
          })
        );
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [dispatch, scrollEventFlg, selected.areaCode, selected.sigunguCode]);

  // 클라측 제목 검색
  const filtered = useMemo(() => {
    const kw = q.trim().toLowerCase();
    if (!kw) return list;
    return (list || []).filter((it) => (it?.title || "").toLowerCase().includes(kw));
  }, [list, q]);

  const sigungus = sigunguMap[selected.areaCode] || [];
  const openShow = (item) => navigate(`/festivals/${item.contentid}`);

  return (
    <main className="festival page">
      {/* 안내문 */}
      <section className="festival-hero">
        <h2 className="festival-hero__title">Find your festival</h2>
        <p className="festival-hero__desc">
          축제 리스트를 아래에서 확인하세요. (총 {totalCount}건)
        </p>
      </section>

      {/* ⬇️ Stay와 동일한 툴바: 시/도 · 시군구 · 검색 + X 버튼 */}
      <section className="toolbar" role="search">
        <div className="filterbar">
          <select
            className="filterbar__select"
            value={selected.areaCode}
            onChange={(e) =>
              dispatch(setAreaSelection({ areaCode: e.target.value, sigunguCode: "" }))
            }
            aria-label="시/도 선택"
          >
            <option value="">전체 시/도</option>
            {sidos.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name}
              </option>
            ))}
          </select>

          <select
            className="filterbar__select"
            value={selected.sigunguCode}
            onChange={(e) =>
              dispatch(
                setAreaSelection({
                   areaCode: selected.areaCode, 
                   sigunguCode: e.target.value,
               })
              )
            }
            aria-label="시군구 선택"
            disabled={!selected.areaCode}  
          >
            <option value="">전체 시군구</option>
              {sigungus.map((g) => (
                <option key={g.code} value={g.code}>{g.name}</option>
              ))} 
          </select>
        </div>

         {/* 검색창 */}
        <div className="search">
          <input
            className="search__input"
            type="search"
            placeholder="축제명 검색"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="축제명 검색"
          />
          {q && (
            <button
              type="button"
              className="search__clear"
              onClick={() => setQ("")}
              aria-label="검색어 지우기"
              title="지우기"
            >
              ×
            </button>
          )}
        </div>
      </section>

      <section className="festival-grid">
        {filtered?.map((item) => (
          <article
            key={item.contentid}
            className="festival-card"
            onClick={() => openShow(item)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === "Enter" ? openShow(item) : null)}
            aria-label={item.title}
          >
            <div className="festival-card__thumb">
              <img src={getThumb(item)} alt={item.title || "축제 이미지"} loading="lazy" />
            </div>
            <div className="festival-card__body">
              <h3 className="festival-card__title">{item.shortTitle ?? item.title}</h3>
              <p className="festival-card__period" style={{ textAlign: "center" }}>
                {periodText(item)}
              </p>
            </div>
          </article>
        ))}
      </section>

      {/* 검색 조건에 맞는 축제가 없거나 API 응답이 비었을 때 */}
      {filtered?.length === 0 && (
        <div className="empty">선택/검색 조건에 해당하는 데이터가 없습니다.</div>
      )}

      <button
        type="button"
        className="btn-top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="맨 위로"
      >
        ↑
      </button>
    </main>
  );
}
