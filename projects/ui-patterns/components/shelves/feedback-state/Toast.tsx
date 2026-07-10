import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Advanced Toast Notification** — temporary notification system
 *
 * Supports:
 * - Multiple toasts (queue management)
 * - Types: info/success/warning/error
 * - Auto-dismiss with timeout
 * - Action button
 * - Close button
 * - Progress bar showing time remaining
 * - Position variants
 * - Animation in/out
 *
 * Use: Async operation feedback, errors, success messages
 */

export interface Toast {
  id: string;
  title: string;
  description?: string;
  type?: "info" | "success" | "warning" | "error";
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => string;
  removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};

export interface ToastProviderProps {
  children: React.ReactNode;
  position?: "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right";
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children, position = "bottom-right" }) => {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, "id">): string => {
    const id = Date.now().toString();
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? 4000,
    };

    setToasts((prev) => [...prev, newToast]);

    if (newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }

    return id;
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const positionMap = {
    "top-left": "top-4 left-4",
    "top-center": "top-4 left-1/2 -translate-x-1/2",
    "top-right": "top-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
    "bottom-right": "bottom-4 right-4",
  };

  const typeMap = {
    info: { bg: "bg-blue-500/10", border: "border-blue-500/50", icon: "ℹ" },
    success: { bg: "bg-green-500/10", border: "border-green-500/50", icon: "✓" },
    warning: { bg: "bg-yellow-500/10", border: "border-yellow-500/50", icon: "⚠" },
    error: { bg: "bg-red-500/10", border: "border-red-500/50", icon: "✕" },
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}

      <div className={cn("fixed z-50 pointer-events-none", positionMap[position], "space-y-2")}>
        {toasts.map((toast) => {
          const typeStyle = typeMap[toast.type ?? "info"];
          return (
            <div
              key={toast.id}
              className={cn(
                "bg-background border rounded-lg shadow-lg p-4 min-w-80 max-w-sm",
                "animate-in fade-in slide-in-from-top-2",
                "pointer-events-auto",
                typeStyle.bg,
                typeStyle.border,
              )}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg">{typeStyle.icon}</span>
                <div className="flex-1">
                  <div className="font-medium text-foreground">{toast.title}</div>
                  {toast.description && (
                    <div className="text-sm text-muted-foreground">{toast.description}</div>
                  )}
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="text-muted-foreground hover:text-foreground ml-2"
                >
                  ✕
                </button>
              </div>

              {toast.action && (
                <button
                  onClick={() => {
                    toast.action?.onClick();
                    removeToast(toast.id);
                  }}
                  className="mt-2 text-sm font-medium text-primary hover:underline"
                >
                  {toast.action.label}
                </button>
              )}

              {toast.duration !== undefined && toast.duration > 0 && (
                <div
                  className="h-0.5 bg-foreground/20 mt-2 rounded-full"
                  style={{
                    animation: `shrink ${toast.duration}ms linear`,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </ToastContext.Provider>
  );
};

ToastProvider.displayName = "ToastProvider";
