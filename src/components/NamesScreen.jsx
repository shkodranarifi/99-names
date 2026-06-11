import { TOTAL_DAYS, namesForDay } from "../data.js";

export default function NamesScreen({ progress, t, onReset }) {
  const learned = Math.min(
    99,
    progress.completed.reduce((acc, d) => acc + namesForDay(d).length, 0)
  );

  return (
    <div className="names-wrap">
      <h2>{t("allNames")}</h2>
      <div className="sub">{t("allNamesSub", learned)}</div>

      {Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1).map((day) => {
        const open = progress.completed.includes(day);
        return (
          <div key={day}>
            <div className="day-divider">
              {t("day")} {day}
              {open ? " ✓" : ""}
            </div>
            {namesForDay(day).map((nm) => (
              <div key={nm.n} className={`name-row ${open ? "" : "locked-row"}`}>
                <div className="idx">{nm.n}</div>
                <div className="mid">
                  <div className="t">{open ? nm.translit : "•••"}</div>
                  <div className="m">
                    {open
                      ? `${progress.lang === "sq" ? nm.sq : nm.en} · ${progress.lang === "sq" ? nm.en : nm.sq}`
                      : t("locked")}
                  </div>
                </div>
                <div className="ar">{open ? nm.arabic : "🔒"}</div>
              </div>
            ))}
          </div>
        );
      })}

      <div className="danger-zone">
        <button onClick={() => confirm(t("resetConfirm")) && onReset()}>{t("reset")}</button>
      </div>
    </div>
  );
}
