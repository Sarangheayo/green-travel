import './Main.css';
import { useNavigate } from 'react-router-dom';

function Main() {
  const navigate = useNavigate();
    return (
      <>
          <img className='title-img' onClick={
          () => {navigate('/festivals')}} 
          src= '/base/titleImg.png' alt = '대문'>       
          </img>
      </>
  )
}

export default Main;
