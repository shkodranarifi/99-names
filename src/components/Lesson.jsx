import { useMemo, useState } from "react";
import { namesForDay } from "../data.js";
import { buildQuiz, speakArabic, confetti } from "../lib/quiz.js";
import { playFanfare } from "../lib/sound.js";
import QuizRunner from "./QuizRunner.jsx";

function LessonTop({ progress, onExit }) {
  return (
    <div className="lesson-top">
      <button
        className="close"
        onClick={() => {
          speechSynthesis.cancel();
          onExit();
        }}
      >
        ✕
      </button>
      <div className="progressbar">
        <div style={{ width: `${progress * 100}%` }} />
      </div>
    </div>
  );
}

function Flashcard({ name, lang, t }) {
  const [flipped, setFlipped] = useState(false);
  const primary = lang === "sq" ? name.sq : name.en;
  const secondary = lang === "sq" ? name.en : name.sq;
  const secFlag = lang === "sq" ? "🇬🇧 English" : "🇦🇱 Shqip";

  return (
    <div className={`flashcard ${flipped ? "flipped" : ""}`} onClick={() => setFlipped((f) => !f)}>
      <div className="flashcard-inner">
        <div className="face front">
          <span className="num-chip">{name.n} / 99</span>
          <div className="arabic">{name.arabic}</div>
          <div className="translit">{name.translit}</div>
          <button
            className="speak-btn"
            onClick={(e) => {
              e.stopPropagation();
              speakArabic(name.arabic);
            }}
          >
            🔊
          </button>
          <div className="tap-hint">👆 {t("tapToFlip")}</div>
        </div>
        <div className="face back">
          <span className="num-chip">{name.n} / 99</span>
          <div className="arabic">{name.arabic}</div>
          <div className="translit">{name.translit}</div>
          <div className="meaning">{primary}</div>
          <div className="flag">{secFlag}</div>
          <div className="meaning-2">{secondary}</div>
        </div>
      </div>
    </div>
  );
}

export default function Lesson({
  day,
  practice,
  lang,
  t,
  strength,
  completed,
  allDoneAfter,
  newBadgeAfter,
  onExit,
  onAnswer,
  onComplete,
}) {
  const names = namesForDay(day);
  // Built once per lesson from the strength snapshot at entry.
  const items = useMemo(() => buildQuiz(day, strength, completed), [day]); // eslint-disable-line react-hooks/exhaustive-deps
  const [phase, setPhase] = useState("cards"); // cards | intro | quiz | done
  const [idx, setIdx] = useState(0);
  const [result, setResult] = useState(null);

  function handleQuizDone(correctCount) {
    const perfect = correctCount === items.length;
    const earned = onComplete(perfect);
    // Capture milestone flags now — progress updates would flip them on re-render.
    setResult({ correctCount, earned, perfect, allDone: allDoneAfter, newBadge: newBadgeAfter });
    setPhase("done");
    playFanfare();
    confetti(allDoneAfter ? 140 : 70);
  }

  if (phase === "cards") {
    const name = names[idx];
    const isLast = idx === names.length - 1;
    return (
      <div className="lesson">
        <LessonTop progress={(idx + 1) / (names.length + 1)} onExit={onExit} />
        <div className="card-stage">
          {/* key resets the flip state when moving to the next name */}
          <Flashcard key={name.n} name={name} lang={lang} t={t} />
          <div className="card-nav">
            {idx > 0 && (
              <button className="btn ghost" style={{ width: "40%" }} onClick={() => setIdx(idx - 1)}>
                {t("back")}
              </button>
            )}
            <button className="btn" onClick={() => (isLast ? setPhase("intro") : setIdx(idx + 1))}>
              {isLast ? t("startQuiz") : t("next")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "intro") {
    return (
      <div className="lesson">
        <LessonTop progress={0.78} onExit={onExit} />
        <div className="complete-stage">
          <div className="big">📝</div>
          <h2>{t("quizIntro")}</h2>
          <p>{t("quizIntroSub")}</p>
          <div className="start-wrap">
            <button className="btn blue" onClick={() => setPhase("quiz")}>
              {t("startQuiz")}
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
        lang={lang}
        t={t}
        onExit={onExit}
        onAnswer={onAnswer}
        onFinish={handleQuizDone}
      />
    );
  }

  // done
  const title = result.allDone ? t("allDone") : t("lessonDone");
  const sub = result.allDone ? t("allDoneSub") : t("lessonDoneSub", day);
  return (
    <div className="lesson">
      <div className="complete-stage">
        <div className="big">{result.allDone ? "🏆" : "🎉"}</div>
        <h2>{title}</h2>
        <p>{sub}</p>
        <div className="reward-chips">
          <div className="chip">
            ⭐ +{result.earned}
            <span>{t("xpEarned")}</span>
          </div>
          <div className="chip">
            ✅ {result.correctCount}/{items.length}
            <span>{t("score")}</span>
          </div>
          {result.perfect && (
            <div className="chip">
              💎<span>{t("perfectBonus")}</span>
            </div>
          )}
          {result.newBadge && (
            <div className="chip">
              🎖<span>{t("newBadge")}</span>
            </div>
          )}
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
