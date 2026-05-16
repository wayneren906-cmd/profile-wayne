import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const Home = lazy(() => import("@/pages/Home"));
const Profile = lazy(() => import("@/pages/Profile"));

function RouteFallback() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg, #fafafa)",
        color: "var(--text-muted, #9a9aae)",
        fontSize: 14,
      }}
    >
      <span style={{ opacity: 0.6 }}>载入中…</span>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="*"
            element={
              <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
                <h1 style={{ fontSize: 24, margin: 0 }}>404</h1>
                <a href="/" style={{ color: "#5b5fe3", textDecoration: "none" }}>返回首页 →</a>
              </div>
            }
          />
        </Routes>
      </Suspense>
    </Router>
  );
}
