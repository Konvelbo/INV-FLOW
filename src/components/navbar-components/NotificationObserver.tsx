"use client";

import { useEffect, useState } from "react";
import { useReminder } from "@/hooks/useReminder";

export function NotificationObserver() {
  const [todos, setTodos] = useState([]);
  const [user, setUser] = useState<{ token: string } | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {}
    }
  }, []);

  const fetchTodos = async (token: string) => {
    try {
      const response = await fetch("/api/todos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTodos(data);
      }
    } catch (error) {
      console.error("Observer failed to fetch tasks", error);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchTodos(user.token);
      // Refresh periodically to catch updates from other pages/tabs
      const interval = setInterval(() => fetchTodos(user.token), 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Hook runs reminders in background
  useReminder(todos);

  return null; // Invisible component
}
