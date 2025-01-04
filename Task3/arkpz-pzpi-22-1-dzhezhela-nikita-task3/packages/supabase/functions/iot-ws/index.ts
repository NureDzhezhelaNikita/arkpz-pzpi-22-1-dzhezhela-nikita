import { withErrorHandler } from "../_shared/error-handler.ts";

Deno.serve(
  withErrorHandler(async (req) => {
    const { socket, response } = Deno.upgradeWebSocket(req);

    socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    socket.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      socket.send(JSON.stringify({ status: "success", payload }));
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return response;
  })
);
