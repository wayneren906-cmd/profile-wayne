import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import AvatarPicker from "@/components/AvatarPicker";
import ThemeSwitcher from "@/components/ThemeSwitcher";

const BackgroundGradient = lazy(() => import("@/components/BackgroundGradient"));
const XuanjingBackground = lazy(() => import("@/components/XuanjingBackground"));
const PathsBackground = lazy(() => import("@/components/PathsBackground"));
import {
  MapPin,
  Github,
  Mail,
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
  Briefcase,
  FolderGit2,
  TrendingUp,
  Sparkles,
  Target,
  Copy,
  Check,
  Download,
} from "lucide-react";
import "@/styles/profile.css";

const skillGroups = [
  {
    label: "前端基础",
    color: "indigo",
    items: [
      { name: "React", level: 70 },
      { name: "TypeScript", level: 65 },
      { name: "JavaScript", level: 72 },
      { name: "HTML", level: 75 },
      { name: "CSS", level: 70 },
      { name: "Vite", level: 65 },
      { name: "移动端适配", level: 60 },
    ],
  },
  {
    label: "AI 工具",
    color: "fuchsia",
    items: [
      { name: "Claude Code", level: 85 },
      { name: "AI Agent 编排", level: 78 },
      { name: "LLM API 集成", level: 75 },
      { name: "Prompt Engineering", level: 70 },
    ],
  },
  {
    label: "工程基础",
    color: "cyan",
    items: [
      { name: "Git / 版本控制", level: 72 },
      { name: "npm / 包管理", level: 65 },
      { name: "Cloudflare Pages", level: 60 },
    ],
  },
];

const learnings = [
  { name: "Vibe Coding 探索", role: "学习实践", desc: "初步接触 Vibe Coding 理念，尝试用自然语言驱动代码生成，体验 AI 辅助开发的完整流程" },
  { name: "Bilibili / YouTube 视频学习", role: "在线学习", desc: "通过 B 站与 YouTube 的前端开发、AI 编程相关视频教程，系统补充 React、TypeScript 等技术的实战知识" },
  { name: "Claude Code 实战", role: "工具应用", desc: "使用 Claude Code 进行日常代码重构与版本控制，探索 Agent 在本地开发环境中的集成方式" },
  { name: "VS Code / Trae 工作流", role: "工具应用", desc: "在 VS Code 与 Trae 中进行 AI 编程实践，学习智能体辅助下的调试与自动化任务处理" },
  { name: "GitHub 开源学习", role: "代码阅读", desc: "在 GitHub 上浏览优秀开源项目，学习项目结构、代码规范与工程化实践，逐步建立自己的技术品味" },
  { name: "Linux.do 论坛", role: "社区交流", desc: "在 Linux.do 论坛浏览和学习他人分享的 AI 工具使用经验、开发踩坑记录与技术方案讨论" },
];

const projects = [
  {
    name: "个人简介网站",
    role: "持续迭代",
    desc: "在 VS Code 终端中通过 Claude Code 以自然语言驱动开发，从零搭建并持续迭代的个人简介网站。现已扩展至 5 套主题（晨曦/深空/星云/玄镜/流线），每套主题拥有独立的背景动画系统——CSS 悬浮球、渐变光晕 blob、SVG 路径动画。实现了 Cloudflare Pages 自动化部署。",
    tech: ["React 18", "TypeScript", "Vite 6", "Tailwind CSS 3", "Framer Motion", "Claude Code", "Cloudflare Pages", "CSS 变量主题系统"],
    challenges: [
      { problem: "多主题系统的可扩展架构设计", solution: "基于 React Context + CSS 变量构建主题引擎，每个主题仅需定义一套颜色变量和背景组件即可接入，新增主题无需修改现有逻辑" },
      { problem: "复杂背景动画与文字可读性的平衡", solution: "通过多层叠加策略——背景动画层( opacity 调低) → 半透明遮罩层( backdrop-filter ) → 文字阴影层，确保动画效果不影响内容可读性" },
      { problem: "高密度信息页面的滚动动效编排", solution: "结合 IntersectionObserver 与 CSS transition，为不同模块设计级联延迟入场、缩放和位移动画，兼顾视觉节奏与性能" },
    ],
  },
  {
    name: "GameHub游戏探索平台",
    role: "独立开发",
    desc: "基于 Next.js 构建的游戏发现与信息聚合平台，集成 RAWG API 提供海量游戏数据，支持多维度筛选、排序与搜索。实现了 AI 驱动的游戏评测分析（LLM 总结玩家评价）、硬件兼容性检测、Cloudflare Workers 后端缓存加速等特色功能。",
    tech: ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS", "Framer Motion", "RAWG API", "Cloudflare Workers", "WASM"],
    challenges: [
      { problem: "RAWG API 在国内访问不稳定且存在速率限制", solution: "引入 Cloudflare Workers 作为代理缓存层，结合 KV 存储实现 1 小时 TTL 缓存，大幅降低回源请求并提升国内访问速度" },
      { problem: "游戏图片加载量大，页面性能受影响", solution: "实现 Cloudflare Workers 图片代理，支持 WebP 格式转换与参数化尺寸调整；配合 Next.js 的 next/image 实现懒加载与占位色优化" },
      { problem: "AI 评测功能需要实时分析评论数据", solution: "设计分层评测策略：先用 LLM 批量分析离线评论生成要点标签，再通过 Cloudflare Workers AI 在线推理处理实时请求，兼顾响应速度与分析深度" },
    ],
  },
  {
    name: "MindFlow AI思维导图工具",
    role: "从零搭建",
    desc: "AI 思维导图生成工具，输入主题自动生成结构化导图，支持无限画布自由浏览与云端保存。基于 Canvas 实现拖拽缩放与节点交互，操作流畅顺手。",
    tech: ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS", "HTML5 Canvas", "DeepSeek API", "Cloudflare Pages", "Cloudflare D1", "JWT"],
    challenges: [
      { problem: "Canvas 画布需要同时支持拖拽平移与节点独立交互", solution: "自研事件分发机制，通过位移阈值和时序判断区分画布拖拽与节点点击，保证流畅操作的同时实现节点 hover 高亮与聚焦" },
      { problem: "AI 生成导图响应时间较长，用户等待体验差", solution: "接入 DeepSeek 流式 API，逐 token 解析 JSON 树结构后实时渲染到画布，配合缩放控件与缩略图导航，将等待转化为逐节点展开的动态呈现" },
      { problem: "全栈应用在免费额度内完成部署", solution: "利用 @cloudflare/next-on-pages 适配 Next.js App Router，以 D1 作为关系数据库、KV 作为缓存层，所有服务均运行在 Cloudflare 免费额度内" },
    ],
  },
];

const growthGoals = [
  { icon: TrendingUp, title: "技能提升", desc: "系统学习前端开发技术栈，深入掌握 React、TypeScript 等主流框架与工具链，为职业发展打下坚实基础" },
  { icon: Sparkles, title: "项目实践", desc: "积极参与工作室真实项目，在实战中积累协作经验，理解从需求分析到产品交付的完整开发流程" },
  { icon: Target, title: "持续成长", desc: "保持初学者心态，愿意投入时间与精力不断提升自己，跟随团队步伐快速成长" },
];

function PenguinIcon({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M21.395 15.035a40 40 0 0 0-.803-2.264l-1.079-2.695c.001-.032.014-.562.014-.836C19.526 4.632 17.351 0 12 0S4.474 4.632 4.474 9.241c0 .274.013.804.014.836l-1.08 2.695a39 39 0 0 0-.802 2.264c-1.021 3.283-.69 4.643-.438 4.673.54.065 2.103-2.472 2.103-2.472 0 1.469.756 3.387 2.394 4.771-.612.188-1.363.479-1.845.835-.434.32-.379.646-.301.778.343.578 5.883.369 7.482.189 1.6.18 7.14.389 7.483-.189.078-.132.132-.458-.301-.778-.483-.356-1.233-.646-1.846-.836 1.637-1.384 2.393-3.302 2.393-4.771 0 0 1.563 2.537 2.103 2.472.251-.03.581-1.39-.438-4.673Z" />
    </svg>
  );
}

const socials = [
  { icon: Mail, label: "Email", href: "mailto:Wayne.ren906@gmail.com", value: "Wayne.ren906@gmail.com", external: true },
  { icon: Phone, label: "电话", href: "tel:15095950906", value: "15095950906", external: false },
  { icon: PenguinIcon, label: "QQ", href: "tencent://message/?uin=2746682776", value: "2746682776", external: false },
  { icon: Github, label: "GitHub", href: "https://github.com/wayneren906-cmd", value: "@wayneren906-cmd", external: true },
];

const infoCards = [
  { icon: Code2, label: "技术方向", value: "前端开发", color: "indigo" },
  { icon: Award, label: "AI 工具", value: "Claude Code / Codex", color: "fuchsia" },
  { icon: BookOpen, label: "核心能力", value: "AI 驱动网页开发", color: "cyan" },
  { icon: Heart, label: "核心理念", value: "人定架构 · AI 实现", color: "emerald" },
];

function useScrollReveal(_threshold = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('pf-section-visible');
          setRevealed(true);
        } else {
          el.classList.remove('pf-section-visible');
          setRevealed(false);
        }
      },
      { threshold: 0, rootMargin: "0px 0px -80px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, revealed };
}

export default function Profile() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [visible, setVisible] = useState(false);
  const [showToTop, setShowToTop] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const avatarWrapRef = useRef<HTMLDivElement>(null);

  const handleCopy = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = value;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch {}
      document.body.removeChild(ta);
    }
    setCopiedKey(key);
    setToast(`已复制：${value}`);
    window.setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 1600);
    window.setTimeout(() => setToast(null), 1800);
  };

  useEffect(() => {
    document.title = "任韪岩 | 详细资料";
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

  useEffect(() => {
    const onScroll = () => setShowToTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className={cn("profile-root", theme, visible && "profile-visible")}>
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
        <div className="profile-glow" />

        {/* 顶栏 */}
        <div className="profile-topbar pf-fade">
          <button className="profile-back" onClick={() => navigate("/")} title="返回首页" aria-label="返回首页">
            <ArrowLeft size={18} />
          </button>
        </div>

        <div style={{ position: "fixed", top: 20, right: 24, zIndex: 9999 }}>
          <ThemeSwitcher />
        </div>

        {/* 章节侧边导航 */}
        <SectionNav />
        <div className="profile-main">
          {/* Hero */}
          <div className="pf-hero">
            <div ref={avatarWrapRef} className="pf-fade pf-avatar-wrap">
              <div className="pf-avatar-ring" />
              <div className="pf-avatar-inner">
                <AvatarPicker size={112} fallback="任" />
              </div>
            </div>
            <h1 className="pf-name pf-fade pf-d1">任韪岩</h1>
            <p className="pf-role pf-fade pf-d1">
              前端初学者 · AI 工具实践者
              <span style={{ margin: "0 10px", color: "var(--text-muted)", opacity: 0.5 }}>|</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                <MapPin size={12} />
                中国·重庆
              </span>
            </p>
            <p className="pf-tagline pf-fade pf-d2">
              人类提供架构思维，AI 负责繁琐的底层实现。
            </p>
            <div className="pf-hero-job pf-fade pf-d3">
              <Briefcase size={14} />
              <span>求职意向：<strong>前端开发</strong></span>
            </div>
            <div className="pf-hero-bubbles pf-fade pf-d4">
              <span className="pf-hero-bubble pf-hero-bubble-indigo" style={{ animationDelay: "0.42s" }}>React</span>
              <span className="pf-hero-bubble pf-hero-bubble-fuchsia" style={{ animationDelay: "0.46s" }}>Claude Code</span>
              <span className="pf-hero-bubble pf-hero-bubble-cyan" style={{ animationDelay: "0.50s" }}>AI Agent</span>
              <span className="pf-hero-bubble pf-hero-bubble-indigo" style={{ animationDelay: "0.54s" }}>TypeScript</span>
            </div>
            <div className="pf-hero-cta pf-fade pf-d5">
              <a
                className="pf-cta-primary"
                href="/resume.pdf"
                download="任韪岩-简历.pdf"
              >
                <Download size={16} />
                <span>下载简历</span>
              </a>
              <a
                className="pf-cta-secondary"
                href="#sec-social"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("sec-social")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                <Mail size={16} />
                <span>联系我</span>
              </a>
            </div>
          </div>

          {/* 信息卡片 — 气泡弹出风格 */}
          <SectionFade>
            <div className="pf-grid" id="sec-info">
              {infoCards.map((item, i) => (
                <div
                  className={`pf-info-bubble pf-info-bubble-${item.color}`}
                  key={item.label}
                  style={{ animationDelay: `${0.15 + i * 0.1}s, ${0.45 + i * 0.1}s, ${i * 0.2}s` }}
                >
                  <div className="pf-info-bubble-icon"><item.icon size={17} /></div>
                  <div className="pf-info-bubble-text">
                    <div className="pf-info-bubble-label">{item.label}</div>
                    <div className="pf-info-bubble-value">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </SectionFade>

          {/* 教育 */}
          <SectionFade delay={0.05}>
            <div className="pf-section" id="sec-edu">
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
          </SectionFade>

          {/* 技术能力 */}
          <SectionFade delay={0.1}>
            <div className="pf-section" id="sec-skills">
              <h2 className="pf-section-title"><Code2 /> 技术能力</h2>
              <div className="pf-card">
                {skillGroups.map((group, gi) => (
                  <div key={group.label} className={cn("pf-skill-group", `pf-skill-group-${group.color}`)}>
                    <div className="pf-skill-group-label">
                      <span className="pf-skill-group-dot" />
                      {group.label}
                    </div>
                    <div className="pf-skill-bubbles">
                      {group.items.map((s, i) => (
                        <SkillBubble
                          key={s.name}
                          name={s.name}
                          level={s.level}
                          index={gi * 10 + i}
                          color={group.color}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SectionFade>

          {/* 学习经历 */}
          <SectionFade delay={0.15}>
            <div className="pf-section" id="sec-learning">
              <h2 className="pf-section-title"><BookOpen /> 学习经历</h2>
              <div className="pf-timeline">
                {learnings.map((l, i) => (
                  <div
                    className="pf-learning pf-pop-item pf-pop-scale"
                    key={l.name}
                    style={{
                      "--enter-d": `${0.15 + i * 0.1}s`,
                      "--exit-d": `${(learnings.length - 1 - i) * 0.05}s`,
                    } as React.CSSProperties}
                  >
                    <div className="pf-learning-head">
                      <span className="pf-learning-name">{l.name}</span>
                      <span className="pf-learning-badge">{l.role}</span>
                    </div>
                    <p className="pf-learning-desc">{l.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </SectionFade>

          {/* 项目经验 */}
          <SectionFade delay={0.2}>
            <div className="pf-section" id="sec-projects">
              <h2 className="pf-section-title"><FolderGit2 /> 项目经验</h2>
              <div className="pf-projects">
                {projects.map((p, pi) => (
                  <ProjectCard project={p} index={pi} key={p.name} />
                ))}
              </div>
            </div>
          </SectionFade>

          {/* 成长目标 */}
          <SectionFade delay={0.25}>
            <div className="pf-section" id="sec-growth">
              <h2 className="pf-section-title"><Target /> 成长目标</h2>
              <div className="pf-card">
                {growthGoals.map((g, i) => {
                  const rowD = 0.15 + i * 0.18;
                  return (
                    <div className="pf-growth-item pf-pop-item pf-pop-up" key={g.title} style={{ transitionDelay: `${rowD}s` }}>
                      <div className="pf-growth-icon" style={{ transitionDelay: `${rowD + 0.08}s` }}><g.icon size={18} /></div>
                      <div className="pf-growth-body">
                        <span className="pf-growth-title">{g.title}</span>
                        <p className="pf-growth-desc">{g.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </SectionFade>

          {/* 社交 */}
          <SectionFade delay={0.3}>
            <div className="pf-section" id="sec-social">
              <h2 className="pf-section-title"><Link2 /> 社交与联系</h2>
              <div className="pf-card pf-socials">
                {socials.map((s, i) => (
                  <div className="pf-social-row pf-pop-item pf-pop-left" key={s.label} style={{ transitionDelay: `${i * 0.18}s` }}>
                    <a
                      className="pf-social-item"
                      href={s.href}
                      target={s.external ? "_blank" : undefined}
                      rel={s.external ? "noopener noreferrer" : undefined}
                    >
                      <div className="pf-social-icon"><s.icon size={18} /></div>
                      <div className="pf-social-text">
                        <div className="pf-social-label">{s.label}</div>
                        <div className="pf-social-value">{s.value}</div>
                      </div>
                      {s.external && <ExternalLink size={14} className="pf-social-arrow" />}
                    </a>
                    <button
                      type="button"
                      className={cn("pf-copy-btn", copiedKey === s.label && "copied")}
                      onClick={(e) => { e.preventDefault(); handleCopy(s.label, s.value); }}
                      title={`复制${s.label}`}
                      aria-label={`复制${s.label}`}
                    >
                      {copiedKey === s.label ? <Check size={15} /> : <Copy size={15} />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </SectionFade>
        </div>

        <button
          className={cn("profile-to-top", showToTop && "visible")}
          onClick={scrollToTop}
          title="回到顶部"
          aria-label="回到顶部"
        >
          <ArrowUp size={18} />
        </button>

        <div className={cn("copy-toast", toast && "show")} role="status" aria-live="polite">
          {toast}
        </div>
      </div>
  );
}

function SkillBubble({ name, level, index, color }: {
  name: string; level: number; index: number; color: string;
}) {
  const sizeScale = level >= 80 ? "lg" : level >= 70 ? "md" : "sm";

  return (
    <span
      className={cn("pf-skill-bubble", `pf-skill-${sizeScale}`, `pf-skill-${color}`, "pf-skill-pop")}
      style={{ animationDelay: `${index * 0.08}s, ${0.45 + index * 0.08}s, ${index * 0.2}s` }}
    >
      <span className="pf-skill-bubble-name">{name}</span>
    </span>
  );
}

function SectionFade({ children, delay = 0, manualReveal }: {
  children: React.ReactNode; delay?: number; manualReveal?: boolean;
}) {
  const autoReveal = useScrollReveal(0.2);
  const revealed = manualReveal !== undefined ? manualReveal : autoReveal.revealed;
  const ref = manualReveal !== undefined ? { current: null } : autoReveal.ref;

  return (
    <div ref={ref} className={cn("pf-section-fade", revealed && "pf-section-visible")} style={{ transitionDelay: `${delay}s` }}>
      {children}
    </div>
  );
}

function ProjectCard({ project, index }: {
  project: typeof projects[number]; index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
        else setInView(false);
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={cn("pf-project-card pf-pop-item pf-pop-up", inView && "pf-card-in")}
      style={{ transitionDelay: `${0.15 + index * 0.12}s` }}
    >
      <div className="pf-project-index">{String(index + 1).padStart(2, "0")}</div>
      <div className="pf-project-head pf-stage pf-stage-1">
        <span className="pf-project-name">{project.name}</span>
        <span className="pf-project-badge">{project.role}</span>
      </div>
      <p className="pf-project-desc pf-stage pf-stage-1">{project.desc}</p>
      <div className="pf-project-tech-list pf-stage pf-stage-2">
        {project.tech.map((t, ti) => (
          <span
            className="pf-project-tech-chip pf-chip-pop"
            key={t}
            style={{ transitionDelay: `${0.25 + ti * 0.04}s` }}
          >
            {t}
          </span>
        ))}
      </div>
      <div className="pf-project-challenges pf-stage pf-stage-3">
        {project.challenges.map((c, ci) => (
          <div
            className="pf-project-challenge pf-challenge-slide"
            key={ci}
            style={{ animationDelay: `${0.15 + index * 0.12 + ci * 0.1}s` }}
          >
            <div className="pf-challenge-head">
              <span className="pf-challenge-label">难点 {ci + 1}</span>
              <span className="pf-challenge-text">{c.problem}</span>
            </div>
            <div className="pf-challenge-solution">
              <span className="pf-challenge-arrow">→</span>
              {c.solution}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const navSections: { id: string; label: string }[] = [
  { id: "sec-info", label: "信息" },
  { id: "sec-edu", label: "教育背景" },
  { id: "sec-skills", label: "技术能力" },
  { id: "sec-learning", label: "学习经历" },
  { id: "sec-projects", label: "项目经验" },
  { id: "sec-growth", label: "成长目标" },
  { id: "sec-social", label: "社交" },
];

function SectionNav() {
  const [active, setActive] = useState<string>(navSections[0].id);

  useEffect(() => {
    const elements = navSections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => !!el);
    if (!elements.length) return;
    const visible = new Map<string, number>();
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.set(entry.target.id, entry.intersectionRatio);
          } else {
            visible.delete(entry.target.id);
          }
        }
        if (visible.size > 0) {
          const top = [...visible.entries()].sort((a, b) => b[1] - a[1])[0][0];
          setActive(top);
        }
      },
      { threshold: [0.1, 0.4, 0.7], rootMargin: "-20% 0px -40% 0px" }
    );
    elements.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const goTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <nav className="pf-nav" aria-label="章节导航">
      {navSections.map((s) => (
        <button
          key={s.id}
          className={cn("pf-nav-dot", active === s.id && "active")}
          onClick={() => goTo(s.id)}
          title={s.label}
          aria-label={`跳转到${s.label}`}
        >
          <span className="pf-nav-dot-label">{s.label}</span>
        </button>
      ))}
    </nav>
  );
}
