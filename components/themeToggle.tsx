"use client";

import { IconMoonFilled, IconSunFilled } from "@tabler/icons-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <button 
      onClick={toggleTheme}
      className="float-right mt-5 mr-5 rounded-full border-3 text-gray-700 border-gray-700 p-2 hover:text-gray-900 hover:border-gray-900 dark:text-gray-200 dark:border-gray-200 dark:hover:text-gray-400 dark:hover:border-gray-400 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <IconSunFilled /> : <IconMoonFilled />}
    </button>
  );
}
