import './Main.css';
import { useNavigate } from 'react-router-dom';


function Main() {
  const navigate = useNavigate();
    return (
      <>
        <h1 className="hero-title">Green Travel</h1>
        <img
         className='title-img'
         onClick={() => {navigate("explore")}} 
         src= "/base/titleImg.jpg"
         alt = "대문"
        />
        <p className='hamsterSay'>나랑 여행 떠날 사람! 손! 🐹🤚 </p>
      </>
  )
}

export default Main;
