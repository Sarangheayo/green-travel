import './App.css';
import Header from './components/common/Header.jsx';
import { Outlet, ScrollRestoration } from 'react-router-dom';

function App() {
    return (
      <>
       <Header></Header>
       <main>
        <Outlet />
       </main>
        {/* 스크롤 초기화, 최상위 컴포넌트에 한번만 추가*/}
        <ScrollRestoration></ScrollRestoration>
      </>

     
  )
}

export default App;
