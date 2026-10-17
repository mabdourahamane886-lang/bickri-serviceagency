const API_ORIGIN = "https://bickri-codex-system.vercel.app";
const routes = {
  health: { path: "/api/health", methods: ["GET"] },
  agent: { path: "/api/ai/agent", methods: ["GET", "POST"], maxBodyBytes: 3 * 1024 * 1024 },
  images: { path: "/api/ai/images", methods: ["POST"], maxBodyBytes: 3 * 1024 * 1024 }
};

function jsonError(message, status) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }
  });
}

export default async function handler(request) {
  const resource = new URL(request.url).searchParams.get("resource");
  const route = routes[resource];
  if (!route) return jsonError("Route Bickri inconnue.", 404);
  if (!route.methods.includes(request.method)) {
    return new Response(null, { status: 405, headers: { Allow: route.methods.join(", ") } });
  }

  let body;
  if (request.method !== "GET" && request.method !== "HEAD") {
    const declaredSize = Number(request.headers.get("content-length") || 0);
    if (declaredSize > route.maxBodyBytes) return jsonError("La requête dépasse la taille autorisée.", 413);
    body = await request.text();
    if (new TextEncoder().encode(body).byteLength > route.maxBodyBytes) {
      return jsonError("La requête dépasse la taille autorisée.", 413);
    }
  }

  try {
    const upstream = await fetch(`${API_ORIGIN}${route.path}`, {
      method: request.method,
      headers: {
        Accept: "application/json",
        ...(body ? { "Content-Type": "application/json" } : {})
      },
      ...(body ? { body } : {}),
      cache: "no-store",
      signal: AbortSignal.timeout(60000)
    });
    const headers = new Headers({
      "Cache-Control": "no-store",
      "Content-Type": upstream.headers.get("content-type") || "application/json; charset=utf-8"
    });
    return new Response(upstream.body, { status: upstream.status, headers });
  } catch (error) {
    console.error("Bickri AI proxy request failed:", error);
    return jsonError("Le service Bickri AI est momentanément inaccessible. Réessayez plus tard.", 502);
  }
}
