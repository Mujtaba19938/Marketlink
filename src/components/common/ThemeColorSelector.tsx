import React from 'react';
import { useTheme } from '../../theme';
import { ThemePaletteId } from '../../theme/tokens';
import { Sun, Moon, Laptop, Check, Palette, Sparkles, RefreshCw } from 'lucide-react';

interface ThemeColorSelectorProps {
  compact?: boolean;
}

export const ThemeColorSelector: React.FC<ThemeColorSelectorProps> = ({
  compact = false,
}) => {
  const {
    mode,
    resolvedMode,
    palette,
    currentPaletteConfig,
    availablePalettes,
    setMode,
    setPalette,
  } = useTheme();

  return (
    <div className="space-y-6">
      {/* 1. Light vs Dark Mode Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Display Mode (Light / Dark)</span>
          </label>
          <span className="text-[11px] font-medium text-slate-400 capitalize">
            Current: <strong className="text-slate-700">{resolvedMode} mode</strong>
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={() => setMode('light')}
            className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
              mode === 'light'
                ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)] border-[var(--color-primary)] shadow-sm ring-2 ring-[var(--color-primary)]/20'
                : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100'
            }`}
          >
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Light Mode</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('dark')}
            className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
              mode === 'dark'
                ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)] border-[var(--color-primary)] shadow-sm ring-2 ring-[var(--color-primary)]/20'
                : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100'
            }`}
          >
            <Moon className="w-4 h-4 text-[var(--color-primary)]" />
            <span>Dark Mode</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('system')}
            className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
              mode === 'system'
                ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)] border-[var(--color-primary)] shadow-sm ring-2 ring-[var(--color-primary)]/20'
                : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100'
            }`}
          >
            <Laptop className="w-4 h-4 text-slate-400" />
            <span>System Auto</span>
          </button>
        </div>
      </div>

      {/* 2. Color Palette Swatch Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-[var(--color-primary)]" />
            <span>Color Palette & Accent Theme</span>
          </label>
          <span className="text-[11px] font-bold text-[var(--color-primary)] bg-[var(--color-primary-light)] px-2.5 py-0.5 rounded-full border border-[var(--color-primary-border)]">
            {currentPaletteConfig.name}
          </span>
        </div>

        <div className={`grid ${compact ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'} gap-3`}>
          {availablePalettes.map((p) => {
            const isSelected = palette === p.id;

            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setPalette(p.id)}
                className={`relative flex flex-col p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)] shadow-xs ring-2 ring-[var(--color-primary)]/25'
                    : 'border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-2xs'
                }`}
              >
                {/* Visual Dual Swatch Card (Side-by-side matching user image) */}
                <div className="w-full h-10 rounded-xl overflow-hidden flex border border-black/10 shadow-2xs mb-2.5">
                  <div
                    className="w-1/2 h-full flex items-center justify-center text-[10px] font-bold text-white/90"
                    style={{ backgroundColor: p.swatch.dark }}
                    title="Dark mode tone"
                  >
                    Dark
                  </div>
                  <div
                    className="w-1/2 h-full flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ backgroundColor: p.swatch.light }}
                    title="Light mode tone"
                  >
                    Light
                  </div>
                </div>

                {/* Name & Description */}
                <div className="flex items-center justify-between gap-2">
                  <div className="font-bold text-slate-800 text-xs truncate">
                    {p.name}
                  </div>
                  {isSelected && (
                    <span className="w-4 h-4 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  )}
                </div>

                {!compact && (
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Live Preview & Component Verification */}
      <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h4 className="text-xs font-bold text-slate-800">Live Appearance Preview</h4>
          </div>
          <button
            type="button"
            onClick={() => {
              setPalette('brown');
              setMode('dark');
            }}
            className="text-[10px] font-bold text-slate-600 hover:text-slate-900 underline cursor-pointer"
          >
            Apply Brown Dark Mode
          </button>
        </div>

        <div className="p-3 bg-white rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-3.5 py-1.5 bg-[#22c55e] text-white rounded-xl font-bold text-xs shadow-xs hover:opacity-90 transition cursor-default"
            >
              Primary Button
            </button>
            <span className="px-2.5 py-1 bg-[#ecfbf2] text-[#22c55e] border border-emerald-200 rounded-lg text-xs font-bold">
              Active Badge
            </span>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-400 font-medium block">
              Active Accent
            </span>
            <span className="text-xs font-bold text-[#22c55e]">
              {resolvedMode === 'dark' ? currentPaletteConfig.dark.primary : currentPaletteConfig.light.primary}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
