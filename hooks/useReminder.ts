"use client";

import { useEffect, useRef } from "react";
import { useNotifications } from "@/src/context/NotificationContext";

export interface ReminderItem {
  id: string;
  title: string;
  reminderAt: string | Date | null;
}

export const useReminder = (todos: ReminderItem[]) => {
  const { addNotification } = useNotifications();
  const checkedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      todos.forEach((todo) => {
        if (todo.reminderAt && !checkedRef.current.has(todo.id)) {
          const reminderTime = new Date(todo.reminderAt);
          if (reminderTime <= now) {
            addNotification({
              user: "Reminder",
              action: "Time to work on:",
              target: todo.title,
              type: "reminder",
            });
            checkedRef.current.add(todo.id);
          }
        }
      });
    };

    const interval = setInterval(checkReminders, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, [todos, addNotification]);
};
