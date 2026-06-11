import { useRef, useState } from "react";
import { I18N } from "../i18n.js";
import Pairs from "./Pairs.jsx";
import { playCorrect, playWrong, buzz } from "../lib/sound.js";

function meaningOf(nm, lang) {
  return lang === "sq" ? nm.sq : nm.en;
}

function MCItem({ item, lang, t, onAnswer, onDone }) {
  const [picked, setPicked] = useState(null);
  const answered = picked !== null;
  const pickedOk = answered && picked.n === item.name.n;

  function choose(opt) {
    if (answered) return;
    setPicked(opt);
    const ok = opt.n === item.name.n;
    onAnswer(item.name.n, ok);
    if (ok) {
      playCorrect();
      buzz(30);
    } else {
      playWrong();
      buzz(100);
    }
  }

  function choiceClass(opt) {
    if (!answered) return "choice";
    if (opt.n === item.name.n) return "choice correct";
    if (opt === picked) return "choice wrong";
    return "choice dim";
  }

  const subsOk = I18N[lang].correctSubs;
  const answer = item.type === "meaning" ? meaningOf(item.name, lang) : item.name.translit;

  return (
    <>
      {item.type === "meaning" && (
        <>
          <div className="quiz-q">{t("qWhichMeaning")}</div>
          <div className="quiz-prompt-card">
            <div className="arabic">{item.name.arabic}</div>
            <div className="translit">{item.name.translit}</div>
          </div>
        </>
      )}
      {item.type === "name" && (
        <>
          <div className="quiz-q">{t("qWhichName")}</div>
          <div className="quiz-prompt-card">
            <div className="meaning">“{meaningOf(item.name, lang)}”</div>
          </div>
        </>
      )}
      {item.type === "translit" && (
        <>
          <div className="quiz-q">{t("qWhichTranslit")}</div>
          <div className="quiz-prompt-card">
            <div className="arabic">{item.name.arabic}</div>
          </div>
        </>
      )}

      <div className="choices">
        {item.options.map((o) => (
          <button key={o.n} className={choiceClass(o)} disabled={answered} onClick={() => choose(o)}>
            {item.type === "meaning" ? meaningOf(o, lang) : o.translit}
            {item.type === "name" && <span className="ar">{o.arabic}</span>}
          </button>
        ))}
      </div>

      {answered && (
        <div className={`feedback ${pickedOk ? "good" : "bad"}`}>
          <h3>{pickedOk ? t("correct") : t("wrong")}</h3>
          <p>
            {pickedOk
              ? subsOk[Math.floor(Math.random() * subsOk.length)]
              : t("wrongSub", answer)}
          </p>
          <button className={`btn ${pickedOk ? "" : "red"}`} onClick={() => onDone(pickedOk)}>
            {t("continue")}
          </button>
        </div>
      )}
    </>
  );
}

// Runs a sequence of mixed quiz items (mc | pairs) with a progress bar.
// onAnswer(nameNumber, ok) fires per answer for strength tracking;
// onFinish(correctCount) fires after the last item.
export default function QuizRunner({ items, lang, t, onExit, onAnswer, onFinish }) {
  const [idx, setIdx] = useState(0);
  const correctRef = useRef(0);

  function handleDone(ok) {
    if (ok) correctRef.current += 1;
    if (idx + 1 >= items.length) onFinish(correctRef.current);
    else setIdx(idx + 1);
  }

  const item = items[idx];
  return (
    <div className="lesson">
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
          <div style={{ width: `${(idx / items.length) * 100}%` }} />
        </div>
      </div>
      {item.kind === "mc" ? (
        <MCItem key={idx} item={item} lang={lang} t={t} onAnswer={onAnswer} onDone={handleDone} />
      ) : (
        <Pairs key={idx} names={item.names} lang={lang} t={t} onAnswer={onAnswer} onDone={handleDone} />
      )}
    </div>
  );
}
