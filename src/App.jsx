import { useEffect } from 'react';
import './App.css';
import Header from './components/common/Header.jsx';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import { localStorageUtil } from './utils/localStorageUtil.js';
import { dateFormatter } from './utils/dateFormatter.js';
import BeforeInstallPrompt from './components/BeforeInstallPrompt.jsx';
import InstallPrompt from './components/InstallPrompt.jsx';


function App() {

    useEffect(() => {
    // 로컬 스토리지에 저장된 날짜를 획득
    const clearDate = localStorageUtil.getClearDate();
    const nowDate = dateFormatter.formatDateToYMD(new Date());
    
    // 로컬 스토리지의 날짜와 오늘 날짜가 다를 경우 
    if(clearDate !== nowDate) {
      localStorageUtil.clearLocalstorage();
      localStorageUtil.setClearDate(nowDate);
      
      // state가 초기화 되지 않는 현상을 해결하기 위해, 강제로 화면 새로고침
      window.location.reload();
    }
       // 저장된 날짜 없으면 로컬 스토리지에 현재 날짜 저장

    // 날짜가 과거면 로컬 스토리지 및 스테이트 초기화
    // 아직 과거가 아니면 처리 속행
    }, []);

    return (
      <>
       <InstallPrompt />
       <BeforeInstallPrompt />
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
