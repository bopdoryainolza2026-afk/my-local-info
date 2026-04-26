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

    const blogContext = topMatches.length > 0 
      ? topMatches.map(m => `[${m.title}] ${m.summary || m.content.substring(0, 150)}`).join('\n')
      : "관련 블로그 정보 없음";

    // [3] 시스템 프롬프트 개선: 유연하고 친절한 답변 유도
    const systemPrompt = `너는 용인시 지역 정보를 안내하는 친절한 AI 상담원이야.
반드시 한국어로만 답변해. 2~3문장으로 짧고 친절하게 대답해줘.
마크다운 기호(#, *, -, \`)는 절대 사용하지 말고 평문으로만 대답해.

[지침]
1. 아래 제공된 [블로그 데이터]에 관련 내용이 있으면 적극적으로 활용해 답변해줘.
2. 만약 [블로그 데이터]에 정확한 정보가 없더라도, 용인시와 관련된 일반적인 상식(예: 에버랜드, 민속촌 정보 등)이라면 아는 범위 내에서 최대한 친절하게 설명해줘.
3. 정말 모르는 질문일 때만 "현재 블로그에서 관련 정보를 찾지 못했습니다"라고 정중히 답해줘.

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
