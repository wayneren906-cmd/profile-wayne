import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import AvatarPicker from "@/components/AvatarPicker";
import {
  Sun,
  Moon,
  MapPin,
  Github,
  Mail,
  MessageCircle,
  Phone,
  ArrowLeft,
  Link2,
  GraduationCap,
  Code2,
  Heart,
  Award,
  BookOpen,
  ExternalLink,
  ArrowUp,
} from "lucide-react";
import "@/styles/profile.css";

const skills = [
  { name: "Python", level: 88 },
  { name: "C", level: 80 },
  { name: "LLM API 集成", level: 85 },
  { name: "AI Agent 编排", level: 78 },
  { name: "自动化脚本", level: 90 },
  { name: "Git / 版本控制", level: 85 },
];

const learnings = [
  { name: "Vibe Coding 探索", role: "学习实践", desc: "初步接触 Vibe Coding 理念，尝试用自然语言驱动代码生成，体验 AI 辅助开发的完整流程" },
  { name: "Claude Code 实战", role: "工具应用", desc: "使用 Claude Code 进行日常代码重构与版本控制，探索 Agent 在本地开发环境中的集成方式" },
  { name: "Trae 工作流", role: "基础使用", desc: "在 Trae 平台中进行 AI 编程实践，学习智能体辅助下的调试与自动化任务处理" },
];

const socials = [
  { icon: Github, label: "GitHub", href: "https://github.com/wayneren906-cmd", value: "@wayneren906-cmd", external: true },
  { icon: Mail, label: "Email", href: "mailto:Wayne.ren906@gmail.com", value: "Wayne.ren906@gmail.com", external: true },
  { icon: Phone, label: "电话", href: "tel:15095950906", value: "15095950906", external: false },
  { icon: MessageCircle, label: "QQ", href: "tencent://message/?uin=2746682776", value: "2746682776", external: false },
];

const infoCards = [
  { icon: Code2, label: "编程语言", value: "C / Python" },
  { icon: Award, label: "AI 工具", value: "Claude Code / Trae" },
  { icon: BookOpen, label: "核心能力", value: "Agent 自动化重构" },
  { icon: Heart, label: "核心理念", value: "人定架构 · AI 实现" },
];

export default function Profile() {
  const navigate = useNavigate();
  const { toggleTheme, isDark } = useTheme();
  const [visible, setVisible] = useState(false);
  const [skillsVisible, setSkillsVisible] = useState(false);
  const [showToTop, setShowToTop] = useState(false);
  const [iconSpin, setIconSpin] = useState(false);
  const iconMounted = useRef(false);
  const skillsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "任韪岩 | 详细资料";
  }, []);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (iconMounted.current) {
      setIconSpin(true);
      const timer = setTimeout(() => setIconSpin(false), 400);
      return () => clearTimeout(timer);
    }
    iconMounted.current = true;
  }, [isDark]);

  useEffect(() => {
    const el = skillsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setSkillsVisible(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setShowToTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className={cn("profile-root", isDark ? "dark" : "light", visible && "profile-visible")}>
        <div className="orb orb-a" />
        <div className="orb orb-b" />
        <div className="orb orb-c" />
        <div className="orb orb-d" />
        <div className="orb orb-e" />
        <div className="orb orb-f" />
        <div className="profile-glow" />

        {/* 顶栏 */}
        <div className="profile-topbar pf-fade">
          <button className="profile-back" onClick={() => navigate("/")} title="返回首页">
            <ArrowLeft size={18} />
          </button>
          <button className="profile-theme-btn" onClick={toggleTheme} title="切换主题">
            <span className={iconSpin ? "theme-icon-spin" : ""} style={{ display: "inline-flex" }}>
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </span>
          </button>
        </div>

        <div className="profile-main">
          {/* Hero */}
          <div className="pf-hero">
            <div className="pf-fade pf-avatar-wrap">
              <div className="pf-avatar-ring" />
              <div className="pf-avatar-inner">
                <AvatarPicker size={120} fallback="任" />
              </div>
            </div>
            <h1 className="pf-name pf-fade pf-d1">任韪岩</h1>
            <p className="pf-role pf-fade pf-d1">学生 · AI 驱动开发者</p>
            <div className="pf-location pf-fade pf-d2">
              <MapPin size={13} />
              <span>中国 · 重庆</span>
            </div>
            <p className="pf-bio pf-fade pf-d2">
              熟悉 C 与 Python 开发的学生开发者。对 AI 的理解已不仅停留在基础对话生成——
              通过打通大模型 API 与本地开发环境的壁垒，初步掌握 Trae、Claude Code 等 AI 编程 Agent，
              实现自动化代码重构与版本控制。相信未来的开发模式将是"人类提供架构思维，AI 负责繁琐的底层实现"。
            </p>
          </div>

          {/* 信息卡片 */}
          <div className="pf-grid pf-fade pf-d3">
            {infoCards.map((item) => (
              <div className="pf-info" key={item.label}>
                <div className="pf-info-icon"><item.icon size={17} /></div>
                <div>
                  <div className="pf-info-label">{item.label}</div>
                  <div className="pf-info-value">{item.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* 技能 */}
          <div className="pf-section pf-fade pf-d4" ref={skillsRef}>
            <h2 className="pf-section-title"><Code2 /> 技术能力</h2>
            <div className="pf-card">
              {skills.map((s, i) => (
                <div className="pf-skill" key={s.name}>
                  <span className="pf-skill-name">{s.name}</span>
                  <div className="pf-skill-track">
                    <div
                      className="pf-skill-fill"
                      style={{
                        width: skillsVisible ? `${s.level}%` : "0%",
                        transitionDelay: skillsVisible ? `${i * 0.1}s` : "0s",
                      }}
                    />
                  </div>
                  <span className="pf-skill-lvl">{skillsVisible ? `${s.level}%` : "--"}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 学习经验 */}
          <div className="pf-section pf-fade pf-d5">
            <h2 className="pf-section-title"><BookOpen /> 学习经验</h2>
            <div className="pf-card">
              {learnings.map((l) => (
                <div className="pf-learning" key={l.name}>
                  <div className="pf-learning-head">
                    <span className="pf-learning-name">{l.name}</span>
                    <span className="pf-learning-badge">{l.role}</span>
                  </div>
                  <p className="pf-learning-desc">{l.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 教育 */}
          <div className="pf-section pf-fade pf-d5">
            <h2 className="pf-section-title"><GraduationCap /> 教育背景</h2>
            <div className="pf-card pf-edu">
              <div className="pf-info-icon"><GraduationCap size={17} /></div>
              <div>
                <div style={{ fontSize: "15px", fontWeight: 600 }}>重庆邮电大学 · 物联网工程</div>
                <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "3px" }}>
                  大二在读
                </div>
              </div>
            </div>
          </div>

          {/* 社交 */}
          <div className="pf-section pf-fade pf-d6">
            <h2 className="pf-section-title"><Link2 /> 社交与联系</h2>
            <div className="pf-card pf-socials">
              {socials.map((s) => (
                <a className="pf-social-item" href={s.href} target={s.external ? "_blank" : undefined} rel={s.external ? "noopener noreferrer" : undefined} key={s.label}>
                  <div className="pf-social-icon"><s.icon size={18} /></div>
                  <div>
                    <div className="pf-social-label">{s.label}</div>
                    <div className="pf-social-value">{s.value}</div>
                  </div>
                  {s.external && <ExternalLink size={14} className="pf-social-arrow" />}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* 回到顶部 */}
        <button
          className={cn("profile-to-top", showToTop && "visible")}
          onClick={scrollToTop}
          title="回到顶部"
        >
          <ArrowUp size={18} />
        </button>
      </div>
  );
}
