import React from "react";
import { useApp } from "@/context/app-context";
import { Sun, Moon } from "lucide-react";

/**
 * DarkModeToggle Component
 * Toggle dark mode on/off with visual indicator
 */
const DarkModeToggle: React.FC = () => {
  const { darkMode, setDarkMode } = useApp();

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
        darkMode
          ? "bg-blue-600 text-white hover:bg-blue-700"
          : "bg-gray-200 text-gray-800 hover:bg-gray-300"
      }`}
      title={`Switch to ${darkMode ? "light" : "dark"} mode`}
      aria-label="Toggle dark mode"
    >
      {darkMode ? (
        <>
          <Moon className="w-4 h-4" />
          <span className="text-xs font-medium hidden sm:inline">Dark</span>
        </>
      ) : (
        <>
          <Sun className="w-4 h-4" />
          <span className="text-xs font-medium hidden sm:inline">Light</span>
        </>
      )}
    </button>
  );
};

export default DarkModeToggle;
