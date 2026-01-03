"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      style={{ marginBottom: 16 }}
    >
      {dark ? "☀ Light Mode" : "🌙 Dark Mode"}
    </button>
  );
}
