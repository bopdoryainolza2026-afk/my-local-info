export async function onRequestGet(context) {
  const { env } = context;
  try {
    const list = await env.CHAT_DB.list({ prefix: "chat:" });
    
    const sessions = await Promise.all(list.keys.map(async (k) => {
      const history = await env.CHAT_DB.get(k.name, { type: "json" }) || [];
      const lastMsg = history[history.length - 1];
      return {
        id: k.name.replace("chat:", ""),
        lastMessage: lastMsg ? lastMsg.text : "No messages",
        lastTimestamp: lastMsg ? lastMsg.timestamp : null,
        unread: lastMsg ? lastMsg.sender === "user" : false
      };
    }));

    // 정렬: 최신 메시지 순
    sessions.sort((a, b) => new Date(b.lastTimestamp) - new Date(a.lastTimestamp));

    return new Response(JSON.stringify(sessions), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}
