import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import "./Header.css";

export default function Header() {
  const { pathname } = useLocation();
  const wrapRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const active = wrap.querySelector(".gt-link.active");
    if (!active) return;

    // 활성 탭이 항상 왼쪽 패딩 안쪽에 보이도록
    const leftPadding = 16; 
    const target = active.offsetLeft - leftPadding;
    wrap.scrollTo({ left: target, behavior: "smooth" });
  }, [pathname]);

  return (
    <header className="gt-header">
      <div className="gt-header__inner">
        <Link to="/" className="gt-brand">Green Travel</Link>

        <nav className="gt-nav" ref={wrapRef}>
          <NavLink to="/explore" className="gt-link">Explore</NavLink>
          <NavLink to="/festivals" className="gt-link">Festivals</NavLink>
          <NavLink to="/stays" className="gt-link">Stays</NavLink>
          <NavLink to="/foods" className="gt-link">Foods</NavLink>
        </nav>
      </div>
    </header>
  );
}