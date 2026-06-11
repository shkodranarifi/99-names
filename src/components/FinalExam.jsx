import { useState } from "react";
import { buildExam, confetti, EXAM_PASS, EXAM_QUESTIONS } from "../lib/quiz.js";
import { playFanfare } from "../lib/sound.js";
import QuizRunner from "./QuizRunner.jsx";
import Certificate from "./Certificate.jsx";

export default function FinalExam({ progress, t, onExit, onAnswer, onResult, onSetCertName }) {
  const [items, setItems] = useState(() => buildExam(progress.strength));
  const [phase, setPhase] = useState("intro"); // intro | quiz | passed | failed
  const [score, setScore] = useState(null);

  function handleFinish(correctCount) {
    const passed = correctCount >= EXAM_PASS;
    onResult(correctCount, passed);
    setScore(correctCount);
    setPhase(passed ? "passed" : "failed");
    if (passed) {
      playFanfare();
      confetti(140);
    }
  }

  function retry() {
    setItems(buildExam(progress.strength));
    setScore(null);
    setPhase("quiz");
  }

  if (phase === "intro") {
    return (
      <div className="lesson">
        <div className="complete-stage">
          <div className="big">🎓</div>
          <h2>{t("examTitle")}</h2>
          <p>{t("examIntroSub")}</p>
          <div className="start-wrap">
            <button className="btn blue" onClick={() => setPhase("quiz")}>
              {t("startExam")}
            </button>
            <button className="btn ghost" style={{ marginTop: 12 }} onClick={onExit}>
              {t("backToPath")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "quiz") {
    return (
      <QuizRunner
        items={items}
        lang={progress.lang}
        t={t}
        onExit={onExit}
        onAnswer={onAnswer}
        onFinish={handleFinish}
      />
    );
  }

  if (phase === "failed") {
    return (
      <div className="lesson">
        <div className="complete-stage">
          <div className="big">😅</div>
          <h2>{t("examFail")}</h2>
          <p>{t("examFailSub", score)}</p>
          <div className="reward-chips">
            <div className="chip">
              ✅ {score}/{EXAM_QUESTIONS}
              <span>{t("score")}</span>
            </div>
          </div>
          <div className="start-wrap">
            <button className="btn" onClick={retry}>
              {t("tryAgain")}
            </button>
            <button className="btn ghost" style={{ marginTop: 12 }} onClick={onExit}>
              {t("backToPath")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Certificate progress={progress} t={t} score={score} onExit={onExit} onSetName={onSetCertName} />
  );
}
