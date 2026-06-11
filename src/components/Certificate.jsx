import { useState } from "react";
import { EXAM_QUESTIONS } from "../lib/quiz.js";

function renderCertCanvas({ name, dateText, heading, body, score, xp, streak, t }) {
  const W = 1080;
  const H = 1350;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  // background + frame
  ctx.fillStyle = "#faf7f0";
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "#2fa56e";
  ctx.lineWidth = 18;
  ctx.strokeRect(36, 36, W - 72, H - 72);
  ctx.strokeStyle = "#e8b23a";
  ctx.lineWidth = 4;
  ctx.strokeRect(64, 64, W - 128, H - 128);

  ctx.textAlign = "center";
  ctx.fillStyle = "#c4922a";
  ctx.font = "700 96px Amiri, serif";
  ctx.fillText("أسماء الله الحسنى", W / 2, 240);

  ctx.fillStyle = "#25855a";
  ctx.font = "900 58px Nunito, sans-serif";
  ctx.fillText(heading, W / 2, 360);

  ctx.fillStyle = "#3c3c3c";
  ctx.font = "900 84px Nunito, sans-serif";
  ctx.fillText(name || "—", W / 2, 560);
  ctx.strokeStyle = "#e8b23a";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(220, 600);
  ctx.lineTo(W - 220, 600);
  ctx.stroke();

  ctx.fillStyle = "#777777";
  ctx.font = "800 44px Nunito, sans-serif";
  ctx.fillText(body, W / 2, 690);

  ctx.font = "120px serif";
  ctx.fillText("🏆", W / 2, 880);

  ctx.fillStyle = "#3c3c3c";
  ctx.font = "900 46px Nunito, sans-serif";
  ctx.fillText(
    `${t("score")}: ${score}/${EXAM_QUESTIONS}   ·   ⭐ ${xp} XP   ·   🔥 ${streak}`,
    W / 2,
    1010
  );

  ctx.fillStyle = "#777777";
  ctx.font = "800 40px Nunito, sans-serif";
  ctx.fillText(dateText, W / 2, 1110);

  ctx.fillStyle = "#25855a";
  ctx.font = "900 36px Nunito, sans-serif";
  ctx.fillText("99 Names — Asma-ul-Husna", W / 2, H - 130);

  return canvas;
}

export default function Certificate({ progress, t, score, onExit, onSetName }) {
  const [name, setName] = useState(progress.certName || "");
  const dateText = new Date().toLocaleDateString(
    progress.lang === "sq" ? "sq-AL" : "en-GB",
    { day: "numeric", month: "long", year: "numeric" }
  );

  async function shareOrDownload() {
    onSetName(name);
    await document.fonts.ready;
    const canvas = renderCertCanvas({
      name,
      dateText,
      heading: t("certHeading"),
      body: t("certBody"),
      score,
      xp: progress.xp,
      streak: progress.streak,
      t,
    });
    const blob = await new Promise((res) => canvas.toBlob(res, "image/png"));
    const file = new File([blob], "99-names-certificate.png", { type: "image/png" });
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: "99 Names" });
        return;
      } catch {
        /* user cancelled share — fall through to download */
      }
    }
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "99-names-certificate.png";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div className="lesson">
      <div className="complete-stage">
        <div className="big">🏆</div>
        <h2>{t("examPass")}</h2>
        <p>{t("allDoneSub")}</p>
        <div className="reward-chips">
          <div className="chip">
            ✅ {score}/{EXAM_QUESTIONS}
            <span>{t("score")}</span>
          </div>
          <div className="chip">
            ⭐ {progress.xp}
            <span>XP</span>
          </div>
        </div>
        <input
          className="cert-input"
          value={name}
          maxLength={40}
          placeholder={t("certNamePh")}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="start-wrap">
          <button className="btn gold" onClick={shareOrDownload} disabled={!name.trim()}>
            {t("share")} 📜
          </button>
          <button className="btn ghost" style={{ marginTop: 12 }} onClick={onExit}>
            {t("backToPath")}
          </button>
        </div>
      </div>
    </div>
  );
}
