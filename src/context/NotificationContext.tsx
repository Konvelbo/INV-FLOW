"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "react-hot-toast";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export interface Notification {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  unread: boolean;
  type?: "reminder" | "system" | "invoice";
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (
    notification: Omit<Notification, "id" | "timestamp" | "unread">,
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount and request notification permission
  useEffect(() => {
    const saved = localStorage.getItem("app_notifications");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setNotifications(parsed);
      } catch (e) {
        // Silenced
      }
    }
    setIsInitialized(true);

    // Request browser notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    // Register Service Worker and Subscribe to Push
    const registerAndSubscribe = async () => {
      if ("serviceWorker" in navigator && "PushManager" in window) {
        try {
          const registration = await navigator.serviceWorker.register("/sw.js");
          // console.log("SW registered:", registration);

          // Once registered, check for subscription
          const subscription = await registration.pushManager.getSubscription();
          if (!subscription && Notification.permission === "granted") {
            const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
            if (vapidPublicKey) {
              const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
              const newSubscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: convertedVapidKey,
              });

              // Send to backend
              const userStr = localStorage.getItem("user");
              if (userStr) {
                const user = JSON.parse(userStr);
                await fetch("/api/notifications/subscribe", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                  },
                  body: JSON.stringify({ subscription: newSubscription }),
                });
              }
            }
          }
        } catch (err) {
          // Silenced
        }
      }
    };

    registerAndSubscribe();
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("app_notifications", JSON.stringify(notifications));
    }
  }, [notifications, isInitialized]);

  const addNotification = (
    notif: Omit<Notification, "id" | "timestamp" | "unread">,
  ) => {
    const newNotif: Notification = {
      ...notif,
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      unread: true,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Play notification sound
    try {
      const audio = new Audio("/dragon-studio-new-notification-3-398649.mp3");
      audio.play().catch(() => {
        // Autoplay might be blocked until user interacts with the page
      });
    } catch {
      // Audio not supported or failed
    }

    // In-app toast
    toast.success(`${notif.user}: ${notif.action} ${notif.target}`, {
      icon: "🔔",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });

    // Browser/Desktop/Electron notification
    if (typeof window !== "undefined") {
      const title = `INV-FLOW: ${notif.user}`;
      const options: NotificationOptions = {
        body: `${notif.action} ${notif.target}`,
        icon: "/INV_WEBLOGO.png",
        badge: "/INV_WEBLOGO.png",
      };

      // 1. Prioritize Electron IPC if available
      // @ts-ignore - electronAPI is injected by preload.js
      if (window.electronAPI?.sendNotification) {
        // @ts-ignore
        window.electronAPI.sendNotification(title, options);
      }
      // 2. Fallback to standard Browser Notifications
      else if (
        "Notification" in window &&
        Notification.permission === "granted"
      ) {
        // Try to use ServiceWorker for consistent experience, but fallback immediately if not ready
        if (navigator.serviceWorker && navigator.serviceWorker.ready) {
          navigator.serviceWorker.ready
            .then((registration) => {
              registration.showNotification(title, options);
            })
            .catch(() => {
              new window.Notification(title, options);
            });
        } else {
          new window.Notification(title, options);
        }
      }
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAllNotifications,
        unreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider",
    );
  }
  return context;
};
