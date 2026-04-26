export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const { message } = await request.json();
    const url = new URL(request.url);
    const origin = url.origin;

    // [1] 검색 인덱스 가져오기
    const indexResponse = await fetch(`${origin}/data/search-index.json`);
    const searchIndex = await indexResponse.json();

    // [2] 검색 로직 개선: 더 많은 키워드 추출 및 제목 가중치 부여
    const cleanMessage = message.replace(/[^\w\sㄱ-ㅎ가-힣]/g, ' ');
    const keywords = cleanMessage.split(/\s+/).filter(word => word.length >= 1);
    
    const scoredItems = searchIndex.map(item => {
      let score = 0;
      const searchText = `${item.title} ${item.content} ${item.summary || ''}`.toLowerCase();
      
      keywords.forEach(keyword => {
        if (keyword.length < 1) return;
        if (searchText.includes(keyword.toLowerCase())) {
          // 제목에 포함되면 더 높은 점수 부여
          score += item.title.toLowerCase().includes(keyword.toLowerCase()) ? 3 : 1;
        }
      });
      return { ...item, score };
    });

    // 상위 5개 검색 결과 선택
    const topMatches = scoredItems
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    // 관련 정보가 전혀 없으면 AI 호출 없이 즉시 답변
    if (topMatches.length === 0) {
      return new Response(JSON.stringify({ 
        answer: "죄송합니다. 요청하신 내용과 관련된 정보를 블로그 내에서 찾지 못했습니다. 다른 궁금한 점이 있으신가요?" 
      }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const blogContext = topMatches.map(m => `[${m.title}] ${m.summary || m.content.substring(0, 150)}`).join('\n');

    // [3] 시스템 프롬프트: 블로그 데이터로만 답변하도록 엄격히 제한
    const systemPrompt = `너는 오직 제공된 [블로그 데이터]만을 근거로 답변하는 AI 상담원이야.
반드시 한국어로만 답변하고, 마크다운 기호는 절대 사용하지 마.

[필수 규칙]
1. 아래 [블로그 데이터]에 있는 정보만 사용해. 너의 외부 지식이나 상식은 절대 섞지 마.
2. 만약 [블로그 데이터]만으로 답변하기 충분하지 않다면, 아는 척하지 말고 "관련 정보를 블로그에서 찾을 수 없습니다"라고만 대답해.
3. 답변은 2~3문장 이내로 명확하게 해줘.

[블로그 데이터]
${blogContext}`;

    // [4] Cloudflare Workers AI 호출
    const model = "@cf/meta/llama-3.1-8b-instruct";
    const result = await env.AI.run(model, {
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      max_tokens: 250,
    });

    // [5] 마크다운 기호 제거 함수 보강
    const stripMarkdown = (text) => {
      return text.replace(/[#*`_~-]/g, '').replace(/\s+/g, ' ').trim();
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
