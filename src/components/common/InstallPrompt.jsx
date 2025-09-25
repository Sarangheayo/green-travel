import { useEffect, useRef, useState } from "react";
import useBeforeInstallPrompt from "../../hooks/useBeforeInstallPrompt";
import "./InstallPrompt.css";

export default function InstallPrompt({
  title = "Travel is my life",
  ctaText = "Travel now",
}) {
  const { canInstall, promptInstall, reset } = useBeforeInstallPrompt();
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => { setOpen(canInstall); }, [canInstall]);

  // TOP 위치 수정
  useEffect(() => {
    const root = document.body;
    if (open) {
      root.classList.add("has-install");

      const setOffset = () => {
        const h = boxRef.current?.offsetHeight ?? 110; // fallback
        // 전역 CSS 변수로 배너 높이 주입
        document.documentElement.style.setProperty("--ip-offset", `${h}px`);
      };
      setOffset();
      window.addEventListener("resize", setOffset);
      window.addEventListener("orientationchange", setOffset);

      return () => {
        window.removeEventListener("resize", setOffset);
        window.removeEventListener("orientationchange", setOffset);
        root.classList.remove("has-install");
      };
    } else {
      root.classList.remove("has-install");
    }
  }, [open]);

  if (!open) return null;

  const onInstall = async () => {
    await promptInstall();
    setOpen(false);
    reset();
  };
  const onClose = () => { setOpen(false); reset(); };

  return (
    <div ref={boxRef} className="install-prompt" role="dialog" aria-live="polite">
      <button className="ip-close" onClick={onClose} aria-label="배너 닫기">×</button>
      <div className="ip-title">{title}</div>
      <button className="ip-cta" onClick={onInstall}>{ctaText}</button>
    </div>
  );
}
