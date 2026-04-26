export async function onRequestGet(context) {
  const { request, env } = context;
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    // 모든 채팅 키 조회 (chat_ 접두사 사용)
    const list = await env.CHAT_KV.list({ prefix: "chat_" });
    
    // 각 키에 해당하는 값 가져오기
    const messages = await Promise.all(
      list.keys.map(async (k) => {
        const val = await env.CHAT_KV.get(k.name, { type: "json" });
        return { id: k.name, ...val };
      })
    );

    // 해당 세션의 메시지만 필터링하고 시간순 정렬
    const filteredMessages = sessionId 
      ? messages.filter(m => m.sessionId === sessionId)
      : messages;

    filteredMessages.sort((a, b) => a.timestamp - b.timestamp);

    return new Response(JSON.stringify(filteredMessages), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}
