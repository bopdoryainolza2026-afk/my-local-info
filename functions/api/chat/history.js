export async function onRequestGet(context) {
  const { request, env } = context;
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return new Response("Missing sessionId", { status: 400 });
    }

    const key = `chat:${sessionId}`;
    const history = await env.CHAT_DB.get(key, { type: "json" }) || [];

    return new Response(JSON.stringify(history), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}
