# 详情页 Hero 重构 + 首页气泡优化 — 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 重构详情页 Hero 区域（融入求职意向+技能气泡），调整教育背景位置，优化项目难点动画，将首页标签改为渐变色浮动气泡。

**Architecture:** 纯前端改动，涉及 2 个页面组件和 2 个 CSS 文件。遵循现有 React + TypeScript + Tailwind CSS 模式，复用已有的 CSS 动画 keyframes（bubblePop / bubbleFloat / bubbleGradient）。

**Tech Stack:** React 18, TypeScript, Vite 6, Tailwind CSS 3, Framer Motion

---

## 文件变更总览

| 文件 | 操作 | 职责 |
|------|------|------|
| `src/pages/Profile.tsx` | 修改 | Hero 重构、section 顺序调整、navSections 更新、难点动画参数 |
| `src/pages/Home.tsx` | 修改 | 标签添加颜色分组 className |
| `src/styles/profile.css` | 修改 | 新增 fadeSlideUp keyframe、Hero 新增元素样式、难点动画类更新 |
| `src/styles/home.css` | 修改 | `.home-tag` 重写为气泡样式、新增气泡动画 keyframes |

---

### Task 1: 首页标签气泡化 — CSS 动画 keyframes

**Files:**
- Modify: `src/styles/home.css`

在 home.css 中新增气泡动画所需的 keyframes（bubblePop / bubbleFloat / bubbleGradient），如果 profile.css 已定义则跳过 bubblePop 和 bubbleGradient（它们已在 profile.css 中定义，home.css 可直接引用）。

- [ ] **Step 1: 在 home.css 末尾添加动画 keyframes**

home.css 的入场动画通过 `home-visible` class 触发，气泡需要 `bubblePop` / `bubbleFloat` / `bubbleGradient`。检查 profile.css 中已定义这些 keyframes，由于两个 CSS 文件都会加载到同一页面，home.css 可以直接使用。

在 `src/styles/home.css` 末尾添加 `bubbleFloat` keyframe（如果尚不存在于全局）：

```css
/* 气泡动画 — 复用 profile.css 中的 bubblePop / bubbleGradient，此处仅补 float */
@keyframes tagFloat {
  0%, 100% { translate: 0 0; }
  25% { translate: 3px -3px; }
  75% { translate: -3px -5px; }
}
```

- [ ] **Step 2: 验证 — TypeScript 类型检查**

```bash
npm run check
```
Expected: 通过（CSS 变更不影响 TS）

- [ ] **Step 3: Commit**

```bash
git add src/styles/home.css
git commit -m "feat: add bubble float keyframe for home tags"
```

---

### Task 2: 重写首页标签为气泡样式

**Files:**
- Modify: `src/styles/home.css`
- Modify: `src/pages/Home.tsx`

- [ ] **Step 1: 重写 `.home-tag` 样式**

替换 `src/styles/home.css` 中的 `.home-tag` 样式块（约第 427-458 行）：

**替换前：**
```css
.home-tag {
  font-size: 12px; padding: 6px 14px;
  border-radius: 980px;
  background: var(--tag-bg);
  color: var(--tag-text);
  font-weight: 500;
  letter-spacing: -0.005em;
  border: 1px solid transparent;
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1),
              background 0.4s cubic-bezier(0.22, 1, 0.36, 1),
              color 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  cursor: default;
  animation: tagPop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
.home-tag:nth-child(1) { animation-delay: 0.55s; }
/* ... etc through nth-child(9) */
@keyframes tagPop {
  from { opacity: 0; transform: scale(0); }
  to   { opacity: 1; transform: scale(1); }
}
.home-tag:hover {
  background: var(--accent);
  color: #fff;
  transform: translateY(-1px);
}
```

**替换为：**
```css
/* 标签 — 渐变色浮动气泡 */
.home-tags {
  display: flex; flex-wrap: wrap; justify-content: center; gap: 8px;
  margin-bottom: 20px;
}

.home-tag {
  --ht-color: #6366f1;
  --ht-color2: #8b5cf6;
  position: relative;
  display: inline-flex; align-items: center;
  font-size: 12px; padding: 7px 15px;
  border-radius: 100px;
  font-weight: 600;
  letter-spacing: -0.005em;
  background:
    linear-gradient(135deg,
      color-mix(in srgb, var(--ht-color) 14%, transparent),
      color-mix(in srgb, var(--ht-color2) 16%, transparent),
      color-mix(in srgb, var(--ht-color) 14%, transparent));
  background-size: 200% 200%;
  border: 1px solid color-mix(in srgb, var(--ht-color) 22%, transparent);
  color: var(--text);
  cursor: default;
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 0.35s ease,
              background 0.35s ease,
              border-color 0.35s ease,
              color 0.35s ease;
  will-change: transform;
  opacity: 0;
  transform: scale(0);
}
.home-visible .home-tag {
  animation: bubblePop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) forwards,
             tagFloat 3s ease-in-out infinite,
             bubbleGradient 4s ease-in-out infinite;
}

/* 颜色变体 */
.home-tag-indigo  { --ht-color: #6366f1; --ht-color2: #8b5cf6; }
.home-tag-fuchsia { --ht-color: #d946ef; --ht-color2: #f472b6; }
.home-tag-cyan    { --ht-color: #06b6d4; --ht-color2: #3b82f6; }

/* 保持原有 stagger 延迟 */
.home-tag:nth-child(1) { animation-delay: 0.55s, 0.55s, 0.55s; }
.home-tag:nth-child(2) { animation-delay: 0.61s, 0.61s, 0.61s; }
.home-tag:nth-child(3) { animation-delay: 0.67s, 0.67s, 0.67s; }
.home-tag:nth-child(4) { animation-delay: 0.73s, 0.73s, 0.73s; }
.home-tag:nth-child(5) { animation-delay: 0.79s, 0.79s, 0.79s; }
.home-tag:nth-child(6) { animation-delay: 0.85s, 0.85s, 0.85s; }
.home-tag:nth-child(7) { animation-delay: 0.91s, 0.91s, 0.91s; }
.home-tag:nth-child(8) { animation-delay: 0.97s, 0.97s, 0.97s; }
.home-tag:nth-child(9) { animation-delay: 1.03s, 1.03s, 1.03s; }

.home-tag:hover {
  border-color: var(--ht-color) !important;
  background: linear-gradient(135deg, var(--ht-color), var(--ht-color2)) !important;
  color: #fff !important;
  transform: translateY(-4px) scale(1.05) !important;
  box-shadow: 0 10px 28px color-mix(in srgb, var(--ht-color) 38%, transparent),
              0 0 0 4px color-mix(in srgb, var(--ht-color) 14%, transparent);
}

/* 移除旧 tagPop（已被 bubblePop 替代） */
```

- [ ] **Step 2: 在 Home.tsx 中给标签分配颜色**

修改 `src/pages/Home.tsx` 第 126-136 行的标签：

```tsx
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
```

- [ ] **Step 3: 验证**

```bash
npm run check && npm run build
```
Expected: 通过

- [ ] **Step 4: 启动开发服务器确认视觉效果**

```bash
npm run dev
```
打开浏览器确认首页标签呈现渐变色气泡效果，hover 时全色填充+上浮+光晕。

- [ ] **Step 5: Commit**

```bash
git add src/styles/home.css src/pages/Home.tsx
git commit -m "feat: transform home tags into gradient floating bubbles"
```

---

### Task 3: 调整详情页 section 顺序（教育背景提前）

**Files:**
- Modify: `src/pages/Profile.tsx`

纯结构调整 —— 将"教育背景" JSX 块移动到"技术能力"之前，同步更新 `navSections` 数组。

- [ ] **Step 1: 移动 JSX 块**

在 `src/pages/Profile.tsx` 中：

1. 剪切第 354-368 行的教育背景 SectionFade 块
2. 粘贴到第 325 行（技术能力 SectionFade 之前）

- [ ] **Step 2: 更新侧边导航顺序**

修改 `navSections` 数组（第 574-583 行）：

**替换前：**
```tsx
const navSections: { id: string; label: string }[] = [
  { id: "sec-job", label: "求职意向" },
  { id: "sec-info", label: "信息" },
  { id: "sec-skills", label: "技术能力" },
  { id: "sec-edu", label: "教育背景" },
  { id: "sec-learning", label: "学习经历" },
  { id: "sec-projects", label: "项目经验" },
  { id: "sec-growth", label: "成长目标" },
  { id: "sec-social", label: "社交" },
];
```

**替换为：**
```tsx
const navSections: { id: string; label: string }[] = [
  { id: "sec-job", label: "求职意向" },
  { id: "sec-info", label: "信息" },
  { id: "sec-edu", label: "教育背景" },
  { id: "sec-skills", label: "技术能力" },
  { id: "sec-learning", label: "学习经历" },
  { id: "sec-projects", label: "项目经验" },
  { id: "sec-growth", label: "成长目标" },
  { id: "sec-social", label: "社交" },
];
```

同时更新教育背景 SectionFade 的 `delay` 和技术能力的 `delay`：
- 教育背景：原 `delay={0.1}` → 改为 `delay={0.05}`（与之前技术能力位置一致）
- 技术能力：原 `delay={0.05}` → 改为 `delay={0.1}`（与之前教育背景位置一致）

- [ ] **Step 3: 验证**

```bash
npm run check && npm run build
```
Expected: 通过

- [ ] **Step 4: 启动 dev server 确认顺序正确**

- [ ] **Step 5: Commit**

```bash
git add src/pages/Profile.tsx
git commit -m "feat: move education section before technical skills"
```

---

### Task 4: 项目难点动画优化

**Files:**
- Modify: `src/styles/profile.css`
- Modify: `src/pages/Profile.tsx`

- [ ] **Step 1: 在 profile.css 中添加 fadeSlideUp keyframe**

在 `src/styles/profile.css` 中 `@keyframes bubbleGradient` 定义之后添加：

```css
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

- [ ] **Step 2: 修改 `.pf-challenge-slide` 样式**

替换 `src/styles/profile.css` 第 1201-1208 行：

**替换前：**
```css
.pf-challenge-slide {
  opacity: 0;
  transform: scale(0);
  transition: background 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}
.pf-card-in .pf-challenge-slide {
  animation: bubblePop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
```

**替换为：**
```css
.pf-challenge-slide {
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.55s cubic-bezier(0.22, 1, 0.36, 1),
              transform 0.55s cubic-bezier(0.22, 1, 0.36, 1),
              background 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}
.pf-card-in .pf-challenge-slide {
  animation: fadeSlideUp 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
```

- [ ] **Step 3: 更新 ProjectCard 组件中的动画延迟参数**

在 `src/pages/Profile.tsx` 的 `ProjectCard` 组件中（第 552-568 行），将每个 challenges 的 `animationDelay` 值更新为更自然的 stagger：

**替换前：**
```tsx
<div
  className="pf-project-challenge pf-challenge-slide"
  key={ci}
  style={{ animationDelay: `${0.5 + ci * 0.12}s` }}
>
```

**替换为：**
```tsx
<div
  className="pf-project-challenge pf-challenge-slide"
  key={ci}
  style={{ animationDelay: `${0.15 + index * 0.12 + ci * 0.1}s` }}
>
```

这会使得：
- 项目 0 难点 1: 0.15s, 难点 2: 0.25s, 难点 3: 0.35s
- 项目 1 难点 1: 0.27s, 难点 2: 0.37s, 难点 3: 0.47s

- [ ] **Step 4: 验证**

```bash
npm run check && npm run build
```
Expected: 通过

- [ ] **Step 5: Commit**

```bash
git add src/styles/profile.css src/pages/Profile.tsx
git commit -m "feat: replace challenge bubblePop with smoother fadeSlideUp animation"
```

---

### Task 5: 详情页 Hero 重构 — CSS 准备

**Files:**
- Modify: `src/styles/profile.css`

- [ ] **Step 1: 添加 Hero 求职意向胶囊样式**

在 `src/styles/profile.css` 中 `.pf-hero-cta` 样式块之前添加：

```css
/* Hero 求职意向胶囊 */
.pf-hero-job {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 16px;
  border-radius: 980px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  backdrop-filter: blur(var(--blur)) saturate(180%);
  -webkit-backdrop-filter: blur(var(--blur)) saturate(180%);
  box-shadow: var(--shadow-sm);
  font-size: 12.5px;
  color: var(--text-secondary);
  letter-spacing: -0.005em;
  margin-bottom: 12px;
}
.pf-hero-job svg {
  color: var(--accent);
  opacity: 0.85;
}
.pf-hero-job strong {
  color: var(--text);
  font-weight: 600;
}
```

- [ ] **Step 2: 添加 Hero 技能气泡容器样式**

```css
/* Hero 技能气泡行 */
.pf-hero-bubbles {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-bottom: 14px;
}
.pf-hero-bubble {
  --hb-color: #6366f1;
  --hb-color2: #8b5cf6;
  position: relative;
  display: inline-flex; align-items: center;
  font-size: 12px; padding: 6px 14px;
  border-radius: 100px;
  font-weight: 600;
  letter-spacing: -0.005em;
  background:
    linear-gradient(135deg,
      color-mix(in srgb, var(--hb-color) 14%, transparent),
      color-mix(in srgb, var(--hb-color2) 16%, transparent),
      color-mix(in srgb, var(--hb-color) 14%, transparent));
  background-size: 200% 200%;
  border: 1px solid color-mix(in srgb, var(--hb-color) 22%, transparent);
  color: var(--text);
  cursor: default;
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 0.35s ease,
              background 0.35s ease,
              border-color 0.35s ease,
              color 0.35s ease;
  will-change: transform;
  opacity: 0;
  transform: scale(0);
}
.pf-hero-bubble-indigo  { --hb-color: #6366f1; --hb-color2: #8b5cf6; }
.pf-hero-bubble-fuchsia { --hb-color: #d946ef; --hb-color2: #f472b6; }
.pf-hero-bubble-cyan    { --hb-color: #06b6d4; --hb-color2: #3b82f6; }
.profile-visible .pf-hero-bubble {
  animation: bubblePop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) forwards,
             bubbleFloat 3s ease-in-out infinite,
             bubbleGradient 4s ease-in-out infinite;
}
.pf-hero-bubble:hover {
  border-color: var(--hb-color) !important;
  background: linear-gradient(135deg, var(--hb-color), var(--hb-color2)) !important;
  color: #fff !important;
  transform: translateY(-4px) scale(1.05) !important;
  box-shadow: 0 10px 28px color-mix(in srgb, var(--hb-color) 38%, transparent),
              0 0 0 4px color-mix(in srgb, var(--hb-color) 14%, transparent);
}
```

- [ ] **Step 3: 验证**

```bash
npm run check
```
Expected: 通过

- [ ] **Step 4: Commit**

```bash
git add src/styles/profile.css
git commit -m "feat: add hero job pill and bubble styles for profile page"
```

---

### Task 6: 详情页 Hero 重构 — JSX 改动

**Files:**
- Modify: `src/pages/Profile.tsx`

- [ ] **Step 1: 在 Hero 区域添加求职意向胶囊和技能气泡**

修改 `src/pages/Profile.tsx` 第 260-294 行的 Hero 区域，在标语后、CTA 前插入新元素。

**替换前 (第 260-294 行)：**
```tsx
{/* Hero */}
<div className="pf-hero">
  <div ref={avatarWrapRef} className="pf-fade pf-avatar-wrap">
    <div className="pf-avatar-ring" />
    <div className="pf-avatar-inner">
      <AvatarPicker size={104} fallback="任" />
    </div>
  </div>
  <h1 className="pf-name pf-fade pf-d1">任韪岩</h1>
  <p className="pf-role pf-fade pf-d1">前端初学者 · AI 工具实践者</p>
  <p className="pf-tagline pf-fade pf-d2">
    人类提供架构思维，AI 负责繁琐的底层实现。
  </p>
  <div className="pf-hero-cta pf-fade pf-d2">
    <a ...>下载简历</a>
    <a ...>联系我</a>
  </div>
</div>
```

**替换为：**
```tsx
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
    <span className="pf-hero-meta-dot" style={{ margin: "0 8px" }} />
    <MapPin size={12} style={{ verticalAlign: "middle", marginRight: 2 }} />
    中国·重庆
  </p>
  <p className="pf-tagline pf-fade pf-d2">
    人类提供架构思维，AI 负责繁琐的底层实现。
  </p>
  <div className="pf-hero-job pf-fade pf-d3">
    <Briefcase size={14} />
    <span>求职意向：<strong>前端开发</strong></span>
  </div>
  <div className="pf-hero-bubbles pf-fade pf-d4">
    <span className="pf-hero-bubble pf-hero-bubble-indigo" style={{ animationDelay: "0.42s, 0.42s, 0.42s" }}>React</span>
    <span className="pf-hero-bubble pf-hero-bubble-fuchsia" style={{ animationDelay: "0.46s, 0.46s, 0.46s" }}>Claude Code</span>
    <span className="pf-hero-bubble pf-hero-bubble-cyan" style={{ animationDelay: "0.50s, 0.50s, 0.50s" }}>AI Agent</span>
    <span className="pf-hero-bubble pf-hero-bubble-indigo" style={{ animationDelay: "0.54s, 0.54s, 0.54s" }}>TypeScript</span>
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
```

**注意：** `Briefcase` 图标已在文件顶部导入（第 32 行 import 中已有），`MapPin` 也已导入。

- [ ] **Step 2: 移除独立求职意向卡片**

删除原来的独立求职意向 SectionFade 块（原第 296-305 行）：

```tsx
{/* 删除以下代码块 */}
{/* 求职意向 */}
<SectionFade delay={0.05}>
  <div className="pf-job-card" id="sec-job">
    ...
  </div>
</SectionFade>
```

- [ ] **Step 3: 更新 navSections 移除求职意向入口**

既然求职意向已融入 Hero，侧边导航需移除该条目：

```tsx
const navSections: { id: string; label: string }[] = [
  { id: "sec-info", label: "信息" },
  { id: "sec-edu", label: "教育背景" },
  { id: "sec-skills", label: "技术能力" },
  { id: "sec-learning", label: "学习经历" },
  { id: "sec-projects", label: "项目经验" },
  { id: "sec-growth", label: "成长目标" },
  { id: "sec-social", label: "社交" },
];
```

- [ ] **Step 4: 调整级联延迟**

更新受影响的 `pf-d*` 延迟值：
- Hero 求职意向胶囊: `pf-d3`（新增）
- Hero 技能气泡: `pf-d4`（新增）
- Hero CTA 按钮: 从 `pf-d2` 改为 `pf-d5`（因为前面多了两个元素）
- 信息卡片 SectionFade: `delay={0}`（不变，仍为第一个 section）

- [ ] **Step 5: 验证**

```bash
npm run check && npm run build
```
Expected: 通过

- [ ] **Step 6: 启动 dev server 确认 Hero 视觉效果**

```bash
npm run dev
```
检查点：
1. Hero 区域从上到下：头像 → 姓名 → 角色+位置 → 标语 → 求职意向胶囊 → 技能气泡 → CTA
2. 技能气泡有渐变色背景、浮动动画
3. Hover 气泡有全色填充 + 上浮效果
4. 原来独立的求职意向卡片已移除
5. 侧边导航不再包含"求职意向"

- [ ] **Step 7: Commit**

```bash
git add src/pages/Profile.tsx
git commit -m "feat: redesign profile hero with job pill and skill bubbles"
```

---

### Task 7: 最终验证与清理

**Files:**
- 检查: `src/styles/profile.css`（确认 `.pf-job-card` 样式是否需要保留）
- 检查: 所有 5 套主题兼容性

- [ ] **Step 1: 检查未使用 CSS**

`pf-job-card` 样式仍在 profile.css 中但不再被 JSX 引用。保留该样式（可能未来复用），或若确认不需要则移除。

保留 `pf-job-card` 样式 —— 它是通用样式，不影响功能。

- [ ] **Step 2: 全主题验证**

```bash
npm run build
```
Expected: 通过。启动 dev server 后切换所有 5 套主题（晨曦/深空/星云/玄镜/流线），确认：
- 首页气泡在各主题下颜色正常
- 详情页 Hero 新元素在各主题下可读
- 难点动画在各主题下流畅

- [ ] **Step 3: Commit（如有遗留调整）**

```bash
git add -A
git commit -m "chore: final polish for hero redesign and bubble optimization"
```

---

## 验证清单总结

实施完成后运行：

```bash
npm run check        # TypeScript 类型检查
npm run build        # 生产构建
npm run dev          # 手动视觉验证
```

视觉验证要点：
- [ ] 首页标签为渐变色浮动气泡，hover 全色填充
- [ ] 详情页 Hero 包含求职意向胶囊 + 4 个技能气泡
- [ ] 原独立求职意向卡片已移除
- [ ] 教育背景在技术能力之前
- [ ] 侧边导航顺序正确
- [ ] 项目难点卡片为淡入滑升动画（非弹跳弹出）
- [ ] 5 套主题均无异常
- [ ] 移动端响应式无溢出
