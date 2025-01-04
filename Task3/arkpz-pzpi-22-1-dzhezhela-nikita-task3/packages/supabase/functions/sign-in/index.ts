import { withCors } from "../_shared/cors.ts";
import { withErrorHandler } from "../_shared/error-handler.ts";
import { supabase } from "../_shared/client.ts";

Deno.serve(
  withErrorHandler(
    withCors(async (req): Promise<Response> => {
      if (req.method !== "POST") {
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
          status: 405,
        });
      }

      const body = await req.json();
      const { email, password } = body;

      if (!email || !password) {
        return new Response(
          JSON.stringify({ error: "Email and password are required" }),
          { status: 400 }
        );
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 401,
        });
      }

      return new Response(
        JSON.stringify({
          access_token: data.session?.access_token,
          refresh_token: data.session?.refresh_token,
          user: data.user,
        })
      );
    })
  )
);
