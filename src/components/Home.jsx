import { useState, useRef, useCallback } from "react";
import "./Home.scss";

export default function Home() {
  // "heads" | "tails" — controls which face is visible at rest
  const [result, setResult] = useState("heads");
  const [animClass, setAnimClass] = useState("");
  const [flipping, setFlipping] = useState(false);
  const [heads, setHeads] = useState(0);
  const [tails, setTails] = useState(0);
  const [resultLabel, setResultLabel] = useState("");

  const choiceRef = useRef(null);

  const startFlip = useCallback(() => {
    if (flipping) return;

    choiceRef.current = null;
    setResultLabel("");
    setAnimClass("");
    setFlipping(true);

    // Double rAF so class removal is painted before we re-add
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setAnimClass("flipping");

        setTimeout(() => {
          const userChoice = choiceRef.current;
          let outcome;

          if (userChoice === "heads" || userChoice === "tails") {
            outcome = userChoice;
          } else {
            outcome = Math.random() < 0.5 ? "heads" : "tails";
          }

          setResult(outcome);
          setResultLabel(outcome);

          if (outcome === "heads") setHeads((h) => h + 1);
          else setTails((t) => t + 1);

          setFlipping(false);
          setAnimClass("");
        }, 3000);
      });
    });
  }, [flipping]);

  const handleHalfClick = useCallback(
    (side) => {
      if (flipping && choiceRef.current === null) {
        choiceRef.current = side;
      }
    },
    [flipping]
  );

  return (
    <div className="hot-page">
      {/* ── Navbar ── */}
      <nav className="hot-navbar">
        <div className="hot-navbar__logo">
          <svg
            className="hot-navbar__logo-icon"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="36" height="36" rx="8" fill="#F3E8FF" />
            <path d="M18 6L30 18L18 30L6 18L18 6Z" fill="url(#grad)" opacity="0.9" />
            <path d="M18 10L26 18L18 26L10 18L18 10Z" fill="white" opacity="0.4" />
            <defs>
              <linearGradient id="grad" x1="6" y1="6" x2="30" y2="30">
                <stop stopColor="#C026D3" />
                <stop offset="1" stopColor="#7C3AED" />
              </linearGradient>
            </defs>
          </svg>
          <span className="brand-app">App</span>
          <span className="brand-sorteos">Sorteos</span>
        </div>
        <div className="hot-navbar__auth">
          <button className="btn-login">Log in</button>
          <button className="btn-signup">Sign up</button>
        </div>
      </nav>

      {/* ── Invisible split halves overlay (active only while flipping) ── */}
      <div className={`hot-halves${flipping ? " active" : ""}`}>
        <div className="hot-half" onClick={() => handleHalfClick("heads")} />
        <div className="hot-half" onClick={() => handleHalfClick("tails")} />
      </div>

      {/* ── Main ── */}
      <main className="hot-main">
        <div className="hot-icon-box">🪙</div>
        <h1 className="hot-title">Heads or Tails</h1>
        <p className="hot-subtitle">Flip a virtual coin with this online and free app.</p>

        <div className="hot-score">
          <span>Heads: <strong>{heads}</strong></span>
          <span>Tails: <strong>{tails}</strong></span>
        </div>

        {/* Coin
            Front face = HEADS (rotateX 0deg)
            Back face  = TAILS (rotateX 180deg)
            .heads class → coin rests at rotateX(0deg)   → HEADS visible
            .tails class → coin rests at rotateX(180deg) → TAILS visible
            Animation spins 5 full rotations (1800deg) in 3s upright (rotateX).
            For tails end result, we add 180deg → 1980deg total.
        */}
        <div className="hot-coin-wrapper" onClick={startFlip}>
          <div className={`hot-coin ${result} ${animClass}`}>
            <div className="hot-coin__face hot-coin__face--front">
              <span>HEADS</span>
            </div>
            <div className="hot-coin__face hot-coin__face--back">
              <span>TAILS</span>
            </div>
          </div>
        </div>

        <button
          className="hot-flip-btn"
          onClick={startFlip}
          disabled={flipping}
        >
          {flipping ? "Flip the coin!" : "Flip the coin!"}
        </button>

        {resultLabel && !flipping && (
          <p className={`hot-result-label ${resultLabel}`}>
            Result: <strong>{resultLabel.toUpperCase()}</strong>
          </p>
        )}
      </main>
    </div>
  );
}
