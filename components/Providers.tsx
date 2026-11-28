"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import ConfirmationDialog from "@/components/two-factor/ConfirmationDialog";

/** App-wide React Query provider for client/server state. */
export default function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60_000, refetchOnWindowFocus: false, retry: 1 },
        },
      }),
  );
  return (
    <QueryClientProvider client={client}>
      {children}
      <ConfirmationDialog />
      <Toaster />
    </QueryClientProvider>
  );
}
