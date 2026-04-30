"use client";

import { useSession } from "next-auth/react";
import { useCallback } from "react";

export function useAnalytics() {
  const { data: session, status } = useSession();

  const trackEvent = useCallback((eventName: string, eventData?: Record<string, any>) => {
    if (typeof window !== "undefined" && (window as any).va) {
      (window as any).va("event", {
        name: eventName,
        data: {
          ...eventData,
          is_logged_in: status === "authenticated",
          user_id: (session?.user as any)?.id || undefined,
        },
      });
    }
  }, [session, status]);

  return { trackEvent };
}
