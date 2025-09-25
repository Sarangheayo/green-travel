import { useNavigate, useParams } from "react-router-dom";
import "./StayShow.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setStayInfo } from "../../store/slices/stayShowSlice.js";

function StayShow() {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const stayInfo = useSelector((state) => state.stayShow.stayInfo);
  const stayList = useSelector((state) => state.stay.list);

  useEffect(() => {
    const item = stayList.find((item) => params.id === item.contentid);
    if (item) {
      dispatch(setStayInfo(item));
    }
  }, []);

  function goBack() {
      if (window.history.length > 1) navigate(-1);
      else navigate("/stays", { replace: true });
  }

  return (
    <>
      {stayInfo?.title && (
        <div className="stay-page">
          <button className="back-link" onClick={goBack}>← BACK</button>

          <div className="stay-title">{stayInfo.title}</div>

          <div className="stay-row">
            {/* 이미지 */}
            <div className="media">
              <img className="media__img" src={stayInfo.firstimage} alt={stayInfo.title} />
            </div>

            {/* 정보 컨테이너 */}
            <aside className="panel">
             <p className="panel__addr">
                {(stayInfo.addr1 ?? "").trim()}
                {stayInfo.addr2 && (
                  <>
                    <br />
                    {(stayInfo.addr2 ?? "").trim()}
                  </>
                )}
              </p>
              <p className="panel__tel">{stayInfo.tel ?? "전화번호 정보 없음"}</p>

              <div className="panel__actions">
                <a className="btn link" href={stayInfo.homepage ?? "#"} target="_blank" rel="noreferrer">
                  웹사이트 방문
                </a>
                <a className="btn primary" href={stayInfo.reservationUrl ?? "#"} target="_blank" rel="noreferrer">
                  예약 바로가기
                </a>
              </div>
            </aside>
          </div>
        </div>
      )}
    </>
  );
}

export default StayShow;