import { supabase } from "../_shared/client.ts";
import { withCors } from "../_shared/cors.ts";

Deno.serve(
  withCors(async (req) => {
    const headers = { "Content-Type": "application/json" };

    switch (req.method) {
      case "GET": {
        const { data: vehicleStatuses, error } = await supabase
          .from("vehicle_statuses")
          .select("*");

        if (error) {
          return new Response(JSON.stringify(error), { status: 500, headers });
        }

        return new Response(JSON.stringify(vehicleStatuses), { headers });
      }

      case "POST": {
        const body = await req.json();
        const { data: vehicleStatus, error } = await supabase
          .from("vehicle_statuses")
          .insert(body)
          .select()
          .single();

        if (error) {
          return new Response(JSON.stringify(error), { status: 500, headers });
        }

        return new Response(JSON.stringify(vehicleStatus), {
          status: 201,
          headers,
        });
      }

      case "PUT": {
        const body = await req.json();
        const { id, ...updates } = body;

        const { data: vehicleStatus, error } = await supabase
          .from("vehicle_statuses")
          .update(updates)
          .eq("id", id)
          .select()
          .single();

        if (error) {
          return new Response(JSON.stringify(error), { status: 500, headers });
        }

        return new Response(JSON.stringify(vehicleStatus), { headers });
      }

      case "DELETE": {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
          return new Response(
            JSON.stringify({ error: "Missing id parameter" }),
            {
              status: 400,
              headers,
            }
          );
        }

        const { error } = await supabase
          .from("vehicle_statuses")
          .delete()
          .eq("id", id);

        if (error) {
          return new Response(JSON.stringify(error), { status: 500, headers });
        }

        return new Response(null, { status: 204 });
      }

      default:
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
          status: 405,
          headers,
        });
    }
  })
);
