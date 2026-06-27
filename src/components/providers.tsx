"use client";

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { SmoothScroll } from "@/components/animations/smooth-scroll";

/**
 * Providers globaux côté client : TanStack Query, smooth scroll (Lenis) et toasts.
 * Le QueryClient est instancié via useState pour rester stable entre les rendus.
 */
export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <SmoothScroll>{children}</SmoothScroll>
      <Toaster position="top-center" richColors />
    </QueryClientProvider>
  );
}
