import { useEffect, useState } from "react";
import { TOTAL_DAYS } from "./data.js";
import { makeT } from "./i18n.js";
import { todayStr, daysBetween } from "./lib/dates.js";
import { EXAM_PASS } from "./lib/quiz.js";
import Welcome from "./components/Welcome.jsx";
import Header from "./components/Header.jsx";
import TabBar from "./components/TabBar.jsx";
import PathScreen from "./components/PathScreen.jsx";
import Lesson from "./components/Lesson.jsx";
import ReviewSession from "./components/ReviewSession.jsx";
import FinalExam from "./components/FinalExam.jsx";
import NamesScreen from "./components/NamesScreen.jsx";

const STORE_KEY = "asma99_v1";
const EMPTY = {
  lang: null,
  startDate: null,
  completed: [],
  xp: 0,
  streak: 0,
  lastCompleted: null,
  strength: {}, // { [nameNumber]: { s: 0..5, last: 'YYYY-MM-DD' } }
  examScore: null,
  certName: "",
};

const BADGE_DAYS = [5, 10, 15, 20];

function loadProgress() {
  try {
    return { ...EMPTY, ...JSON.parse(localStorage.getItem(STORE_KEY)) };
  } catch {
    return EMPTY;
  }
}

export default function App() {
  const [progress, setProgress] = useState(loadProgress);
  const [route, setRoute] = useState(() =>
    progress.lang && progress.startDate ? { name: "path" } : { name: "welcome" }
  );

  useEffect(() => {
    if (progress.lang) localStorage.setItem(STORE_KEY, JSON.stringify(progress));
  }, [progress]);

  const t = makeT(progress.lang || "en");
  const daysElapsed = progress.startDate
    ? Math.max(0, daysBetween(progress.startDate, todayStr()))
    : 0;

  // Day N needs the previous day finished AND at least N-1 calendar days since start
  function dayStatus(day) {
    if (progress.completed.includes(day)) return "done";
    const prevDone = day === 1 || progress.completed.includes(day - 1);
    const dateOk = day <= daysElapsed + 1;
    if (prevDone && dateOk) return "available";
    return prevDone ? "locked-date" : "locked";
  }

  function currentDay() {
    for (let d = 1; d <= TOTAL_DAYS; d++) {
      if (dayStatus(d) === "available") return d;
    }
    return null;
  }

  function startChallenge(lang) {
    setProgress((p) => ({ ...p, lang, startDate: p.startDate || todayStr() }));
    setRoute({ name: "path" });
  }

  function toggleLang() {
    setProgress((p) => ({ ...p, lang: p.lang === "en" ? "sq" : "en" }));
  }

  function updateStrength(n, ok) {
    setProgress((p) => {
      const cur = p.strength[n]?.s ?? 0;
      const s = Math.max(0, Math.min(5, cur + (ok ? 1 : -1)));
      return { ...p, strength: { ...p.strength, [n]: { s, last: todayStr() } } };
    });
  }

  function recordCompletion(day, perfect, practice) {
    if (practice) {
      setProgress((p) => ({ ...p, xp: p.xp + 10 }));
      return 10;
    }
    const earned = 50 + (perfect ? 20 : 0);
    setProgress((p) => {
      const today = todayStr();
      let { streak, lastCompleted } = p;
      if (lastCompleted !== today) {
        streak = lastCompleted && daysBetween(lastCompleted, today) === 1 ? streak + 1 : 1;
        lastCompleted = today;
      }
      return { ...p, xp: p.xp + earned, completed: [...p.completed, day], streak, lastCompleted };
    });
    return earned;
  }

  function recordPractice() {
    setProgress((p) => ({ ...p, xp: p.xp + 10 }));
    return 10;
  }

  function recordExam(score, passed) {
    setProgress((p) => {
      const firstPass = passed && (p.examScore ?? 0) < EXAM_PASS;
      return {
        ...p,
        examScore: Math.max(p.examScore ?? 0, score),
        xp: p.xp + (firstPass ? 100 : passed ? 20 : 10),
      };
    });
  }

  function resetProgress() {
    localStorage.removeItem(STORE_KEY);
    setProgress(EMPTY);
    setRoute({ name: "welcome" });
  }

  if (route.name === "welcome") {
    return <Welcome onStart={startChallenge} />;
  }

  if (route.name === "lesson") {
    return (
      <Lesson
        day={route.day}
        practice={route.practice}
        lang={progress.lang}
        t={t}
        strength={progress.strength}
        completed={progress.completed}
        allDoneAfter={!route.practice && progress.completed.length + 1 === TOTAL_DAYS}
        newBadgeAfter={!route.practice && BADGE_DAYS.includes(progress.completed.length + 1)}
        onExit={() => setRoute({ name: "path" })}
        onAnswer={updateStrength}
        onComplete={(perfect) => recordCompletion(route.day, perfect, route.practice)}
      />
    );
  }

  if (route.name === "review") {
    return (
      <ReviewSession
        progress={progress}
        t={t}
        onExit={() => setRoute({ name: "path" })}
        onAnswer={updateStrength}
        onFinish={recordPractice}
      />
    );
  }

  if (route.name === "exam") {
    return (
      <FinalExam
        progress={progress}
        t={t}
        onExit={() => setRoute({ name: "path" })}
        onAnswer={updateStrength}
        onResult={recordExam}
        onSetCertName={(name) => setProgress((p) => ({ ...p, certName: name }))}
      />
    );
  }

  return (
    <>
      <Header progress={progress} t={t} onToggleLang={toggleLang} />
      {route.name === "path" ? (
        <PathScreen
          progress={progress}
          t={t}
          dayStatus={dayStatus}
          currentDay={currentDay()}
          daysElapsed={daysElapsed}
          onOpenDay={(day, practice) => setRoute({ name: "lesson", day, practice })}
          onPractice={() => setRoute({ name: "review" })}
          onOpenExam={() => setRoute({ name: "exam" })}
        />
      ) : (
        <NamesScreen progress={progress} t={t} onReset={resetProgress} />
      )}
      <TabBar active={route.name} t={t} onSelect={(name) => setRoute({ name })} />
    </>
  );
}
