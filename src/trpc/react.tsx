import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "~/server/root";

export const api = createTRPCReact<AppRouter>();
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { loggerLink, httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { useState } from "react";
import superjson from "superjson";

import { type AppRouter } from "~/server/api/root";

// Create the tRPC React client with type safety from our AppRouter
export const api = createTRPCReact<AppRouter>();

// Provider component to wrap the application and enable tRPC/React Query
export function TRPCReactProvider(props: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  const [trpcClient] = useState(() =>
    api.createClient({
      transformer: superjson,
      links: [
        // Adds clean logs in development console for debugging requests
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        // Directs all tRPC requests to the Next.js API route
        httpBatchLink({
          url: "/api/trpc",
        }),
      ],
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </api.Provider>
    </QueryClientProvider>
  );
}
