import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import AvatarPicker from "@/components/AvatarPicker";
import "@/styles/home.css";
import {
  Sun,
  Moon,
  MapPin,
  Github,
  Mail,
  MessageCircle,
  Phone,
  ArrowRight,
  Code2,
  Sparkles,
  Zap,
} from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const { toggleTheme, isDark } = useTheme();
  const [visible, setVisible] = useState(false);
  const [iconSpin, setIconSpin] = useState(false);
  const mounted = useRef(false);

  useEffect(() => {
    document.title = "任韪岩 | 个人简介";
  }, []);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (mounted.current) {
      setIconSpin(true);
      const timer = setTimeout(() => setIconSpin(false), 400);
      return () => clearTimeout(timer);
    }
    mounted.current = true;
  }, [isDark]);

  return (
    <div className={cn("home-root", isDark ? "dark" : "light", visible && "home-visible")}>
        <div className="orb orb-a" />
        <div className="orb orb-b" />
        <div className="orb orb-c" />
        <div className="orb orb-d" />
        <div className="orb orb-e" />
        <div className="orb orb-f" />
        <div className="home-glow" />

        {/* 主题切换 */}
        <button className="home-theme-btn" onClick={toggleTheme} title="切换主题">
          <span className={iconSpin ? "theme-icon-spin" : ""} style={{ display: "inline-flex" }}>
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </span>
        </button>

        <div className="home-content">
          {/* 头像 */}
          <div className="home-fade home-avatar-wrap">
            <div className="home-avatar-ring" />
            <div className="home-avatar-inner">
              <AvatarPicker size={110} fallback="任" />
            </div>
          </div>

          {/* 姓名 */}
          <h1 className="home-name home-fade home-delay-1">任韪岩</h1>
          <p className="home-role home-fade home-delay-2">学生 · AI 驱动开发者</p>
          <div className="home-location home-fade home-delay-2">
            <MapPin size={13} />
            <span>中国 · 重庆</span>
          </div>

          {/* 简介 */}
          <p className="home-bio home-fade home-delay-3">
            熟悉 C 与 Python 开发，致力于将 AI 深度融入日常工程化工作流。
            通过打通大模型 API 与本地开发环境的壁垒，让 Agent 负责底层实现，人类聚焦架构与创造。
          </p>

          {/* 统计 */}
          <div className="home-stats home-fade home-delay-4">
            <div className="home-stat">
              <Code2 size={16} className="home-stat-icon" />
              <span className="home-stat-val">C/Python</span>
              <span className="home-stat-lbl">技术栈</span>
            </div>
            <div className="home-stat">
              <Sparkles size={16} className="home-stat-icon" />
              <span className="home-stat-val">AI Agent</span>
              <span className="home-stat-lbl">工作模式</span>
            </div>
            <div className="home-stat">
              <Zap size={16} className="home-stat-icon" />
              <span className="home-stat-val">API+本地</span>
              <span className="home-stat-lbl">工具链</span>
            </div>
          </div>

          {/* 标签 */}
          <div className="home-tags home-fade home-delay-5">
            <span className="home-tag">C</span>
            <span className="home-tag">Python</span>
            <span className="home-tag">LLM API</span>
            <span className="home-tag">Claude Code</span>
            <span className="home-tag">Trae</span>
            <span className="home-tag">AI Agent</span>
          </div>

          {/* 社交 */}
          <div className="home-socials home-fade home-delay-6">
            <a className="home-social" href="https://github.com/wayneren906-cmd" target="_blank" rel="noopener noreferrer" title="GitHub">
              <Github size={18} />
            </a>
            <a className="home-social" href="mailto:Wayne.ren906@gmail.com" title="Email">
              <Mail size={18} />
            </a>
            <a className="home-social" href="tel:15095950906" title="电话">
              <Phone size={18} />
            </a>
            <a className="home-social" href="tencent://message/?uin=2746682776" title="QQ">
              <MessageCircle size={18} />
            </a>
          </div>

          {/* CTA */}
          <div className="home-fade home-delay-7">
            <button className="home-cta" onClick={() => navigate("/profile")}>
              查看完整简介
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
  );
}
