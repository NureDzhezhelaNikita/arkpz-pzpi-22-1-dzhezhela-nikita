import { supabase } from "../_shared/client.ts";
import { withErrorHandler } from "../_shared/error-handler.ts";

// Iot Data:
// 1. token:string;
// 2. type:VEHICLE_STATUS|SET_VEHICLE_STATUS|CAR_INTERNAL;
// 3. payload: {
//  tripId?:string;
//       isLocked,
//      isStarted,
//     fuel,
//     latitude,
//   longitude,
//    status,
//     speed,
//    mileage,
//
//
//};

Deno.serve(
  withErrorHandler(async (req) => {
    const { socket, response } = Deno.upgradeWebSocket(req);

    socket.onopen = (event) => {
      console.log("WebSocket connection established", event, req);
    };

    socket.onmessage = async (event) => {
      const message = JSON.parse(event.data);
      console.log("WebSocket message received", message);
      const { token, type, payload } = message;

      if (!token) return;

      const { data: vehicle, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("auth_token", token)
        .single();

      if (error || !vehicle || vehicle.auth_token !== token) {
        return socket.close();
      }

      if (type !== "VEHICLE_STATUS") return;

      const tripIdFromIoT = payload.tripId;

      const { data: activeTrip } = await supabase
        .from("trips")
        .select("*")
        .eq("vehicle_id", vehicle.id)
        .eq("status", "ACTIVE")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (activeTrip && activeTrip.id !== tripIdFromIoT) {
        return;
      }

      await supabase
        .from("vehicle_statuses")
        .insert({
          vehicle_id: vehicle.id,
          trip_id: activeTrip?.id || null,
          is_locked: payload.isLocked,
          is_started: payload.isStarted,
          fuel: payload.fuel,
          latitude: payload.latitude,
          longitude: payload.longitude,
          status: payload.status,
          speed: payload.speed,
          mileage: Math.round(payload.mileage),
        })
        .select("*")
        .single();
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = (event) => {
      console.log("WebSocket connection closed", event);
    };

    return response;
  })
);
