import { supabase } from "../_shared/client.ts";
import { withCors } from "../_shared/cors.ts";

Deno.serve(
  withCors(async () => {
    const { data: vehicleStatuses } = await supabase
      .from("vehicle_statuses")
      .select("*");
    return new Response(JSON.stringify(vehicleStatuses));
  })
);
