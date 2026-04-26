export async function onRequestGet(context) {
  const { env } = context;
  try {
    // 모든 채팅 키 조회
    const list = await env.CHAT_KV.list({ prefix: "chat_" });
    
    // 키 리스트에서 고유한 sessionId 추출 및 마지막 메시지 정보 구성
    const sessionMap = new Map();
    
    await Promise.all(list.keys.map(async (k) => {
      const val = await env.CHAT_KV.get(k.name, { type: "json" });
      const sid = val.sessionId;
      
      if (!sessionMap.has(sid) || val.timestamp > sessionMap.get(sid).lastTimestamp) {
        sessionMap.set(sid, {
          id: sid,
          lastMessage: val.message,
          lastTimestamp: val.timestamp,
          lastSender: val.sender
        });
      }
    }));

    const sessions = Array.from(sessionMap.values());
    // 최신 메시지 순으로 정렬
    sessions.sort((a, b) => b.lastTimestamp - a.lastTimestamp);

    return new Response(JSON.stringify(sessions), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}
