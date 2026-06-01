import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { type NextRequest } from "next/server";
import { appRouter } from "~/server/root";
import { createTRPCContext } from "~/server/trpc";

// Handle all incoming tRPC network requests and connect them to the backend router
const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createTRPCContext({ req }),
    onError:
      process.env.NODE_ENV === "development"
        ? ({ path, error }: { path: string | undefined; error: Error }) => {
            console.error(`❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`);
          }
        : undefined,
  });

export { handler as GET, handler as POST };