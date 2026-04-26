export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const { sessionId, message, sender } = await request.json();

    if (!sessionId || !message || !sender) {
      return new Response("Missing parameters", { status: 400 });
    }

    // 세션별로 구분하기 위해 키에 sessionId 포함
    const key = `chat_${sessionId}_${Date.now()}`;
    const value = JSON.stringify({
      sessionId,
      message,
      sender,
      timestamp: Date.now()
    });

    await env.CHAT_KV.put(key, value);

    return new Response(JSON.stringify({ success: true, key }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}
