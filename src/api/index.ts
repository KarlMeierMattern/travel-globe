// Worker entry point
// Handles routing to the correct API endpoint

export default {
  async fetch(request: Request) {
    const url = new URL(request.url);

    if (url.pathname === "/api/hello") {
      return new Response(JSON.stringify({ message: "Hello from Worker!" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    if (url.pathname === "/api/test") {
      return new Response(JSON.stringify({ message: "This is a test form" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // For all other routes, serve index.html (SPA fallback)
    // This assumes you have a way to read index.html from your build output
    if (request.method === "GET" && !url.pathname.startsWith("/api/")) {
      return fetch("http://localhost:5173/index.html");
    }

    // Fallback for static assets (your React app)
    return fetch(request);
  },
};
