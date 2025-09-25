const axiosConfig = {
  
  COMMON: {
    SERVICE_KEY: 'e36f981d63b9ef7a5c198f058a3c7c0b489949c429bd9da5169c1662b310a2e6', 
    MOBILE_OS: 'WEB',
    MOBILE_APP: 'Green Travel',
    TYPE: 'json',
    BASE_URL: 'https://apis.data.go.kr/B551011/KorService2',
  },
  STAY: {
    ENDPOINT: 'searchStay2',   // 숙박 API
    NUM_OF_ROWS: 12,
    ARRANGE: 'O',  //제목순    
  },
};

export default axiosConfig;