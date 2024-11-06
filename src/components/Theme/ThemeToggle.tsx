"use client";
import { useTheme } from "next-themes";
import { MoonIcon } from "@heroicons/react/24/solid";
import { SunIcon } from "@heroicons/react/24/solid";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = () => {
    setTheme(theme === "dark" ? "light" : "dark");
    console.log(theme);
  };

  return (
    <>
      <button
        onClick={handleThemeChange}
        className="p-2 rounded-full shadow-md bg-gray-100"
      >
        {theme === "dark" ? (
          <SunIcon className="w-6 h-6 text-gray-500 fill-gray-500" />
        ) : (
          <MoonIcon className="w-6 h-6 text-gray-500 fill-gray-500" />
        )}
      </button>
    </>
  );
}
