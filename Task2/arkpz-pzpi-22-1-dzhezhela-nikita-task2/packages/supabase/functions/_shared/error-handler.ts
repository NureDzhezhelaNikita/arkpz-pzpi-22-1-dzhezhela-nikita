export const withErrorHandler = (
  handler: (req: Request) => Promise<Response>
) => {
  return async (req: Request): Promise<Response> => {
    try {
      return await handler(req);
    } catch (error) {
      console.error("Error:", error);

      return new Response(
        JSON.stringify({
          error:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  };
};
