import { useEffect } from 'react';
import './App.css';
import Header from './components/common/Header.jsx';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import { localStorageUtil } from './utils/localStorageUtil.js';
import { dateFormatter } from './utils/dateFormatter.js';
import InstallPrompt from "./components/common/InstallPrompt";

function App() {

    useEffect(() => {
    const clearDate = localStorageUtil.getClearDate();
    const nowDate = dateFormatter.formatDateToYMD(new Date());

    // ✅ 첫 실행: 날짜 없으면 저장만 하고 리로드 금지
    if (!clearDate) {
      localStorageUtil.setClearDate(nowDate);
      return;
    }

    // 날짜 바뀐 날에만 비우고 현재 경로로만 새로고침(하루 1회)
    if (clearDate !== nowDate) {
      localStorageUtil.clearLocalstorage();
      localStorageUtil.setClearDate(nowDate);
      // 현재 경로 유지한 채 새로고침
      window.location.replace(window.location.pathname);
    }
  }, []);
    return (
      <>
       <Header />
       <main>
        <Outlet />
       </main>
        <InstallPrompt />
        {/* 스크롤 초기화, 최상위 컴포넌트에 한번만 추가*/}
        <ScrollRestoration />
      </>
  )
}

export default App;
