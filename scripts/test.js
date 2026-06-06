const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      process.env[key.trim()] = valueParts.join('=').trim();
    }
  });
}

async function test() {
  const url = `https://api.odcloud.kr/api/gov24/v3/serviceList?page=1&perPage=50&returnType=JSON&serviceKey=${encodeURIComponent(process.env.PUBLIC_DATA_API_KEY)}&cond[소관기관명::MATCH]=용인`;
  const res = await fetch(url);
  const json = await res.json();
  const items = json.data || [];
  console.log("Total items:", items.length);
  items.slice(0, 10).forEach(i => console.log(i.서비스명, "|", i.소관기관명));
  
  // Test filter
  const excludeRegions = ['부산', '대구', '인천', '광주', '대전', '울산', '세종', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'];
  const otherGyeonggiCities = ['수원', '성남', '고양', '부천', '안산', '안양', '남양주', '화성', '평택', '의정부', '시흥', '파주', '광명', '김포', '군포', '광주시', '이천', '양주', '오산', '구리', '안성', '포천', '의왕', '하남', '여주', '양평', '동두천', '과천', '가평', '연천'];
  
  console.log("--- MATCHES ---");
  items.forEach(item => {
      const targetText = (item.서비스명 || '') + (item.서비스목적요약 || '') + (item.지원대상 || '') + (item.소관기관명 || '');
      const hasGyeonggi = targetText.includes('경기') || targetText.includes('경기도');
      const hasYongin = targetText.includes('용인');
      if (hasGyeonggi || hasYongin) console.log("MATCH:", item.서비스명, "=>", targetText.substring(0, 50));
  });
}
test();
