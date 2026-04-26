import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
    const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

    if (!ACCOUNT_ID || !API_TOKEN) {
      return NextResponse.json(
        { error: 'Cloudflare 설정(ACCOUNT_ID 또는 API_TOKEN)이 누락되었습니다.' },
        { status: 500 }
      );
    }

    // Cloudflare Workers AI 호출
    // 모델: Llama 3.1 8B (한국어 지원 및 성능이 우수함)
    const model = '@cf/meta/llama-3.1-8b-instruct';
    const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/${model}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: '너는 용인시 지역 정보를 안내하는 친절한 AI 상담원이야. 한국어로 답변해줘.' },
          { role: 'user', content: message }
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Cloudflare AI Error:', errorData);
      throw new Error('Cloudflare AI 호출에 실패했습니다.');
    }

    const data = await response.json();
    const aiResponse = data.result.response;

    return NextResponse.json({ answer: aiResponse });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
