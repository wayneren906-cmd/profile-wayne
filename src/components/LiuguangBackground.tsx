export default function LiuguangBackground() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        background: "#0a0a1a",
      }}
    >
      {/* 极光流动层 */}
      <div
        style={{
          position: "absolute",
          inset: -20,
          opacity: 0.5,
          backgroundImage: `
            repeating-linear-gradient(
              100deg,
              rgba(0,0,0,1) 0%,
              rgba(0,0,0,1) 7%,
              transparent 10%,
              transparent 12%,
              rgba(0,0,0,1) 16%
            ),
            repeating-linear-gradient(
              100deg,
              rgba(59,130,246,0.8) 10%,
              rgba(165,180,252,0.6) 15%,
              rgba(147,197,253,0.8) 20%,
              rgba(196,181,253,0.6) 25%,
              rgba(96,165,250,0.8) 30%
            )
          `,
          backgroundSize: "300% 200%",
          backgroundPosition: "50% 50%",
          filter: "blur(20px)",
          pointerEvents: "none",
          animation: "liuguangDrift 25s ease-in-out infinite alternate",
        }}
      />
      {/* 第二层 - 反向动画 */}
      <div
        style={{
          position: "absolute",
          inset: -20,
          opacity: 0.35,
          backgroundImage: `
            repeating-linear-gradient(
              100deg,
              rgba(0,0,0,1) 0%,
              rgba(0,0,0,1) 7%,
              transparent 10%,
              transparent 12%,
              rgba(0,0,0,1) 16%
            ),
            repeating-linear-gradient(
              100deg,
              rgba(59,130,246,0.8) 10%,
              rgba(165,180,252,0.6) 15%,
              rgba(147,197,253,0.8) 20%,
              rgba(196,181,253,0.6) 25%,
              rgba(96,165,250,0.8) 30%
            )
          `,
          backgroundSize: "200% 100%",
          backgroundPosition: "50% 50%",
          filter: "blur(30px)",
          pointerEvents: "none",
          animation: "liuguangDrift 35s ease-in-out infinite alternate-reverse",
          mixBlendMode: "difference" as any,
        }}
      />
      <style>{`
        @keyframes liuguangDrift {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
}
