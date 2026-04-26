export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const { message } = await request.json();

    if (!message) {
      return new Response(JSON.stringify({ error: "No message provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Cloudflare Workers AI 호출 (AI 바인딩 사용)
    const model = "@cf/meta/llama-3.1-8b-instruct";
    const result = await env.AI.run(model, {
      messages: [
        { role: "system", content: "You are an AI assistant for a Korean local information blog. Answer in Korean." },
        { role: "user", content: message },
      ],
      max_tokens: 300,
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
