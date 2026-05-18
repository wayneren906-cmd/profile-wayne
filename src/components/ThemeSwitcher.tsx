import { useState, useRef, useEffect } from "react";
import { Sun, Moon, Sparkles, Aperture, GitBranch } from "lucide-react";
import { useTheme, type Theme } from "@/hooks/useTheme";

const themeList: { key: Theme; label: string; icon: typeof Sun }[] = [
  { key: "light", label: "晨曦", icon: Sun },
  { key: "dark", label: "深空", icon: Moon },
  { key: "nebula", label: "星云", icon: Sparkles },
  { key: "xuanjing", label: "玄镜", icon: Aperture },
  { key: "liuxian", label: "流线", icon: GitBranch },
];

export default function ThemeSwitcher({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const uid = useRef(`ts-${Math.random().toString(36).slice(2, 8)}`).current;
  const wrapRef = useRef<HTMLDivElement>(null);

  // 全局事件委托
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const btn = (e.target as HTMLElement).closest(`[data-ts-btn="${uid}"]`);
      const item = (e.target as HTMLElement).closest(`[data-ts-item="${uid}"]`);

      if (btn) {
        e.stopPropagation();
        setOpen((v) => !v);
        return;
      }

      if (item) {
        const key = item.getAttribute('data-ts-key') as Theme;
        setTheme(key);
        setOpen(false);
        return;
      }

      // 点击外部关闭
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [uid, setTheme]);

  const current = themeList.find((t) => t.key === theme)!;
  const Icon = current.icon;

  return (
    <div ref={wrapRef} className={`theme-switcher-wrap ${className}`}>
      <style>{`
        .theme-switcher-wrap { position: relative; z-index: 100; }
        .theme-switcher-btn {
          width: 40px; height: 40px; border-radius: 50%;
          border: 1px solid var(--border);
          background: var(--bg-card); backdrop-filter: blur(12px);
          color: var(--text-secondary); cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.3s ease;
        }
        .theme-switcher-btn:hover {
          border-color: var(--accent); color: var(--accent);
          box-shadow: 0 0 0 6px var(--accent-glow);
        }
        .theme-switcher-menu {
          position: absolute; top: calc(100% + 8px); right: 0;
          min-width: 130px;
          background: var(--bg-card); backdrop-filter: blur(16px);
          border: 1px solid var(--border); border-radius: 14px;
          padding: 6px; box-shadow: var(--shadow-card);
          display: none;
        }
        .theme-switcher-menu.show { display: block; }
        .theme-switcher-item {
          display: flex; align-items: center; gap: 10px;
          width: 100%; padding: 9px 12px; border-radius: 10px;
          color: var(--text-secondary);
          font-size: 13px; font-weight: 500; cursor: pointer;
          transition: all 0.2s ease;
        }
        .theme-switcher-item:hover {
          background: var(--accent-glow); color: var(--accent);
        }
        .theme-switcher-item.active { color: var(--accent); }
        .theme-switcher-dot {
          margin-left: auto; width: 6px; height: 6px;
          border-radius: 50%; background: var(--accent);
        }
      `}</style>
      <button
        className="theme-switcher-btn"
        data-ts-btn={uid}
        title="切换主题"
      >
        <Icon size={18} />
      </button>
      <div className={`theme-switcher-menu ${open ? "show" : ""}`}>
        {themeList.map((t) => {
          const ItemIcon = t.icon;
          return (
            <div
              key={t.key}
              data-ts-item={uid}
              data-ts-key={t.key}
              className={`theme-switcher-item ${t.key === theme ? "active" : ""}`}
            >
              <ItemIcon size={16} />
              <span>{t.label}</span>
              {t.key === theme && <span className="theme-switcher-dot" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
