import { supabase } from "../_shared/client.ts";
import { withCors } from "../_shared/cors.ts";

Deno.serve(
  withCors(async () => {
    const { data: vehicles } = await supabase.from("vehicles").select("*");

    return new Response(JSON.stringify(vehicles));
  })
);
