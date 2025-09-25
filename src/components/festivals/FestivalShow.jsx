import { useNavigate, useParams } from "react-router-dom";
import "./FestivalShow.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import { dateFormatter } from "../../utils/dateFormatter.js";
import { setFestivalInfo } from "../../store/slices/festivalShowSlice.js";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=60&auto=format&fit=crop";

function getThumb(item) {
  if (!item) return PLACEHOLDER;
  return item.firstimage || item.firstimage2 || PLACEHOLDER;
}

function FestivalShow() {
  const { id } = useParams(); // /festivals/:id
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const festivalInfo = useSelector((s) => s?.festivalShow?.festivalInfo ?? null);
  const festivalList = useSelector((s) => s?.festival?.list ?? []);

  // 상세정보 세팅
  useEffect(() => {
    if (!Array.isArray(festivalList) || festivalList.length === 0) return;
    const item = festivalList.find((it) => String(it?.contentid) === String(id));
    if (item) {
      dispatch(setFestivalInfo(item));
    }
  }, [id, festivalList, dispatch]);

  // 뒤로가기
  function goBack() {
    if (window.history.length > 1) navigate(-1);
    else navigate("/festivals", { replace: true });
  }

  // 안전 가드 및 파생값
  const title = festivalInfo?.title ?? "";
  const start = festivalInfo?.eventstartdate
    ? dateFormatter.withHyphenYMD(festivalInfo.eventstartdate)
    : "";
  const end = festivalInfo?.eventenddate
    ? dateFormatter.withHyphenYMD(festivalInfo.eventenddate)
    : "";
  const addr1 = (festivalInfo?.addr1 ?? "").trim();
  const addr2 = (festivalInfo?.addr2 ?? "").trim();
  const tel = (festivalInfo?.tel ?? "").trim();
  const homepage = festivalInfo?.homepage || "#";
  const src = useMemo(() => getThumb(festivalInfo), [festivalInfo]);

  const isReady = Boolean(title);

  // 비어있음 UI (가운데 정렬)
  if (!isReady) {
    return (
      <main className="festival-page empty">
        <button className="back-link" onClick={goBack}>← BACK</button>
        <p className="empty__text">페스티벌 상세 데이터를 찾을 수 없어요.</p>
      </main>
    );
  }

  return (
    <main className="festival-page">
      <button className="back-link" onClick={goBack}>← BACK</button>

      <h1 className="festival-title">{title}</h1>

      <section className="festival-row">
        {/* 이미지 */}
        <div className="media">
          <img className="media__img" src={src} alt={title} />
        </div>

      {/* 정보 패널 */}
      <aside className="panel">
        {/* 날짜 */}
        <p className="panel__dates">
          {start || end ? (
            <>
              {start || "미정"} ~ {end || "미정"}
            </>
          ) : (
            "일정 정보 없음"
          )}
        </p>

        {/* 주소 */}
        <p className="panel__addr">
          {addr1}
          {addr2 && (
            <>
              <br />
              {addr2}
            </>
          )}
        </p>

        {/* 전화번호 */}
        <p className="panel__tel">{tel || "전화번호 정보 없음"}</p>

        {/* 액션 버튼 */}
        <div className="panel__actions">
          <a
            className="btn link"
            href={homepage}
            target="_blank"
            rel="noreferrer"
          >
            웹사이트 방문
          </a>
        </div>
      </aside>
    </section>
  </main>
);
}

export default FestivalShow;
