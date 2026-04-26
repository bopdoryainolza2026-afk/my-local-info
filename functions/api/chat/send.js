export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const { sessionId, message, sender } = await request.json();

    if (!sessionId || !message || !sender) {
      return new Response("Missing parameters", { status: 400 });
    }

    // 기존 채팅 내역 가져오기
    const key = `chat:${sessionId}`;
    let history = await env.CHAT_DB.get(key, { type: "json" }) || [];

    // 새 메시지 추가
    const newMessage = {
      id: Date.now(),
      sender,
      text: message,
      timestamp: new Date().toISOString()
    };
    history.push(newMessage);

    // KV에 다시 저장 (최근 100개만 유지)
    if (history.length > 100) history = history.slice(-100);
    await env.CHAT_DB.put(key, JSON.stringify(history));

    return new Response(JSON.stringify({ success: true, message: newMessage }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}
