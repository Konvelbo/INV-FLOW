import { useState, useCallback } from "react";
import toast from "react-hot-toast";

export function useIPCAction() {
  const [loading, setLoading] = useState(false);

  const performAction = useCallback(async (type: string, method: string, ...params: any[]) => {
    const publicActions = ["login", "register", "forgotPassword", "resetPassword"];
    const isPublicAuth = type === "auth" && publicActions.includes(method);

    let userId = null;
    
    // Read session purely from offline localStorage
    if (typeof window !== "undefined") {
      try {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const parsed = JSON.parse(userStr);
          userId = parsed?.id || null;
        }
      } catch (e) {
        console.error("Failed to read user from localStorage", e);
      }
    }

    if (!userId && !isPublicAuth) {
      toast.error("User not authenticated");
      return { success: false, error: "Unauthorized" };
    }

    if (typeof window === "undefined" || !(window as any).electronAPI) {
      const msg = "Application Electron requise. Vous utilisez actuellement un navigateur standard.";
      toast.error(msg);
      return { success: false, error: msg };
    }

    setLoading(true);
    try {
      // For public auth actions, we don't prepend userId
      const actionArgs = isPublicAuth ? params : [userId, ...params];
      
      const result = await (window as any).electronAPI.actionData(
        type,
        method,
        ...actionArgs
      );

      if (!result.success) {
        throw new Error(result.error || "Action failed");
      }

      return result;
    } catch (err: any) {
      console.error(`IPC Action Error [${type}.${method}]:`, err);
      toast.error(err.message || "An error occurred");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return { performAction, loading };
}
