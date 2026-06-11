import { useEffect, useState } from "react";
import { TOTAL_DAYS, namesForDay } from "../data.js";
import { EXAM_PASS } from "../lib/quiz.js";

const OFFSETS = ["offset-c", "offset-l", "offset-c", "offset-r"];

const BADGES = [
  { id: "d5", icon: "🌱", labelKey: "badgeD5", earned: (p) => p.completed.length >= 5 },
  { id: "d10", icon: "🌿", labelKey: "badgeD10", earned: (p) => p.completed.length >= 10 },
  { id: "d15", icon: "🌳", labelKey: "badgeD15", earned: (p) => p.completed.length >= 15 },
  { id: "d20", icon: "🏆", labelKey: "badgeD20", earned: (p) => p.completed.length >= 20 },
  { id: "s7", icon: "🔥", labelKey: "badgeS7", earned: (p) => p.streak >= 7 },
  { id: "exam", icon: "🎓", labelKey: "badgeExam", earned: (p) => (p.examScore ?? 0) >= EXAM_PASS },
];

export default function PathScreen({
  progress,
  t,
  dayStatus,
  currentDay,
  daysElapsed,
  onOpenDay,
  onPractice,
  onOpenExam,
}) {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(id);
  }, [toast]);

  const learned = Math.min(
    99,
    progress.completed.reduce((acc, d) => acc + namesForDay(d).length, 0)
  );
  const allDone = progress.completed.length === TOTAL_DAYS;
  const examPassed = (progress.examScore ?? 0) >= EXAM_PASS;
  const behind = currentDay !== null && currentDay < daysElapsed + 1;

  let banner;
  if (allDone && examPassed) banner = t("allDoneSub");
  else if (allDone) banner = t("takeExam");
  else if (currentDay === null) banner = t("comeBack");
  else if (behind) banner = t("catchUp");
  else banner = t("dayOf", currentDay);

  function handleDayClick(day) {
    const st = dayStatus(day);
    if (st === "locked") return setToast(t("lockedMsg"));
    if (st === "locked-date") return setToast(t("lockedDateMsg", day));
    onOpenDay(day, st === "done");
  }

  return (
    <div className="path-wrap">
      <div className="challenge-banner">
        <h2>🏆 {t("challengeTitle")}</h2>
        <p>
          {banner} · {learned}/99 {t("namesLearned")}
        </p>
        <div className="bar">
          <div style={{ width: `${(learned / 99) * 100}%` }} />
        </div>
      </div>

      <div className="badges">
        {BADGES.map((b) => (
          <div key={b.id} className={`badge ${b.earned(progress) ? "" : "locked"}`}>
            {b.icon} {t(b.labelKey)}
          </div>
        ))}
      </div>

      {progress.completed.length >= 1 && (
        <button className="practice-pill" onClick={onPractice}>
          💪 {t("practice")}
        </button>
      )}

      <div className="path">
        {Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1).map((day) => {
          const st = dayStatus(day);
          const names = namesForDay(day);
          const range = `${names[0].n}–${names[names.length - 1].n}`;
          const isCurrent = day === currentDay;
          const icon = st === "done" ? "✓" : st === "available" ? "★" : "🔒";
          return (
            <div key={day} className={`day-node-wrap ${OFFSETS[(day - 1) % 4]}`}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                {isCurrent && <div className="start-bubble">{t("today")}</div>}
                <button
                  className={[
                    "day-node",
                    st === "done" && "done",
                    st.startsWith("locked") && "locked",
                    isCurrent && "current",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => handleDayClick(day)}
                >
                  <span className="icon">{icon}</span>
                  <span className="lbl">
                    {t("day")} {day}
                  </span>
                </button>
                <div className="day-names-hint">{range}</div>
              </div>
            </div>
          );
        })}

        {allDone && (
          <div className="day-node-wrap offset-c">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              {!examPassed && <div className="start-bubble">🎓</div>}
              <button
                className={`day-node exam ${examPassed ? "done" : "current"}`}
                onClick={onOpenExam}
              >
                <span className="icon">{examPassed ? "🏆" : "🎓"}</span>
                <span className="lbl">{t("examNode")}</span>
              </button>
              <div className="day-names-hint">1–99</div>
            </div>
          </div>
        )}
      </div>

      {toast && (
        <div className="feedback" style={{ background: "#fff8e6" }}>
          <h3 style={{ color: "var(--gold-dark)" }}>{toast}</h3>
        </div>
      )}
    </div>
  );
}
