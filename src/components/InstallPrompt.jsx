
import React, { useEffect, useState } from "react";

function InstallPrompt() {
  const [promptEvent, setPromptEvent] = useState(null);

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault(); // 브라우저 기본 설치 배너 막기
      setPromptEvent(e);  // 이벤트 저장
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (!promptEvent) return;

    promptEvent.prompt(); // 설치 다이얼로그 띄우기
    const { outcome } = await promptEvent.userChoice;

    if (outcome === "accepted") {
      console.log("✅ 설치 동의");
    } else {
      console.log("❌ 설치 거부");
    }

    setPromptEvent(null); // 한번 쓰면 이벤트 초기화
  };

  return (
    <>
      {promptEvent && (
        <button  className='install-btn' type="button" onClick={handleInstall}>앱 설치하기</button>
      )}
    </>
  );
}

export default InstallPrompt;