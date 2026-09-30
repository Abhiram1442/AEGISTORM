"use client";

import { useTheme } from "next-themes";
import { Palette } from "lucide-react";

const themeOptions = ["light", "dark", "cupcake", "synthwave", "cyberpunk", "retro"] as const;

export default function ThemeSelect() {
  const { theme, setTheme } = useTheme();

  return (
    <label className="theme-picker" title="Change dashboard theme">
      <Palette size={14} />
      <select aria-label="Dashboard theme" value={theme ?? "system"} onChange={(event) => setTheme(event.target.value)}>
        <option value="system">System</option>
        {themeOptions.map((option) => <option key={option} value={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</option>)}
      </select>
    </label>
  );
}
