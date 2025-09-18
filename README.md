# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



**PWA 적용**

1. 설치      
   - npm i -D vite-plugin-pwa

2. manifest 설정
   - `Vite.config.js`에 PWA Mainifest 설정을 추가
   - 아이콘 이미지는 아래의 사이즈 별로 필요
      - 180x180(IOS), 192x192(WEB | Android), 512x512((WEB | Android)) 

3. 서비스 워커 작성
   - `/src/sw.js`, `src/swRegister.js` 파일 생성

4. `src/main.jsx`에 서비스 워커 레지스터 추가

5.  `index.html`에 meta데이터 설정(IOS 대응 및 Manifest 기본 설정)

6. 위 설정 완료 후 빌드
    npm run build

7. build 한 것으로 동작하는 내장서버 실행
    npm run preview