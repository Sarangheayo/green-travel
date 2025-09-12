import './Main.css';
import TitelImg from '../assets/Card.png';
import { useNavigate } from 'react-router-dom';

function Main() {
  const navigate = useNavigate();
    return (
      <>
          <img className='title-img' onClick={
          () => {navigate('/festivals')}} 
          src={TitelImg} alt = '대문'>       
          </img>
      </>
  )
}

export default Main;
