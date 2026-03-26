import { useState, useEffect } from "react";
import { getServerSession, UnifiedSession } from "@/lib/session";
import { useRouter } from "next/navigation";

export function useIPCData<T>(type: string, ...params: any[]) {
  const [session, setSession] = useState<UnifiedSession | null>(null);
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      try {
        const currentSession = await getServerSession();
        if (!currentSession?.userId) {
          router.push("/");
          return;
        }
        setSession(currentSession);

        if (typeof window !== "undefined" && (window as any).electronAPI?.getData) {
          const result = await (window as any).electronAPI.getData(type, currentSession.userId, ...params);
          if (result.success) {
            setData(result.data);
          } else {
            console.error(`IPC data fetch failed for ${type}:`, result.error);
          }
        } else {
          console.warn("Electron IPC API not detected.");
          // In dev mode, we could optionally fetch from an API route here
        }
      } catch (error) {
        console.error(`Error loading data for ${type}:`, error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [type, router, ...params]);

  return { session, data, loading };
}
