import { useMemo, useState } from "react";
import { buildReviewQuiz, confetti } from "../lib/quiz.js";
import QuizRunner from "./QuizRunner.jsx";

// Practice mode: 10 questions on the weakest learned names. +10 XP, no streak effect.
export default function ReviewSession({ progress, t, onExit, onAnswer, onFinish }) {
  const items = useMemo(() => buildReviewQuiz(progress.strength, progress.completed), []); // eslint-disable-line react-hooks/exhaustive-deps
  const [result, setResult] = useState(null);

  if (result === null) {
    return (
      <QuizRunner
        items={items}
        lang={progress.lang}
        t={t}
        onExit={onExit}
        onAnswer={onAnswer}
        onFinish={(correctCount) => {
          const earned = onFinish();
          setResult({ correctCount, earned });
          confetti(40);
        }}
      />
    );
  }

  return (
    <div className="lesson">
      <div className="complete-stage">
        <div className="big">💪</div>
        <h2>{t("practiceDone")}</h2>
        <p>{t("practiceSub")}</p>
        <div className="reward-chips">
          <div className="chip">
            ⭐ +{result.earned}
            <span>{t("xpEarned")}</span>
          </div>
          <div className="chip">
            ✅ {result.correctCount}/{items.length}
            <span>{t("score")}</span>
          </div>
        </div>
        <div className="start-wrap">
          <button className="btn gold" onClick={onExit}>
            {t("backToPath")}
          </button>
        </div>
      </div>
    </div>
  );
}
