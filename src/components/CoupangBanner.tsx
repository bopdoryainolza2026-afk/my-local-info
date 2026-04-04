export default function CoupangBanner() {
  const coupangId = process.env.NEXT_PUBLIC_COUPANG_PARTNER_ID;
  const showBanner = coupangId && coupangId !== "나중에_입력";

  if (!showBanner) return null;

  return (
    <div style={{ margin: "30px 0", textAlign: "center", overflow: "hidden" }}>
      <iframe
        src={`https://ads-partners.coupang.com/widgets.html?id=${coupangId}&template=carousel&trackingCode=${coupangId}&subId=&mainItem=&size=120&width=680&height=120&bgColor=ffffff`}
        width="100%"
        height="120"
        frameBorder="0"
        scrolling="no"
        referrerPolicy="unsafe-url"
        style={{ maxWidth: "680px", margin: "0 auto", display: "block" }}
      ></iframe>
      <p style={{ fontSize: "11px", color: "#94a3b8", marginTop: "8px" }}>
        이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
      </p>
    </div>
  );
}
