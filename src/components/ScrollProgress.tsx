import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

const RADIUS = 24;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const percent = Math.round(progress * 100);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? window.scrollY / h : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      className="scroll-circle"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      title="回到顶部"
      style={{ opacity: progress > 0.01 ? 1 : 0, pointerEvents: progress > 0.01 ? "auto" : "none" }}
    >
      <svg viewBox="0 0 60 60" className="scroll-circle-ring">
        <circle cx="30" cy="30" r={RADIUS} fill="none" className="scroll-circle-track" strokeWidth="3" />
        <circle
          cx="30" cy="30" r={RADIUS} fill="none" className="scroll-circle-fill" strokeWidth="3"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
          strokeLinecap="round"
          transform="rotate(-90 30 30)"
        />
      </svg>
      <span className="scroll-circle-text">{percent}</span>
      <ArrowUp size={13} className="scroll-circle-arrow" />
    </button>
  );
}
