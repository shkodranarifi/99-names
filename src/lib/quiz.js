import { NAMES, namesForDay } from "../data.js";

export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const TYPES = ["meaning", "name", "translit"];

export const EXAM_QUESTIONS = 20;
export const EXAM_PASS = 16;

function strengthOf(strength, n) {
  return strength?.[n]?.s ?? 0;
}

export function learnedNames(completed) {
  return completed.flatMap((d) => namesForDay(d));
}

// Weakest first; ties broken by least-recently seen, then randomly.
function sortedByWeakness(names, strength) {
  return shuffle(names).sort((a, b) => {
    const ds = strengthOf(strength, a.n) - strengthOf(strength, b.n);
    if (ds) return ds;
    return (strength?.[a.n]?.last ?? "").localeCompare(strength?.[b.n]?.last ?? "");
  });
}

// One multiple-choice item; distractors biased toward `biasPool`, topped up globally.
function mc(name, biasPool, type) {
  const qType = type ?? TYPES[Math.floor(Math.random() * TYPES.length)];
  const near = shuffle(biasPool.filter((x) => x.n !== name.n)).slice(0, 2);
  const rest = shuffle(
    NAMES.filter((x) => x.n !== name.n && !near.includes(x))
  ).slice(0, 3 - near.length);
  return { kind: "mc", type: qType, name, options: shuffle([name, ...near, ...rest]) };
}

// Daily lesson: 6 MC on today's names + 2 review MC on weakest learned names,
// then a match-the-pairs round to finish. Day 1 (no history) uses today's names for all 8.
export function buildQuiz(day, strength = {}, completed = []) {
  const dayNames = namesForDay(day);
  const items = dayNames.map((nm, i) => mc(nm, dayNames, TYPES[i % 3]));
  items.push(mc(shuffle(dayNames)[0], dayNames));

  const prior = learnedNames(completed.filter((d) => d !== day));
  const review = sortedByWeakness(prior, strength).slice(0, 2);
  if (review.length) {
    review.forEach((nm) => items.push(mc(nm, prior)));
  } else {
    shuffle(dayNames).slice(0, 2).forEach((nm) => items.push(mc(nm, dayNames)));
  }

  return [...shuffle(items), { kind: "pairs", names: dayNames }];
}

// Practice session: 10 MC over the weakest learned names (cycling if few are learned).
export function buildReviewQuiz(strength, completed) {
  const pool = learnedNames(completed);
  const weakest = sortedByWeakness(pool, strength);
  const items = [];
  for (let i = 0; i < 10; i++) {
    items.push(mc(weakest[i % weakest.length], pool));
  }
  return shuffle(items);
}

// Final exam: 20 MC over all 99, weighted toward the weakest names.
export function buildExam(strength) {
  const weakest = sortedByWeakness(NAMES, strength).slice(0, 12);
  const rest = shuffle(NAMES.filter((x) => !weakest.includes(x))).slice(
    0,
    EXAM_QUESTIONS - weakest.length
  );
  return shuffle([...weakest, ...rest]).map((nm) => mc(nm, NAMES));
}

export function speakArabic(text) {
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ar-SA";
    u.rate = 0.8;
    speechSynthesis.speak(u);
  } catch { /* speech not supported — button is just a no-op */ }
}

export function confetti(count) {
  const colors = ["#2fa56e", "#e8b23a", "#1899d6", "#ef5350", "#9c6ade", "#f4900c"];
  for (let i = 0; i < count; i++) {
    const c = document.createElement("div");
    c.className = "confetti";
    c.style.left = Math.random() * 100 + "vw";
    c.style.background = colors[Math.floor(Math.random() * colors.length)];
    c.style.animationDuration = 1.8 + Math.random() * 1.6 + "s";
    c.style.animationDelay = Math.random() * 0.6 + "s";
    c.style.transform = `rotate(${Math.random() * 360}deg)`;
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 4200);
  }
}
