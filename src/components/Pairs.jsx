import { useState } from "react";
import { shuffle } from "../lib/quiz.js";
import { playCorrect, playWrong, buzz } from "../lib/sound.js";

// Match transliteration <-> meaning for the day's names.
export default function Pairs({ names, lang, t, onAnswer, onDone }) {
  const [left] = useState(() => shuffle(names));
  const [right] = useState(() => shuffle(names));
  const [selL, setSelL] = useState(null);
  const [selR, setSelR] = useState(null);
  const [matched, setMatched] = useState(() => new Set());
  const [wrongPair, setWrongPair] = useState(null); // { l, r } flashed briefly
  const [mistakes, setMistakes] = useState(0);
  const allMatched = matched.size === names.length;

  function meaningOf(nm) {
    return lang === "sq" ? nm.sq : nm.en;
  }

  function tryMatch(l, r) {
    if (l === r) {
      setMatched((m) => new Set(m).add(l));
      onAnswer(l, true);
      playCorrect();
      buzz(30);
    } else {
      setMistakes((m) => m + 1);
      onAnswer(l, false);
      setWrongPair({ l, r });
      playWrong();
      buzz(100);
      setTimeout(() => setWrongPair(null), 450);
    }
    setSelL(null);
    setSelR(null);
  }

  function clickL(n) {
    if (matched.has(n) || wrongPair) return;
    if (selR !== null) tryMatch(n, selR);
    else setSelL(selL === n ? null : n);
  }

  function clickR(n) {
    if (matched.has(n) || wrongPair) return;
    if (selL !== null) tryMatch(selL, n);
    else setSelR(selR === n ? null : n);
  }

  function cls(n, sel, side) {
    if (matched.has(n)) return "pair-btn matched";
    if (wrongPair && wrongPair[side] === n) return "pair-btn wrong";
    if (sel === n) return "pair-btn sel";
    return "pair-btn";
  }

  return (
    <>
      <div className="quiz-q">{t("pairsTitle")}</div>
      <div className="pairs-grid">
        <div className="pairs-col">
          {left.map((nm) => (
            <button key={nm.n} className={cls(nm.n, selL, "l")} onClick={() => clickL(nm.n)}>
              {nm.translit}
            </button>
          ))}
        </div>
        <div className="pairs-col">
          {right.map((nm) => (
            <button key={nm.n} className={cls(nm.n, selR, "r")} onClick={() => clickR(nm.n)}>
              {meaningOf(nm)}
            </button>
          ))}
        </div>
      </div>

      {allMatched && (
        <div className="feedback good">
          <h3>{t("correct")}</h3>
          <p>{t("pairsDone")}</p>
          <button className="btn" onClick={() => onDone(mistakes === 0)}>
            {t("continue")}
          </button>
        </div>
      )}
    </>
  );
}
