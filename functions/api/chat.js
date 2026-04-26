export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const { message } = await request.json();
    const url = new URL(request.url);
    const origin = url.origin;

    // [핵심] 블로그의 실제 데이터(JSON)를 가져옵니다.
    // fetch를 통해 현재 배포된 최신 데이터를 실시간으로 읽어옵니다.
    let blogContext = "";
    try {
      const dataResponse = await fetch(`${origin}/data/local-info.json`);
      if (dataResponse.ok) {
        const blogData = await dataResponse.json();
        // 데이터가 너무 크면 AI 성능이 떨어지므로, 최신 행사와 혜택 위주로 요약
        const events = blogData.events.slice(0, 15).map(e => `[행사] ${e.name} (기간: ${e.date})`).join('\n');
        const benefits = blogData.benefits.slice(0, 15).map(b => `[혜택] ${b.name} (태그: ${b.tag})`).join('\n');
        blogContext = `\n현재 블로그에 등록된 최신 정보:\n${events}\n${benefits}`;
      }
    } catch (e) {
      console.error("데이터 로드 실패:", e);
    }

    // Cloudflare Workers AI 호출
    const model = "@cf/meta/llama-3.1-8b-instruct";
    const result = await env.AI.run(model, {
      messages: [
        { 
          role: "system", 
          content: `너는 '용인시 포털 정보사이트'의 전문 상담원이야. 
          아래 제공된 '최신 정보'를 바탕으로 사용자에게 정확한 정보를 안내해줘.
          만약 제공된 데이터에 없는 내용이라면, "해당 내용은 현재 블로그에 등록되지 않았습니다. 카테고리 메뉴에서 더 자세한 내용을 확인해 보세요."라고 안내해.
          절대 정보를 지어내지 마. 친근한 말투(~해요, ~입니다)로 답변해줘.
          ${blogContext}` 
        },
        { role: "user", content: message },
      ],
      max_tokens: 500,
    });

    return new Response(JSON.stringify({ answer: result.response }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
