import { withCors } from "../_shared/cors.ts";
import { withErrorHandler } from "../_shared/error-handler.ts";

Deno.serve(
  withErrorHandler(
    withCors(async (req): Promise<Response> => {
      return new Response(JSON.stringify({ token: "test" }));
    })
  )
);
