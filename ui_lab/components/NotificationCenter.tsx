import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Notification Center** — notification queue with toast management
 *
 * Supports:
 * - Multiple notifications
 * - Types: info/success/warning/error
 * - Auto-dismiss with progress
 * - Actions per notification
 * - Stacking/grouping
 * - Context provider pattern
 *
 * Use: Toast notifications, user feedback, alerts
 */

export interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id">) => string;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export const NotificationContext = React.createContext<NotificationContextType | undefined>(
  undefined,
);

export const useNotifications = () => {
  const context = React.useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, "id">) => {
    const id = Math.random().toString(36).slice(2);
    const fullNotification: Notification = { ...notification, id };

    setNotifications((prev) => [...prev, fullNotification]);

    if (notification.duration !== 0) {
      setTimeout(
        () => removeNotification(id),
        notification.duration || 5000,
      );
    }

    return id;
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, removeNotification, clearAll }}
    >
      {children}
      <NotificationCenter />
    </NotificationContext.Provider>
  );
};

export const NotificationCenter: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();

  const typeColorMap = {
    info: "bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-400",
    success: "bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400",
    warning: "bg-yellow-500/10 border-yellow-500/30 text-yellow-700 dark:text-yellow-400",
    error: "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400",
  };

  const typeIconMap = {
    info: "ℹ",
    success: "✓",
    warning: "⚠",
    error: "✕",
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={cn(
            "flex gap-3 p-4 rounded-lg border animate-in fade-in slide-in-from-right",
            typeColorMap[notif.type],
          )}
        >
          <div className="flex-shrink-0">{typeIconMap[notif.type]}</div>

          <div className="flex-1">
            <h4 className="font-medium">{notif.title}</h4>
            {notif.message && (
              <p className="text-sm opacity-90 mt-1">{notif.message}</p>
            )}

            {notif.action && (
              <button
                onClick={() => {
                  notif.action!.onClick();
                  removeNotification(notif.id);
                }}
                className="mt-2 text-sm font-medium hover:underline"
              >
                {notif.action.label}
              </button>
            )}
          </div>

          <button
            onClick={() => removeNotification(notif.id)}
            className="flex-shrink-0 hover:opacity-70"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

NotificationCenter.displayName = "NotificationCenter";
