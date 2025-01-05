import { withCors } from "../_shared/cors.ts";
import { withErrorHandler } from "../_shared/error-handler.ts";
import { supabase } from "../_shared/client.ts";
import { Roles } from "../_shared/constants.ts";

Deno.serve(
  withErrorHandler(
    withCors(async (req): Promise<Response> => {
      if (req.method !== "POST") {
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
          status: 405,
        });
      }

      const body = await req.json();
      const { email, password, firstName, lastName } = body;

      if (!email || !password || !firstName || !lastName) {
        return new Response(
          JSON.stringify({
            error: "Email, password, first name and last name are required",
          }),
          { status: 400 }
        );
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            role_id: Roles.USER,
          },
        },
      });

      if (authError || !authData.user) {
        return new Response(
          JSON.stringify({
            error: authError?.message || "Failed to create user",
          }),
          { status: 400 }
        );
      }

      return new Response(
        JSON.stringify({
          access_token: authData.session?.access_token,
          refresh_token: authData.session?.refresh_token,
          user: authData.user,
        })
      );
    })
  )
);
