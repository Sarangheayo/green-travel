const swRegister = () => {
  // 서비스 워커 지원 여부 확인 
 if('serviceWorker' in navigator) {
   navigator.serviceWorker
    .register(
        '/sw.js',
        {
          scope: '/',  
        }
    )
    .then(registration => {
        console.log('서비스 워커 등록 성공', registration);
    })
    .catch(err => {
         console.log('서비스 워커 등록 실패', err);
    });
   } 
}

export default swRegister;