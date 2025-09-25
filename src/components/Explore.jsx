import { Link, useLocation } from "react-router-dom";
import "./Explore.css";

const cards = [
  {
    key: "festivals",
    title: "행사 정보",
    desc: "지역별 축제·공연·전시 모아보기",
    to: "/festivals",
    img: "/base/festivalsFirstImg.jpg",
  },
  {
    key: "stays",                     
    title: "숙박 정보",
    desc: "주변 호텔·게스트하우스",
    to: "/stays",                       
    img: "/base/staysFirstImg.jpg",     
  },
  {
    key: "foods",
    title: "맛집 정보",
    desc: "지역 맛집 & 카페",
    to: "/foods",
    img: "/base/foodsFirstImg.jpg",
  },
];

function Explore() {
  const { pathname } = useLocation();
  return (
    <main className="explore page">
      <section className="hero">
        <h2 className="hero__title">where do you want to go?</h2>
        <p className="hero__desc">원하는 정보를 카드에서 찾아보세요.</p>
        <Link to="https://www.google.com/search?q=%EB%9D%BC%ED%91%BC%EC%A0%A4&oq=%EB%9D%BC%ED%91%BC%EC%A0%A4+&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIHCAEQABiABDIHCAIQABiABDIHCAMQLhiABDIKCAQQLhjUAhiABDIGCAUQRRg9MgYIBhBFGDwyBggHEEUYPNIBCDIyODRqMGo3qAIIsAIB&sourceid=chrome&ie=UTF-8" className="cta">Visit to Website</Link>
      </section>

      <section className="grid">
        {cards.map(c => (
          <article className="card" key={c.key}>
            <Link to={c.to} className="card__link" aria-current={pathname===c.to?'page':undefined}>
              <div className="card__imgWrap">
                <img src={c.img} alt={c.title} loading="lazy"/>
              </div>
              <div className="card__body">
                <div className="card__overlay"><h2>{c.title}</h2></div>
                <p>{c.desc}</p>
                <button className="card__btn">Visit</button>
              </div>
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
export default Explore;
