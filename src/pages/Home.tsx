import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import AvatarPicker from "@/components/AvatarPicker";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import "@/styles/home.css";

const BackgroundGradient = lazy(() => import("@/components/BackgroundGradient"));
const XuanjingBackground = lazy(() => import("@/components/XuanjingBackground"));
const PathsBackground = lazy(() => import("@/components/PathsBackground"));
import {
  MapPin,
  Github,
  Mail,
  Phone,
  ArrowRight,
  Code2,
  Sparkles,
  Zap,
} from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [visible, setVisible] = useState(false);
  const avatarWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "任韪岩 | 个人简介";
  }, []);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const el = avatarWrapRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      el.style.setProperty('--tilt-x', `${y * -12}deg`);
      el.style.setProperty('--tilt-y', `${x * 12}deg`);
    };
    const onLeave = () => {
      el.style.setProperty('--tilt-x', '0deg');
      el.style.setProperty('--tilt-y', '0deg');
    };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div className={cn("home-root", theme, visible && "home-visible")}>
        <Suspense fallback={null}>
          {theme === "nebula" && (
            <div style={{ position: "fixed", inset: 0, zIndex: 0, opacity: 0.45 }}>
              <BackgroundGradient />
            </div>
          )}
          {theme === "nebula" && <div className="nebula-overlay" />}
          {theme === "xuanjing" && <XuanjingBackground />}
          {theme === "liuxian" && <PathsBackground />}
        </Suspense>
        <div className="orb orb-a" />
        <div className="orb orb-b" />
        <div className="orb orb-c" />
        <div className="orb orb-d" />
        <div className="orb orb-e" />
        <div className="orb orb-f" />
        <div className="home-glow" />

        <div style={{ position: "fixed", top: 24, right: 24, zIndex: 100 }}>
          <ThemeSwitcher />
        </div>

        <div className="home-content">
          {/* 头像 */}
          <div ref={avatarWrapRef} className="home-fade home-avatar-wrap">
            <div className="home-avatar-ring" />
            <div className="home-avatar-inner">
              <AvatarPicker size={92} fallback="任" />
            </div>
          </div>

          {/* 姓名 */}
          <h1 className="home-name home-fade home-delay-1">任韪岩</h1>
          <p className="home-role home-fade home-delay-2">前端初学者 · AI 工具实践者</p>
          <div className="home-location home-fade home-delay-2">
            <MapPin size={13} />
            <span>中国 · 重庆</span>
          </div>

          {/* 简介 */}
          <p className="home-bio home-fade home-delay-3">
            致力于将 AI 深度融入日常工程与工作流，通过 AI Agent 驱动高效开发。
          </p>

          {/* 统计 */}
          <div className="home-stats home-fade home-delay-4">
            <div className="home-stat">
              <Code2 size={16} className="home-stat-icon" />
              <span className="home-stat-val">React/TS</span>
              <span className="home-stat-lbl">技术栈</span>
            </div>
            <div className="home-stat">
              <Sparkles size={16} className="home-stat-icon" />
              <span className="home-stat-val">AI Agent</span>
              <span className="home-stat-lbl">工作模式</span>
            </div>
            <div className="home-stat">
              <Zap size={16} className="home-stat-icon" />
              <span className="home-stat-val">Trae+CC</span>
              <span className="home-stat-lbl">工具链</span>
            </div>
          </div>

          {/* 标签 */}
          <div className="home-tags home-fade home-delay-5">
            <span className="home-tag home-tag-indigo">React</span>
            <span className="home-tag home-tag-indigo">TypeScript</span>
            <span className="home-tag home-tag-fuchsia">Claude Code</span>
            <span className="home-tag home-tag-cyan">Trae</span>
            <span className="home-tag home-tag-fuchsia">AI Agent</span>
            <span className="home-tag home-tag-indigo">Vite</span>
            <span className="home-tag home-tag-cyan">Cloudflare</span>
            <span className="home-tag home-tag-fuchsia">Prompt Engineering</span>
            <span className="home-tag home-tag-cyan">前端开发</span>
          </div>

          {/* 社交 */}
          <div className="home-socials home-fade home-delay-6">
            <a className="home-social" href="mailto:Wayne.ren906@gmail.com" title="Email">
              <Mail size={18} />
            </a>
            <a className="home-social" href="tel:15095950906" title="电话">
              <Phone size={18} />
            </a>
            <a className="home-social" href="tencent://message/?uin=2746682776" title="QQ">
              <PenguinIcon size={18} />
            </a>
            <a className="home-social" href="https://github.com/wayneren906-cmd" target="_blank" rel="noopener noreferrer" title="GitHub">
              <Github size={18} />
            </a>
          </div>

          {/* CTA */}
          <div className="home-fade home-delay-7">
            <button className="home-cta" onClick={() => navigate("/profile")}>
              查看完整简介
              <ArrowRight size={16} className="cta-arrow" />
            </button>
          </div>
        </div>
      </div>
  );
}

function PenguinIcon({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M21.395 15.035a40 40 0 0 0-.803-2.264l-1.079-2.695c.001-.032.014-.562.014-.836C19.526 4.632 17.351 0 12 0S4.474 4.632 4.474 9.241c0 .274.013.804.014.836l-1.08 2.695a39 39 0 0 0-.802 2.264c-1.021 3.283-.69 4.643-.438 4.673.54.065 2.103-2.472 2.103-2.472 0 1.469.756 3.387 2.394 4.771-.612.188-1.363.479-1.845.835-.434.32-.379.646-.301.778.343.578 5.883.369 7.482.189 1.6.18 7.14.389 7.483-.189.078-.132.132-.458-.301-.778-.483-.356-1.233-.646-1.846-.836 1.637-1.384 2.393-3.302 2.393-4.771 0 0 1.563 2.537 2.103 2.472.251-.03.581-1.39-.438-4.673Z" />
    </svg>
  );
}
