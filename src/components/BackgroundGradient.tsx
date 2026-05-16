import { useEffect } from "react";

const containerStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 0,
  overflow: "hidden",
  background: `linear-gradient(40deg, var(--gradient-background-start), var(--gradient-background-end))`,
};

const gradientsContainerStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  filter: "url(#blurMe) blur(40px)",
};

const blobBase: React.CSSProperties = {
  position: "absolute",
  borderRadius: "50%",
  mixBlendMode: "var(--blending-value)" as any,
  width: "var(--size)",
  height: "var(--size)",
  top: "calc(50% - var(--size) / 2)",
  left: "calc(50% - var(--size) / 2)",
  transformOrigin: "center center",
  opacity: 1,
};

export default function BackgroundGradient({
  gradientBackgroundStart = "rgb(108, 0, 162)",
  gradientBackgroundEnd = "rgb(0, 17, 82)",
  firstColor = "18, 113, 255",
  secondColor = "221, 74, 255",
  thirdColor = "100, 220, 255",
  fourthColor = "200, 50, 50",
  fifthColor = "180, 180, 50",
  pointerColor = "140, 100, 255",
  size = "80%",
  blendingValue = "hard-light",
}: {
  gradientBackgroundStart?: string;
  gradientBackgroundEnd?: string;
  firstColor?: string;
  secondColor?: string;
  thirdColor?: string;
  fourthColor?: string;
  fifthColor?: string;
  pointerColor?: string;
  size?: string;
  blendingValue?: string;
}) {
  useEffect(() => {
    document.body.style.setProperty("--gradient-background-start", gradientBackgroundStart);
    document.body.style.setProperty("--gradient-background-end", gradientBackgroundEnd);
    document.body.style.setProperty("--first-color", firstColor);
    document.body.style.setProperty("--second-color", secondColor);
    document.body.style.setProperty("--third-color", thirdColor);
    document.body.style.setProperty("--fourth-color", fourthColor);
    document.body.style.setProperty("--fifth-color", fifthColor);
    document.body.style.setProperty("--pointer-color", pointerColor);
    document.body.style.setProperty("--size", size);
    document.body.style.setProperty("--blending-value", blendingValue);
  }, []);

  return (
    <div style={containerStyle}>
      <style>{`
        @keyframes moveHorizontal {
          0% { transform: translateX(-50%) translateY(-10%); }
          50% { transform: translateX(50%) translateY(10%); }
          100% { transform: translateX(-50%) translateY(-10%); }
        }
        @keyframes moveInCircle {
          0% { transform: rotate(0deg); }
          50% { transform: rotate(180deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes moveVertical {
          0% { transform: translateY(-50%); }
          50% { transform: translateY(50%); }
          100% { transform: translateY(-50%); }
        }
      `}</style>
      <svg>
        <defs>
          <filter id="blurMe">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
      <div style={gradientsContainerStyle}>
        <div
          style={{
            ...blobBase,
            background: `radial-gradient(circle at center, var(--first-color) 0, var(--first-color) 50%) no-repeat`,
            transformOrigin: "center center",
            animation: "moveVertical 30s ease infinite",
          }}
        />
        <div
          style={{
            ...blobBase,
            background: `radial-gradient(circle at center, rgba(var(--second-color), 0.8) 0, rgba(var(--second-color), 0) 50%) no-repeat`,
            transformOrigin: "calc(50% - 400px)",
            animation: "moveInCircle 20s reverse infinite",
          }}
        />
        <div
          style={{
            ...blobBase,
            background: `radial-gradient(circle at center, rgba(var(--third-color), 0.8) 0, rgba(var(--third-color), 0) 50%) no-repeat`,
            transformOrigin: "calc(50% + 400px)",
            animation: "moveInCircle 40s linear infinite",
          }}
        />
        <div
          style={{
            ...blobBase,
            background: `radial-gradient(circle at center, rgba(var(--fourth-color), 0.8) 0, rgba(var(--fourth-color), 0) 50%) no-repeat`,
            transformOrigin: "calc(50% - 200px)",
            animation: "moveHorizontal 40s ease infinite",
            opacity: 0.7,
          }}
        />
        <div
          style={{
            ...blobBase,
            background: `radial-gradient(circle at center, rgba(var(--fifth-color), 0.8) 0, rgba(var(--fifth-color), 0) 50%) no-repeat`,
            transformOrigin: "calc(50% - 800px) calc(50% + 800px)",
            animation: "moveInCircle 20s ease infinite",
          }}
        />
      </div>
    </div>
  );
}
