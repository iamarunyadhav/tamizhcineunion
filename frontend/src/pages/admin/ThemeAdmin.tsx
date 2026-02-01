import { Button } from '@/components/ui/button';
import { apiClient } from '@/api/client';
import { useThemeManager } from '@/contexts/ThemeContext';
import { baseTokens, defaultThemeId } from '@/theme/presets';
import { Check, Palette, RefreshCcw, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const withAlpha = (color: string, alpha = 0.25) => {
  if (color.includes('hsl')) {
    return color.replace(')', ` / ${alpha})`);
  }
  return color;
};

const Swatch = ({ label, color }: { label: string; color: string }) => (
  <div className="flex items-center gap-2">
    <span
      className="w-6 h-6 rounded-full border border-border shadow-sm"
      style={{ background: color }}
      aria-hidden
    />
    <span className="text-xs text-muted-foreground capitalize">{label}</span>
  </div>
);

export default function ThemeAdmin() {
  const { presets, setTheme, themeId, theme } = useThemeManager();
  const [isSaving, setIsSaving] = useState(false);
  const [savingThemeId, setSavingThemeId] = useState<string | null>(null);

  const handleSave = async (id?: string) => {
    const targetId = id || themeId;
    setIsSaving(true);
    setSavingThemeId(targetId);
    try {
      await apiClient.put('/site-settings/theme', { id: targetId });
      toast.success('Theme saved for all users.');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to save theme.');
    } finally {
      setIsSaving(false);
      setSavingThemeId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Switch the entire site to any of the curated palettes.</p>
          <h1 className="text-3xl font-display font-bold">Theme Studio</h1>
          <p className="text-sm text-muted-foreground mt-2">10 presets with paired fonts, backgrounds, buttons, and icon-ready contrasts.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-card border border-border shadow-card">
            <Palette className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Live Theme</p>
              <p className="font-semibold">{theme.name}</p>
            </div>
          </div>
          <Button
            variant="gold"
            size="sm"
            className="gap-2"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Theme'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setTheme(defaultThemeId)}
          >
            <RefreshCcw className="w-4 h-4" />
            Reset to Gold Noir
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {presets.map((preset) => {
          const active = preset.id === themeId;
          const displayFont = preset.tokens['font-display'] || baseTokens['font-display'];
          const bodyFont = preset.tokens['font-body'] || baseTokens['font-body'];

          return (
            <div
              key={preset.id}
              className={`glass-card border transition-all duration-300 hover:border-primary/50 ${active ? 'border-primary shadow-gold' : 'border-border'}`}
            >
              <div
                className="h-28 rounded-t-xl overflow-hidden"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${preset.preview.background}, ${preset.preview.primary})`,
                }}
              >
                <div
                  className="h-full w-full"
                  style={{
                    background: `radial-gradient(circle at 20% 25%, ${withAlpha(
                      preset.preview.accent,
                      0.35
                    )}, transparent 45%), radial-gradient(circle at 80% 70%, ${withAlpha(
                      preset.preview.primary,
                      0.4
                    )}, transparent 55%)`,
                  }}
                />
              </div>

              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground capitalize">
                      {preset.mode}
                    </span>
                    <span className="text-xs text-muted-foreground">{preset.accentName}</span>
                  </div>
                  {active && (
                    <div className="flex items-center gap-1 text-primary text-xs font-semibold">
                      <Check className="w-4 h-4" />
                      Active
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground">{preset.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{preset.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Swatch label="background" color={preset.preview.background} />
                  <Swatch label="primary" color={preset.preview.primary} />
                  <Swatch label="accent" color={preset.preview.accent} />
                  <Swatch label="text" color={preset.preview.text} />
                </div>

                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span>Display: {displayFont.split(',')[0]}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span>Body: {bodyFont.split(',')[0]}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                    <Button
                      variant={active ? 'gold' : 'outline'}
                      className="flex-1"
                      onClick={() => {
                        setTheme(preset.id);
                        handleSave(preset.id);
                      }}
                      disabled={savingThemeId === preset.id}
                    >
                      {savingThemeId === preset.id
                        ? 'Saving...'
                        : active
                          ? 'Theme Active'
                          : 'Use This Theme'}
                    </Button>
                    {!active && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setTheme(preset.id);
                          handleSave(preset.id);
                        }}
                        disabled={savingThemeId === preset.id}
                      >
                        <Palette className="w-4 h-4" />
                      </Button>
                    )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
