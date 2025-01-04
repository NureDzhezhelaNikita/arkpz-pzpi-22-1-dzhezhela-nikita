import { supabase } from "../_shared/client.ts";
import { withCors } from "../_shared/cors.ts";

Deno.serve(
  withCors(async () => {
    const { data: trips } = await supabase.from("trips").select("*");

    return new Response(JSON.stringify(trips));
  })
);
