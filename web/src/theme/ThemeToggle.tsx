"use client";

import * as React from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const effective = theme === "system" ? systemTheme : theme;

  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(effective === "dark" ? "light" : "dark")}
      className="rounded-md border px-3 py-1.5 text-sm"
    >
      {effective === "dark" ? "Light mode" : "Dark mode"}
    </button>
  );
}
