export default {
  async fetch(request: Request) {
    const url = new URL(request.url);

    if (url.pathname === "/api/hello") {
      return new Response(JSON.stringify({ message: "Hello from Worker!" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    if (url.pathname === "/api/user-agent") {
      return new Response(
        JSON.stringify({
          userAgent: request.headers.get("user-agent"),
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Fallback for static assets (your React app)
    return fetch(request);
  },
};
