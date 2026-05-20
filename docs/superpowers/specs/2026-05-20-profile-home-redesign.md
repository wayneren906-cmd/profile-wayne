# 详情页 Hero 重构 + 首页气泡优化 — 设计文档

**日期**: 2026-05-20
**方案**: A — 渐进增强

---

## 1. 详情页 Hero 重构

### 当前状态

Hero 区域包含：头像、姓名、角色、标语、两个 CTA 按钮。求职意向在 Hero 下方作为独立卡片。

### 目标

增加信息密度和视觉冲击力，将求职意向和核心技能标签融入 Hero。

### 新 Hero 结构（从上到下）

| 序号 | 元素 | 说明 |
|------|------|------|
| 1 | 头像 | 保持旋转光环 + 3D 倾斜，尺寸 112px |
| 2 | 姓名 | 保持渐变动画 |
| 3 | 角色 + 位置 | "前端初学者 · AI 工具实践者" + "中国·重庆"，同行显示 |
| 4 | 标语 | "人类提供架构思维，AI 负责繁琐的底层实现" |
| 5 | 求职意向胶囊 | 新增，半透明玻璃态胶囊："求职意向：前端开发" |
| 6 | 核心技能气泡 | 新增，3-5 个关键词（React、Claude Code、AI Agent、TypeScript） |
| 7 | CTA 按钮 | 下载简历 + 联系我 |

### 动画编排

- 求职意向胶囊：`pf-fade pf-d3`
- 技能气泡：`pf-fade pf-d4`，每个气泡 stagger 0.04s
- 气泡复用 `bubblePop` + `bubbleFloat` + `bubbleGradient` 动画

### 移除

- 原有的独立"求职意向"卡片 (`pf-job-card`) 融入 Hero 后移除

---

## 2. 教育背景提前

### 改动

将"教育背景"section 移动到"技术能力"section 之前。

### 调整后的顺序

1. 求职意向（已融入 Hero）
2. 信息卡片
3. **教育背景** ← 提前
4. 技术能力
5. 学习经历
6. 项目经验
7. 成长目标
8. 社交

### 涉及文件

- `src/pages/Profile.tsx`: 移动 JSX 块位置 + 更新 `navSections` 数组

---

## 3. 首页标签气泡化

### 当前状态

`.home-tag` 为简单药丸样式：单色半透明背景 + 单色文字 + `tagPop` 入场动画。

### 目标

改为和详情页 `.pf-skill-bubble` 一致的渐变色浮动气泡。

### 样式改动 (`src/styles/home.css`)

- **背景**: 渐变色半透明背景（三色轮换：indigo / fuchsia / cyan）
- **边框**: 对应颜色的半透明边框
- **入场动画**: `bubblePop` 弹出（保持现有 nth-child stagger 延迟）
- **常驻动画**: `bubbleFloat` 浮动 + `bubbleGradient` 渐变呼吸
- **Hover**: 全色填充渐变背景 + `translateY(-4px) scale(1.05)` + 光晕 `box-shadow` + 文字变白

### 标签颜色分配

| 标签 | 颜色组 |
|------|--------|
| React, TypeScript, Vite | indigo (蓝紫) |
| Claude Code, AI Agent, Prompt Engineering | fuchsia (粉紫) |
| Trae, Cloudflare, 前端开发 | cyan (青蓝) |

---

## 4. 项目难点动画优化

### 当前状态

难点卡片使用 `bubblePop` 动画（scale 0→1，弹性缓出），stagger 固定 0.12s。

### 目标

改为更流畅、更专业的级联淡入滑升动画。

### 改动 (`src/styles/profile.css`)

- **动画类型**: `bubblePop` → `fadeSlideUp`（`translateY(12px)` + `opacity(0)` → 原位淡入）
- **缓动函数**: `cubic-bezier(0.22, 1, 0.36, 1)`，与页面其他入场动画统一
- **Stagger 节奏**: 改为基于项目卡片入场时间的动态延迟
  - 公式: 项目入场延迟 + 0.15s + ci × 0.1s（ci = 难点序号）
  - 实际值: 难点 1 约 0.55s, 难点 2 约 0.65s, 难点 3 约 0.75s

### CSS 关键帧

```css
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

---

## 5. 文件变更清单

| 文件 | 变更类型 |
|------|----------|
| `src/pages/Profile.tsx` | Hero 重构、教育背景移动、navSections 更新、难点动画参数调整 |
| `src/pages/Home.tsx` | 标签颜色分配（添加 className） |
| `src/styles/profile.css` | 新增 Hero 胶囊样式、新增 fadeSlideUp keyframe、更新难点动画类 |
| `src/styles/home.css` | 重写 `.home-tag` 为气泡样式、新增气泡动画 keyframes |

---

## 6. 不变内容

- 头像旋转光环和 3D 倾斜效果
- 姓名渐变动画
- 信息卡片（4 个气泡卡片）保持原样
- 学习经历、成长目标、社交部分的布局和动画
- 主题切换系统（5 套主题兼容）
- 响应式布局断点
