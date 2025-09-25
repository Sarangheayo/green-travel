import { useEffect, useState } from "react";
import './BeforeInstallPrompt.css';

function BeforeInstallPrompt() {

   const [defferdPrompt, setDefferdPrompt] = useState(null); 

   function handleBeforeInstallPrompt(e)  {
     e.preventDefault(); // 브라우저가 자동으로 설치 팝업을 띄우는 것을 막아준다.
     
     setDefferdPrompt(e); // 이벤트 객체를 state 저장(나중에 설치 과정을 진행하기 위해서)
    }

    async function handleInstall() {
        if(defferdPrompt) {
          // 설치 다이얼 로그 띄우는 친구
          defferdPrompt.prompt();
         
          // 유저의 응답(accepted | dismissed)을 기다리기
          const result = await defferdPrompt.userChoice;

          if(result.outcome === 'accepted') {
            console.log('동의');
          } else {
            console.log('거부');
          }

          // 한 번 사용한 prompt는 재사용이 불가하므로 state 초기화
          setDefferdPrompt(null);
        }
    }
    
   useEffect(() => {
    // 'beforeinstallprompt' 이벤트
    // 브라우저가 `앱 설치가 가능하다`는 조건이 충족되면 발생
    // 이벤트 객체를 state에 저장해두고 나중에 사용자가 설치 버튼을 눌렀을 때,
    // 설치 과정을 진행하도록 유도 
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt );
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt );
    }
   }, []); 

   return (
    <>
     {
       // 설치 가능한 상태일 때만 버튼 출력  
       defferdPrompt && // <button type="button" onClick={handleInstall}>Download</button>
       (
        <div className="prompt-container">
            <p className="prompt-info">Travel is my life</p>
            <button className="prompt-btn" onClick={handleInstall} type="button"> Travel now </button>
        </div>
       )
     }
    </>
   )
}

export default BeforeInstallPrompt;
