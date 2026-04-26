export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const { message } = await request.json();
    const url = new URL(request.url);
    const origin = url.origin;

    // [1] 검색 인덱스 가져오기
    const indexResponse = await fetch(`${origin}/data/search-index.json`);
    const searchIndex = await indexResponse.json();

    // [2] 간단한 키워드 매칭 검색
    const keywords = message.split(' ').filter(word => word.length > 1);
    const scoredItems = searchIndex.map(item => {
      let score = 0;
      const searchText = `${item.title} ${item.content} ${item.summary || ''}`;
      keywords.forEach(keyword => {
        if (searchText.includes(keyword)) score++;
      });
      return { ...item, score };
    });

    // 상위 3개 검색 결과 선택
    const topMatches = scoredItems
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    const blogContext = topMatches.length > 0 
      ? topMatches.map(m => `[${m.title}] ${m.summary || m.content.substring(0, 200)}`).join('\n')
      : "관련 정보 없음";

    // [3] 시스템 프롬프트 구성
    const systemPrompt = `You are an AI assistant for a Korean local information blog.
Answer ONLY in Korean. Keep answers to 2-3 sentences maximum.
Do NOT use any markdown symbols (**, *, #, -). Plain text only.
Base your answer ONLY on the following blog data. If not relevant, reply: 해당 내용은 블로그에서 확인이 어렵습니다. 다른 질문을 해주세요.

[블로그 데이터]
${blogContext}`;

    // [4] Cloudflare Workers AI 호출
    const model = "@cf/meta/llama-3.1-8b-instruct";
    const result = await env.AI.run(model, {
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      max_tokens: 150,
    });

    // [5] 마크다운 기호 제거 함수
    const stripMarkdown = (text) => {
      return text.replace(/[#*`_~-]/g, '').trim();
    };

    const finalAnswer = stripMarkdown(result.response);

    return new Response(JSON.stringify({ answer: finalAnswer }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
