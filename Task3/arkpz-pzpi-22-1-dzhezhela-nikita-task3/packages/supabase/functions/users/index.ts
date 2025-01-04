import { supabase } from "../_shared/client.ts";
import { withCors } from "../_shared/cors.ts";

Deno.serve(
  withCors(async () => {
    const { data: users } = await supabase.from("users").select("*");
    return new Response(JSON.stringify(users));
  })
);
