import { supabase } from "../_shared/client.ts";
import { withCors } from "../_shared/cors.ts";

Deno.serve(
  withCors(async () => {
    const { data: vehicleTypes } = await supabase
      .from("vehicle_types")
      .select("*");
    return new Response(JSON.stringify(vehicleTypes));
  })
);
