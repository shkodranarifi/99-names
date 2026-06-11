import { useState } from "react";
import { makeT } from "../i18n.js";

export default function Welcome({ onStart }) {
  const [lang, setLang] = useState("en");
  const t = makeT(lang);

  return (
    <div className="welcome">
      <div className="big-emoji">🕌</div>
      <div className="ar-title">أسماء الله الحسنى</div>
      <h1>{t("appTitle")}</h1>
      <p>{t("tagline")}</p>
      <p style={{ fontSize: 14 }}>{t("chooseLang")}</p>
      <div className="lang-pick">
        <button className={lang === "en" ? "sel" : ""} onClick={() => setLang("en")}>
          🇬🇧 English
        </button>
        <button className={lang === "sq" ? "sel" : ""} onClick={() => setLang("sq")}>
          🇦🇱 Shqip
        </button>
      </div>
      <div className="start-wrap">
        <button className="btn gold" onClick={() => onStart(lang)}>
          {t("start")}
        </button>
      </div>
    </div>
  );
}
