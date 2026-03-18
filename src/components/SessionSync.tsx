"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function SessionSync() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const localUser = localStorage.getItem("user");
      
      // @ts-ignore - token is added in auth.ts session callback
      const sessionToken = session.user.token;
      
      if (!localUser && sessionToken) {
        console.log("Syncing session to localStorage...");
        const userToStore = {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          // @ts-ignore
          avatar: session.user.avatar,
          // @ts-ignore
          token: session.user.token,
          // @ts-ignore
          companies: session.user.companies || [],
        };
        
        localStorage.setItem("user", JSON.stringify(userToStore));
        
        // Redirect to settings if no companies, matching signup.tsx behavior
        if (!userToStore.companies || userToStore.companies.length === 0) {
          window.location.href = "/settings";
        } else {
          window.location.reload();
        }
      }
    }
  }, [session, status]);

  return null;
}
