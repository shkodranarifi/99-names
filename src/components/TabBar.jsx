export default function TabBar({ active, t, onSelect }) {
  return (
    <div className="tabbar">
      <button className={active === "path" ? "active" : ""} onClick={() => onSelect("path")}>
        <span className="ticon">🌙</span>
        {t("learnTab")}
      </button>
      <button className={active === "names" ? "active" : ""} onClick={() => onSelect("names")}>
        <span className="ticon">📖</span>
        {t("namesTab")}
      </button>
    </div>
  );
}
