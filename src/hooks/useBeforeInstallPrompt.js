import { useEffect, useState } from "react";

/** PWA 설치 배너용 beforeinstallprompt 이벤트 캡처 */
export default function useBeforeInstallPrompt() {
  const [deferred, setDeferred] = useState(null);

  useEffect(() => {
    const onBeforeInstall = (e) => {
      e.preventDefault();      // 기본 미니바너 막고 우리 배너로
      setDeferred(e);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  const promptInstall = async () => {
    if (!deferred) return { outcome: "dismissed" };
    deferred.prompt();
    const res = await deferred.userChoice; // { outcome: 'accepted' | 'dismissed' }
    setDeferred(null);
    return res;
  };

  return { canInstall: !!deferred, promptInstall, reset: () => setDeferred(null) };
}

