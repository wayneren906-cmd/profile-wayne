import { useState, useRef, useCallback, useEffect } from "react";
import { Camera } from "lucide-react";

interface AvatarPickerProps {
  size: number;
  fallback: string;
  className?: string;
}

const STORAGE_KEY = "profile_avatar";
const DEFAULT_AVATAR = "/avatar.webp";

function getSavedAvatar(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function saveAvatar(dataUrl: string) {
  try {
    localStorage.setItem(STORAGE_KEY, dataUrl);
  } catch {
    // 存储空间不足时静默失败
  }
}

export default function AvatarPicker({ size, fallback, className = "" }: AvatarPickerProps) {
  const [avatar, setAvatar] = useState<string | null>(getSavedAvatar);
  const inputRef = useRef<HTMLInputElement>(null);

  // 同步跨组件更新（同一页面多个 AvatarPicker 实例）
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setAvatar(e.newValue);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      saveAvatar(dataUrl);
      setAvatar(dataUrl);
      // 手动触发 storage 事件以同步同页面其他实例
      window.dispatchEvent(
        new StorageEvent("storage", { key: STORAGE_KEY, newValue: dataUrl })
      );
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }, []);

  return (
    <div
      className={`avatar-picker ${className}`.trim()}
      style={{ width: size, height: size, cursor: "pointer" }}
      onClick={handleClick}
      title="点击更换头像"
    >
      <style>{`
        .avatar-picker {
          position: relative;
          border-radius: 50%;
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          user-select: none;
          background: linear-gradient(135deg, #6366f1, #8b5cf6, #a78bfa);
          font-weight: 700;
          color: #fff;
        }
        .avatar-picker img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          aspect-ratio: 1;
        }
        .avatar-picker .avatar-fallback {
          font-size: ${size * 0.36}px;
        }
        .avatar-picker .avatar-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s;
          color: #fff;
        }
        .avatar-picker:hover .avatar-overlay {
          opacity: 1;
        }
      `}</style>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFile}
      />
      <img src={avatar || DEFAULT_AVATAR} alt="头像" fetchPriority="high" onError={(e) => {
        const t = e.currentTarget;
        if (t.src.endsWith('.webp')) t.src = '/avatar-sm.jpg';
      }} />
      <div className="avatar-overlay">
        <Camera size={size * 0.22} />
      </div>
    </div>
  );
}
