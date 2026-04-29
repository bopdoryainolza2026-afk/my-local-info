const fs = require('fs');
const path = require('path');

async function testUpgrade() {
    const envPath = '.env.local';
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) process.env[key.trim()] = valueParts.join('=').trim();
    });

    const apiKey = process.env.GEMINI_API_KEY;
    const file = '2026-04-12-yongin-senior-hospital-care.md';
    const filePath = path.join('src/content/posts', file);
    const content = fs.readFileSync(filePath, 'utf8');

    const prompt = `용인시 블로그 글을 1500자 이상으로 업그레이드해줘. 기존 내용:\n${content}\n마지막에 <!-- [ITEM_ID: yongin_senior_care] --> 포함해줘.`;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    const result = await response.json();
    if (result.candidates) {
        console.log("Success!");
        fs.writeFileSync(filePath, result.candidates[0].content.parts[0].text, 'utf8');
    } else {
        console.log("Failed:", JSON.stringify(result.error));
    }
}

testUpgrade();
