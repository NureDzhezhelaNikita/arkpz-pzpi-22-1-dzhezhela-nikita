import { withCors } from "../_shared/cors.ts";
import { withErrorHandler } from "../_shared/error-handler.ts";
import { withAuth } from "../_shared/auth.ts";
import { Roles } from "../_shared/constants.ts";
import { signJwt } from "../_shared/jwt.ts";
import { supabase } from "../_shared/client.ts";

const allowedRoleIds = [Roles.ADMIN];

Deno.serve(
  withErrorHandler(
    withCors(
      withAuth(
        async (req, user): Promise<Response> => {
          if (req.method !== "POST") {
            return new Response(
              JSON.stringify({ error: "Method not allowed" }),
              {
                status: 405,
              }
            );
          }

          const body = await req.json();
          const { vehicleId } = body;

          if (!vehicleId) {
            return new Response(
              JSON.stringify({ error: "Vehicle ID is required" }),
              { status: 400 }
            );
          }

          const token = await signJwt({
            vehicleId,
            userId: user.id,
            email: user.email,
          });

          const { error: updateError } = await supabase
            .from("vehicles")
            .update({ auth_token: token })
            .eq("id", vehicleId);

          if (updateError) {
            return new Response(
              JSON.stringify({ error: "Failed to update vehicle token" }),
              { status: 500 }
            );
          }

          return new Response(JSON.stringify({ token }));
        },
        { allowedRoleIds }
      )
    )
  )
);
