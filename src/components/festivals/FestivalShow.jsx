import { useNavigate, useParams } from "react-router-dom";
import './FestivalShow.css';
import { useDispatch, useSelector } from "react-redux";
import { dateFormatter } from "../../utils/dateFormatter.js";
import { useEffect } from "react";
import { setFestivalInfo } from "../../store/slices/festivalShowSlice.js";

function FestivalShow() {

   const params = useParams();
   const navigate = useNavigate();
   const dispatch = useDispatch();
   const festivalInfo = useSelector(state => state.festivalShow.festivalInfo);
   const festivalList = useSelector(state => state.festival.list);

   useEffect(() => {
     const item = festivalList.find(item => params.id === item.contentid);
     dispatch(setFestivalInfo(item));
   }, []);


   function redirectBack() {
    navigate(-1);
   }

  return (
    <>
      {
       festivalInfo.title && 
       <div className="show-container">
         <button className="show-btn" type="button" onClick={redirectBack}>Back</button>
         <p className="show-title">{festivalInfo.title}</p>
         <p className="card-period">{dateFormatter.withHyphenYMD(festivalInfo.eventstartdate)} ~ {dateFormatter.withHyphenYMD(festivalInfo.eventenddate)}</p>
         <img className="show-img" src={festivalInfo.firstimage} alt={`${festivalInfo.title}사진`} />
         <p className="show-addr"> {`${festivalInfo.addr1}, ${festivalInfo.addr2}`}</p>
       </div>      
      }  
    </>
  )
}

export default FestivalShow;