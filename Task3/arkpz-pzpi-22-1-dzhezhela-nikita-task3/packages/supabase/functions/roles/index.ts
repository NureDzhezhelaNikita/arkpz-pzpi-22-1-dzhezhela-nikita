import { supabase } from "../_shared/client.ts";
import { withCors } from "../_shared/cors.ts";

Deno.serve(
  withCors(async (req) => {
    const { data: roles, error } = await supabase.from("roles").select("*");
    return new Response(JSON.stringify(roles));
  })
);
