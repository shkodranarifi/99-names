export default function Header({ progress, t, onToggleLang }) {
  return (
    <div className="header">
      <div className="stat streak">
        🔥 {progress.streak}{" "}
        <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>{t("streakLabel")}</span>
      </div>
      <div className="stat xp">⭐ {progress.xp} XP</div>
      <button className="lang-toggle" onClick={onToggleLang}>
        {progress.lang === "en" ? "🇬🇧 EN" : "🇦🇱 SQ"}
      </button>
    </div>
  );
}
