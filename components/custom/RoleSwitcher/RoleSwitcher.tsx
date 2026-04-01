import React from "react";
import { useApp } from "@/context/app-context";
import { UserRole } from "@/types/finance";
import { Shield, Eye } from "lucide-react";

/**
 * RoleSwitcher Component
 * Allows user to switch between Viewer and Admin roles
 */
const RoleSwitcher: React.FC = () => {
  const { role, setRole } = useApp();

  const roles: Array<{ value: UserRole; label: string; icon: React.ReactNode; description: string }> = [
    {
      value: "viewer",
      label: "Viewer",
      icon: <Eye className="w-4 h-4" />,
      description: "View only",
    },
    {
      value: "admin",
      label: "Admin",
      icon: <Shield className="w-4 h-4" />,
      description: "Can edit & delete",
    },
  ];

  return (
    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
      {roles.map((r) => (
        <button
          key={r.value}
          onClick={() => setRole(r.value)}
          className={`flex items-center gap-2 px-3 py-2 rounded transition-all duration-200 ${
            role === r.value
              ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          }`}
          title={r.description}
        >
          {r.icon}
          <span className="text-sm font-medium">{r.label}</span>
        </button>
      ))}
    </div>
  );
};

export default RoleSwitcher;
