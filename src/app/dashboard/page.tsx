"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home as HomeIcon, 
  Calendar, 
  Wallet, 
  MoreHorizontal, 
  Search, 
  Menu, 
  PartyPopper, 
  GraduationCap, 
  Briefcase, 
  Theater, 
  Utensils, 
  ChevronRight, 
  ArrowRight,
  Star,
  MapPin,
  Bookmark,
  Coffee,
  Clock,
  Bell,
  User
} from 'lucide-react';

// --- 이미지 URL 상세 설정 ---

const IMAGES = {
  TULIP_HERO: "https://lh3.googleusercontent.com/aida-public/AB6AXuDYzj814D77VI5TK1w7RctRT2zNRPAl5dVSvrx_KCGk1wSlVwt-qCbU95Czw0c8s2ftiEto_-8ojHjT1wsah1_3oNUanCs-gPJydEcFpQmLz0jPYGh_-s2__2LP-kLvtmfxoKQHPQZJdBpj2OELwby38HssIpm739rZi51j9MHmMGkTl1GyVDtjiNE1mQptevRBArdiqexr8tqiY8fHOmZFkfqLhccBJPv01GdoNVhP4GAkBafvOhDaZtI5U26skH7ZTavWgMu4hCqL",
  POEUN: "https://lh3.googleusercontent.com/aida-public/AB6AXuBJodv951cMy_Wzf0ojd2fEE3hx8qIFNTzUYrnLPDCoqVIjDvyvMfkaskM2I5jO9hXoPbjWpuePyflpfeSs5JLkiDfdUTBdA6rh0PN1vJm13j60srURj0BUvKfzp8bocqRCa2kpZ40bR28300oyEGRVldq2TusneVtCjUNBNFhEwUHkga1HIN0lJu9u-bOHon5FPUEpU8tWxH1EE7QZwsmsRr7-zbZFanlBSueXIiahxgT1hdfFvxT-SNjEWI0qt6sc9nPHrrpgZNxH",
  TULIP_EVENT: "https://lh3.googleusercontent.com/aida-public/AB6AXuDI1v627v457noIqfV4Dyx6D3N33fn9Szo17QIaODunbFW1b4k7DuRWVOf2VJK3YbQV38jU8EYTPncD6CZ9JVri76P-smQb4sXCEzD1zWm-ox2hC-yzDz3D46th_L5js5aA9paPpHN42Qjf7-ez5pQxSpNmf1fQyCxRyF0tvdOnahEgzh8myOEnq6uM4TDtwr5Px8E1ereuPZmkVl9zbbAbyqdnLVLJOc-tI0J5CRVfS3-VO0wf38D_W2NgoL7tQrlarQoxQfuRNKS5",
  MUSIC_NIGHT: "https://lh3.googleusercontent.com/aida-public/AB6AXuDk_AjLvOT287oW6CVEpyxUM7kedXGBMmZJvMdUl5q13r5ZhQjWKjKDQrH15JOHJBWj4PXwEUEGntsHeeFUotUAdSyHBgur-072k0O_0ziOjLvhemNLoZegEydUe7cP1_EdOgkX9MHB1ILjQCwiGKpfZL-RaZp_sIlNK8onECLkuZRyXvHIcElCMebsPVvYMjtMQVrNrKV7EJ9n327zg9wkcc31Jt2LaiFBLJHShGg_xY0j0OGpDWSkj-y5pj3MmIEImN-TWU7b63h2",
  SUBSIDY_BANNER: "https://lh3.googleusercontent.com/aida-public/AB6AXuDs57xYIGqVl7ONPZrR0TPdho7AQV9DcZK8GqYp-PdkP5gnvTqqOFmS8cctggNddZL88gK60z2soVavRs0zuiFP3WpYKFXa1BzeUW1VfBAsDqUPyqmWdyWRImkSpgNVesdANC7qlFY2fb0U0x88QxbkcpigU75kUpNEJDolmYr7rSSOkdsWbhNL_XF0G5JMqiOloe5yZ7RjEtqh_ENdap1tVqJtYQAsyNoPIVjmH-iZ98wvfMTVhhSDS33Yj6YpvzLbqFymaNAVSo-3",
  CAFE: "https://lh3.googleusercontent.com/aida-public/AB6AXuArxlhkl14L_nFMS0mrCdWHw25Lx3ZCIefS0a-xuQ2clwf3bZotdFuWkTMsXQVVFWpmxiB8CPQNaeH-qTfu-kBua5S3mygfUXe-j6iQeOY1GU0Ri-G047gcII0bT8NFXp4B3VZnthQWet8TWb4zO3R7PN5Iu8YoJ5G6wQHjkQUAbzFiflA0FzdswTLBD4XO9OlxbtNzAu9pqYrnrRVCeD6Zz2hlF0Qkn9BEu-7JqMN-En5fJZFIukLng_RZnhAfB8V9w8IKYcAs3a2Z",
  HANJEONGSIK: "https://lh3.googleusercontent.com/aida-public/AB6AXuDoSVeoJbi74NVXP9MrZWexTQ7TWfv8JdZGZ5rhSBkuzZmZljIY28xTt3zXwCfLEzMo0DWfGKzRvgBZcvMDKrI3v9ymvaQdf2FTJtH-wGy8J1X53UvfuR2R9aNIYgsduZjabBvM6VkLfYkhwcoOYjCrHs3oDrh1St-YMnpKRvJaZ7FqXIWLkDKowmNaTwZ--WaQzc-2QDHzN8KPDdWWHbeVySP8r0fW4WykiEIC9URcs4GMWv45SijQfd7JYlqPlblv3FJdvZ7NhuUP",
  BEEF: "https://lh3.googleusercontent.com/aida-public/AB6AXuA6pjX_FlDkP4l58Ym4N_CvViFecqMOb9dE7PoTZAD4VMh7i_pnpCEegYgQKgV0ZBpUGmVH2jUUICbsj3-tDA8-5SJm0MIYVYczGxUURczJHZmr8aa3xYZcclFPFj0whLalqRZ_2weatxXWmJGPEpDo1f-C43RovvgPH-y-MUQLB_QpL4mOVmiW3quQhHGDC6hFtmsyfR_E0WC9Ouluv9iN1gw0mbHPOis_k9Qb1wVPNwq2_Htabboy_i4hJPBP7LB3HgdjHp-9n4rw",
  DESSERT: "https://lh3.googleusercontent.com/aida-public/AB6AXuDVfJv4F6zKbh0IMhdCH0KjkgVPkA7QZBcGQRudK2oV9lxZF2EgXmluwx4RPh2RAYCvtLmfI5l0i79kOh_qA5I3vXJ5RqIhlo19dCOqG5Czc6ehmM6Oh2nqdPVc9UZ7sAJcvgZBJDR70uQ2uf0xQle0aXxgqqyk1SOHFILbbBmSl80yl2oaWhvlBKOeBMP_tTBKjXGYE8hm_64uWpMbGhIxBcY8HrcrzB61UpNHLJ_3gQSwGaIVRR3iPSoV61R1Vl-zUW9uzyFYxFxx"
};

// --- 화면별 컴포넌트 ---

const HomeScreen = () => (
  <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
    {/* 통합 검색창 */}
    <section className="relative">
      <div className="flex items-center gap-5 bg-white border border-slate-200 rounded-2xl px-8 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
        <Search className="text-slate-400 w-7 h-7" />
        <input 
          type="text" 
          placeholder="What are you looking for in Yongin?" 
          className="w-full bg-transparent border-none outline-none text-xl font-medium placeholder:text-slate-300"
        />
        <button className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-base shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all">
          검색
        </button>
      </div>
    </section>

    {/* 주요 카테고리 그리드 */}
    <section>
      <h2 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
        <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div> 핵심 서비스 바로가기
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {[
          { icon: <PartyPopper />, label: "축제/행사", color: "bg-indigo-50 text-indigo-600" },
          { icon: <Wallet />, label: "지원금/혜택", color: "bg-emerald-50 text-emerald-600" },
          { icon: <GraduationCap />, label: "교육/강좌", color: "bg-blue-50 text-blue-600" },
          { icon: <Briefcase />, label: "일자리소식", color: "bg-amber-50 text-amber-600" },
          { icon: <Theater />, label: "문화/예술", color: "bg-purple-50 text-purple-600" },
          { icon: <Utensils />, label: "추천맛집", color: "bg-rose-50 text-rose-600" },
        ].map((item, i) => (
          <button key={i} className="flex flex-col items-center justify-center p-8 bg-white rounded-[1.5rem] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-50 hover:shadow-xl hover:translate-y-[-6px] transition-all group">
            <div className={`p-5 rounded-3xl mb-4 ${item.color} group-hover:scale-110 transition-transform`}>
              {React.cloneElement(item.icon as React.ReactElement, { className: "w-9 h-9" })}
            </div>
            <span className="text-base font-bold text-slate-700 tracking-tight">{item.label}</span>
          </button>
        ))}
      </div>
    </section>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      {/* 투데이 용인 (메인 배너) */}
      <section className="lg:col-span-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-black text-slate-800 leading-tight mb-2 tracking-tighter">오늘의 용인 소식</h2>
            <p className="text-slate-400 text-base font-bold">지역의 생생한 소식을 지금 바로 확인하세요</p>
          </div>
          <button className="text-indigo-600 font-black text-base flex items-center gap-1 group">
            전체보기 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        <div className="relative rounded-[2rem] overflow-hidden aspect-[16/9] shadow-2xl group border-8 border-white">
          <img src={IMAGES.TULIP_HERO} alt="에버랜드 튤립 축제" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent flex flex-col justify-end p-12">
            <div className="flex gap-3 mb-6">
              <span className="bg-rose-500 text-white text-xs font-black px-4 py-1.5 rounded-xl uppercase tracking-wider shadow-lg">D-12</span>
              <span className="bg-white/20 backdrop-blur-md text-white text-xs font-black px-4 py-1.5 rounded-xl uppercase tracking-wider">FESTIVAL</span>
            </div>
            <h3 className="text-5xl font-black text-white mb-6 tracking-tighter leading-none">2024 에버랜드 튤립 축제</h3>
            <p className="text-slate-100 text-lg mb-10 max-w-2xl line-clamp-2 leading-relaxed font-medium opacity-90">용인의 봄을 알리는 화려한 튤립의 향연! 120만 송이의 튤립과 함께하는 마법 같은 시간을 경험하세요.</p>
            <button className="bg-white text-indigo-700 px-12 py-5 rounded-[1.5rem] font-black text-xl w-fit active:scale-95 hover:bg-indigo-50 transition-all shadow-2xl">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* 인기 지원금 리스트 */}
      <section className="lg:col-span-4">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-black text-slate-800 tracking-tighter">인기 지원금</h2>
          <button className="text-indigo-600 font-black text-base">전체보기</button>
        </div>
        <div className="space-y-6">
          {[
            { tag: "청년 지원", tagColor: "bg-indigo-50 text-indigo-700", title: "청년 기본소득", desc: "분기별 25만원, 연간 총 100만원 지급", amount: "₩250,000", meta: "만 24세 거주자" },
            { tag: "소상공인", tagColor: "bg-emerald-50 text-emerald-700", title: "경영안정 자금", desc: "디지털 전환 및 경영 컨설팅 지원", amount: "₩5,000,000", meta: "개인사업자" },
            { tag: "가족 지원", tagColor: "bg-rose-50 text-rose-700", title: "첫만남 이용권", desc: "출생 시 바로 사용 가능한 바우처", amount: "₩2,000,000", meta: "모든 보호자" },
          ].map((item, i) => (
            <div key={i} className="p-8 bg-white rounded-[1.5rem] border border-slate-50 shadow-sm flex flex-col group hover:shadow-2xl hover:border-indigo-100 transition-all cursor-pointer">
              <div className="flex justify-between items-start mb-5">
                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${item.tagColor}`}>{item.tag}</span>
                <Bookmark className="w-6 h-6 text-slate-200 group-hover:text-indigo-500 transition-colors" />
              </div>
              <h4 className="font-black text-2xl text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors tracking-tight">{item.title}</h4>
              <p className="text-base text-slate-400 mb-8 font-bold leading-relaxed">{item.desc}</p>
              <div className="flex justify-between items-end pt-6 border-t border-slate-50">
                <span className="text-indigo-600 font-black text-2xl tracking-tighter">{item.amount}</span>
                <span className="text-xs text-slate-400 font-bold">{item.meta}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>

    {/* 주요 공지사항 뉴스 티커 */}
    <div className="bg-indigo-600 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-2xl shadow-indigo-100 border-b-8 border-indigo-900/20">
      <div className="flex items-center gap-4 bg-white/20 backdrop-blur-md px-8 py-3 rounded-2xl flex-shrink-0 border border-white/20">
        <Bell className="text-white w-7 h-7 animate-swing" />
        <span className="text-white font-black text-base uppercase tracking-widest">주요 공지</span>
      </div>
      <p className="text-indigo-50 text-xl font-bold truncate flex-grow text-center md:text-left tracking-tight">
        [알림] 2024년 용인 시민안전보험 혜택이 대폭 강화되었습니다. 지금 상세 내용을 확인하세요.
      </p>
      <div className="bg-white/20 p-3 rounded-full hidden md:block">
        <ArrowRight className="text-white w-6 h-6" />
      </div>
    </div>
  </div>
);

const EventsScreen = () => (
  <div className="space-y-12 animate-in fade-in zoom-in-95 duration-700">
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
      <div className="flex items-center gap-6">
        <div className="bg-indigo-600 p-5 rounded-[2rem] shadow-2xl shadow-indigo-100"><Calendar className="text-white w-10 h-10" /></div>
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tighter">축제/행사 일정</h2>
          <p className="text-slate-400 font-bold text-lg mt-1 tracking-tight">용인에서 열리는 다채로운 행사를 만나보세요</p>
        </div>
      </div>
      <div className="flex gap-4 bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
        {["이번 주", "이번 달", "올해 전체"].map((tab, i) => (
          <button key={i} className={`px-10 py-3.5 rounded-2xl font-black text-base transition-all ${i === 0 ? "bg-indigo-600 text-white shadow-xl" : "text-slate-400 hover:text-indigo-600"}`}>
            {tab}
          </button>
        ))}
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {[
        { img: IMAGES.POEUN, dday: "D-3", type: "문화예술", title: "용인 포은문화제", date: "2024.05.15 - 2024.05.17", loc: "포은 정몽주 묘역 일원", badge: "무료 관람", color: "bg-rose-500" },
        { img: IMAGES.TULIP_EVENT, dday: "진행중", type: "대형축제", title: "에버랜드 튤립 축제", date: "2024.03.22 - 2024.06.16", loc: "용인 에버랜드", badge: "입장권 필요", color: "bg-indigo-500" },
        { img: IMAGES.MUSIC_NIGHT, dday: "예정", type: "음악공연", title: "별빛 음악회", date: "2024.05.12 (일)", loc: "중앙공원 야외음악당", badge: "시민 무료", color: "bg-amber-500" },
      ].map((event, i) => (
        <div key={i} className="bg-white rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-50 group hover:shadow-2xl hover:translate-y-[-12px] transition-all duration-700">
          <div className="relative aspect-[4/3] overflow-hidden">
            <img src={event.img} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
            <div className={`absolute top-8 left-8 ${event.color} text-white text-xs font-black px-4 py-2 rounded-xl shadow-2xl uppercase tracking-widest`}>{event.dday}</div>
            <div className="absolute bottom-8 right-8 bg-white/95 backdrop-blur-md text-indigo-700 text-xs font-black px-4 py-2 rounded-xl shadow-xl uppercase tracking-widest">{event.type}</div>
          </div>
          <div className="p-10">
            <h3 className="text-3xl font-black text-slate-800 mb-8 group-hover:text-indigo-600 transition-colors tracking-tighter leading-tight">{event.title}</h3>
            <div className="space-y-5 mb-10">
              <div className="flex items-center gap-4 text-slate-500 text-base font-bold">
                <Clock className="w-6 h-6 text-indigo-400" /> <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-4 text-slate-500 text-base font-bold">
                <MapPin className="w-6 h-6 text-indigo-400" /> <span>{event.loc}</span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-8 border-t border-slate-50">
              <span className="text-indigo-600 font-black text-xl tracking-tight">{event.badge}</span>
              <button className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-base active:scale-95 hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100">
                상세 정보 <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SubsidiesScreen = () => (
  <div className="space-y-12 animate-in fade-in slide-in-from-right-6 duration-700">
    <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 rounded-[2rem] p-16 text-white relative overflow-hidden shadow-2xl border-b-8 border-indigo-950/20">
      <div className="relative z-10 space-y-8 max-w-3xl">
        <h2 className="text-6xl font-black tracking-tighter leading-none">지원금 통합 조회</h2>
        <p className="text-indigo-100 text-2xl leading-relaxed opacity-90 font-medium tracking-tight">
          용인 시민을 위한 맞춤형 혜택을 한눈에 확인하고<br />놓치고 계신 복지 서비스를 지금 바로 신청하세요.
        </p>
        <div className="flex gap-6">
          <button className="bg-white text-indigo-700 px-12 py-5 rounded-[1.5rem] font-black text-xl shadow-2xl hover:bg-indigo-50 transition-all active:scale-95">맞춤 혜택 진단</button>
          <button className="bg-white/10 backdrop-blur-xl border border-white/20 text-white px-10 py-5 rounded-[1.5rem] font-black text-xl hover:bg-white/10 transition-all">공식 센터 연결</button>
        </div>
      </div>
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-white/10 rounded-full -mr-64 -mt-64 blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-400/20 rounded-full -mr-32 -mb-32 blur-[100px]" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
      <aside className="lg:col-span-1 space-y-10">
        <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-50">
          <h3 className="font-black text-2xl text-slate-800 mb-8 tracking-tighter">분류별 보기</h3>
          <div className="space-y-3">
            {["전체 보기", "청년 취업", "어르신 지원", "소상공인", "다자녀 가구", "에너지 바우처"].map((cat, i) => (
              <button key={i} className={`w-full text-left px-6 py-4 rounded-2xl font-black text-base transition-all ${i === 0 ? "bg-indigo-600 text-white shadow-2xl shadow-indigo-500/20" : "text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <div className="lg:col-span-3 space-y-8">
        <div className="bg-white rounded-2xl px-10 py-6 shadow-sm border border-slate-50 flex items-center justify-between">
          <span className="text-sm text-slate-400 font-black uppercase tracking-widest">현재 발굴된 용인 혜택: 128건</span>
          <div className="flex bg-slate-50 p-2 rounded-2xl border border-slate-100">
            <button className="px-8 py-3 bg-white rounded-xl text-base font-black text-indigo-600 shadow-md">인기순</button>
            <button className="px-8 py-3 text-base font-black text-slate-400">최신순</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { status: "신청 가능", statusColor: "bg-indigo-100 text-indigo-700", title: "청년 기본소득 지원", desc: "분기별 25만원 정기 지급. 거주 요건 확인 필수.", max: "최대 100만원", progress: 75, footerLeft: "D-12", footerRight: "실시간 접수 중" },
            { status: "예정", statusColor: "bg-slate-100 text-slate-500", title: "소상공인 지원 사업", desc: "지역 경제 활성화를 위한 경영 안정 자금 지원.", max: "최대 2,000만원", progress: 0, footerLeft: "10월 오픈", footerRight: "사전 알림 대기" },
            { status: "상시", statusColor: "bg-emerald-100 text-emerald-700", title: "다자녀 가구 주거지원", desc: "3자녀 이상 가구 특별 임대료 감면 혜택.", max: "월 30만원 감면", progress: 40, footerLeft: "상시 모집", footerRight: "서류 간소화" },
            { status: "마감임박", statusColor: "bg-rose-100 text-rose-700", title: "상수도 요금 할인", desc: "기초생활수급 및 차상위 대상 요금 반값 감면.", max: "50% 할인", progress: 92, footerLeft: "오늘 마감", footerRight: "최종 심사 중" },
          ].map((item, i) => (
            <div key={i} className="bg-white p-10 rounded-[2rem] shadow-sm border border-slate-50 group hover:shadow-2xl hover:border-indigo-100 transition-all duration-500">
              <div className="flex justify-between mb-8">
                <span className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${item.statusColor}`}>{item.status}</span>
                <Bookmark className="w-7 h-7 text-slate-100 group-hover:text-indigo-500 transition-colors" />
              </div>
              <h3 className="text-3xl font-black text-slate-800 mb-4 group-hover:text-indigo-600 transition-colors tracking-tighter leading-none">{item.title}</h3>
              <p className="text-lg text-slate-400 mb-10 font-bold leading-relaxed line-clamp-2">{item.desc}</p>
              <div className="space-y-8">
                <div className="flex justify-between items-end">
                  <span className="text-xs text-slate-400 font-black uppercase tracking-widest">지원 한도</span>
                  <span className="text-3xl font-black text-indigo-700 tracking-tighter">{item.max}</span>
                </div>
                <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000" style={{ width: `${item.progress}%` }} />
                </div>
                <div className="flex justify-between items-center text-sm font-black tracking-tight">
                  <span className="text-indigo-900">{item.footerLeft}</span>
                  <span className="text-slate-400">{item.footerRight}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const RestaurantsScreen = () => (
  <div className="space-y-12 animate-in fade-in slide-in-from-left-6 duration-700">
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
      <div className="flex items-center gap-6">
        <div className="bg-indigo-600 p-5 rounded-[2.5rem] shadow-2xl shadow-indigo-100"><Utensils className="text-white w-10 h-10" /></div>
        <h2 className="text-4xl font-black text-slate-800 tracking-tighter">용인 추천 맛집 가이드</h2>
      </div>
      <div className="flex gap-4 overflow-x-auto no-scrollbar w-full md:w-auto">
        {[
          { icon: <Coffee />, label: "카페/디저트", active: true },
          { icon: <Utensils />, label: "한식 정찬" },
          { icon: <MoreHorizontal />, label: "고기/구이" },
          { icon: <MoreHorizontal />, label: "퓨전/양식" },
        ].map((cat, i) => (
          <button key={i} className={`flex-shrink-0 flex items-center gap-4 px-10 py-4 rounded-[1.5rem] font-black text-lg shadow-sm border transition-all ${cat.active ? "bg-indigo-600 text-white border-transparent shadow-xl" : "bg-white text-slate-400 border-slate-50 hover:border-indigo-200"}`}>
            {React.cloneElement(cat.icon as React.ReactElement, { className: "w-6 h-6" })}
            <span>{cat.label}</span>
          </button>
        ))}
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
      {[
        { img: IMAGES.CAFE, rating: 4.5, tags: ["#감성분위기", "#주차편리"], title: "처인구 숲속 카페", loc: "처인구 양지면" },
        { img: IMAGES.HANJEONGSIK, rating: 4.8, tags: ["#가족외식", "#명가"], title: "수지 한정식 명가", loc: "수지구 신봉동" },
        { img: IMAGES.BEEF, rating: 4.9, tags: ["#프리미엄한우", "#개별룸"], title: "고기 굽는 정원", loc: "기흥구 보정동" },
        { img: IMAGES.DESSERT, rating: 4.7, tags: ["#인생샷", "#달콤한"], title: "성복동 달콤 오후", loc: "수지구 성복동" },
      ].map((shop, i) => (
        <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-slate-50 group hover:shadow-2xl hover:translate-y-[-10px] transition-all duration-500">
          <div className="relative aspect-video overflow-hidden">
            <img src={shop.img} alt={shop.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
            <div className="absolute top-8 right-8 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl flex items-center gap-2 shadow-2xl">
              <Star className="w-5 h-5 text-orange-400 fill-orange-400" />
              <span className="text-sm font-black text-slate-800">{shop.rating}</span>
            </div>
          </div>
          <div className="p-10">
            <div className="flex flex-wrap gap-3 mb-6">
              {shop.tags.map((t, idx) => <span key={idx} className="text-[11px] font-black text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-xl uppercase tracking-tight">{t}</span>)}
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-4 group-hover:text-indigo-600 transition-colors tracking-tighter leading-tight">{shop.title}</h3>
            <div className="flex items-center gap-3 text-slate-400 text-base font-bold">
              <MapPin className="w-5 h-5 text-indigo-400" /> <span>{shop.loc}</span>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* 플로팅 지도 보기 버튼 */}
    <div className="fixed bottom-12 right-12 z-50">
      <button className="bg-slate-900 text-white rounded-[2.5rem] px-10 py-6 shadow-2xl flex items-center gap-4 font-black text-xl active:scale-95 hover:bg-indigo-600 transition-all">
        <MapPin className="w-7 h-7" /> 주변 맛집 지도
      </button>
    </div>
  </div>
);

// --- 메인 앱 컴포넌트 ---

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <HomeScreen />;
      case 'events': return <EventsScreen />;
      case 'subsidies': return <SubsidiesScreen />;
      case 'restaurants': return <RestaurantsScreen />;
      default: return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-700 flex flex-col lg:flex-row overflow-x-hidden">
      
      {/* 데스크톱 사이드바 */}
      <aside className="hidden lg:flex w-96 bg-slate-950 h-screen sticky top-0 flex-col p-12 text-white z-[60]">
        <div className="flex items-center gap-5 mb-24">
          <div className="w-14 h-14 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/20">
            <User className="text-white w-7 h-7" />
          </div>
          <div>
            <span className="font-black text-3xl tracking-tighter leading-none block">용인 All-in-One</span>
            <span className="text-slate-500 text-[11px] font-black uppercase tracking-[0.2em] mt-2 block">Premium Citizen Portal</span>
          </div>
        </div>
        
        <nav className="flex-1 space-y-6">
          <SidebarButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<HomeIcon />} label="홈 화면" />
          <SidebarButton active={activeTab === 'events'} onClick={() => setActiveTab('events')} icon={<Calendar />} label="축제 및 행사" />
          <SidebarButton active={activeTab === 'subsidies'} onClick={() => setActiveTab('subsidies')} icon={<Wallet />} label="지원금·복지" />
          <SidebarButton active={activeTab === 'restaurants'} onClick={() => setActiveTab('restaurants')} icon={<Utensils />} label="맛집 가이드" />
        </nav>

        <div className="mt-auto space-y-10">
          <div className="bg-white/5 p-8 rounded-[3rem] border border-white/5">
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-4">인증 등급</p>
            <p className="text-lg font-black mb-6 text-white tracking-tight">용인시 우수회원</p>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: "85%" }} transition={{ duration: 1.5 }} className="bg-indigo-500 h-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"></motion.div>
            </div>
            <p className="text-[10px] text-indigo-400 mt-4 font-black text-right uppercase tracking-widest">Lv. 4 Verified</p>
          </div>
          <button className="w-full py-6 bg-indigo-600 rounded-[1.5rem] font-black text-lg active:scale-95 hover:bg-white hover:text-indigo-900 transition-all shadow-2xl shadow-indigo-900/40">
            계정 관리
          </button>
        </div>
      </aside>

      {/* 메인 컨텐츠 영역 */}
      <div className="flex-1 flex flex-col relative w-full lg:min-h-screen">
        {/* 상단 헤더 */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-slate-100 flex-shrink-0">
          <div className="max-w-7xl mx-auto px-8 h-24 flex items-center justify-between">
            <div className="flex lg:hidden items-center gap-5">
              <button className="p-3 border border-slate-100 bg-white shadow-sm rounded-2xl">
                <Menu className="w-7 h-7 text-indigo-600" />
              </button>
              <h1 className="text-3xl font-black text-indigo-600 tracking-tighter">용인 포털</h1>
            </div>
            
            <div className="hidden lg:block">
              <h1 className="text-4xl font-black text-slate-800 tracking-tighter leading-none">
                반갑습니다, <span className="text-indigo-600">용인 시민님!</span>
              </h1>
              <p className="text-slate-400 font-bold text-base mt-2">함께 만들고 즐기는 우리 도시, 용인의 하루를 시작하세요.</p>
            </div>

            <div className="flex items-center gap-6">
              <button className="p-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-slate-400 hover:text-indigo-600 transition-all group active:scale-95 shadow-sm">
                <Search className="w-7 h-7" />
              </button>
              <button className="relative p-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-slate-400 hover:text-indigo-600 transition-all group active:scale-95 shadow-sm">
                <Bell className="w-7 h-7" />
                <span className="absolute top-3.5 right-3.5 w-3.5 h-3.5 bg-rose-500 rounded-full border-4 border-white"></span>
              </button>
              <div className="hidden lg:flex items-center gap-5 pl-6 border-l border-slate-200">
                <div className="text-right">
                  <p className="text-lg font-black text-slate-800 leading-none mb-1">홍길동 님</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Premium Citizen</p>
                </div>
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80" className="w-16 h-16 rounded-[2rem] border-4 border-indigo-50 p-1 object-cover shadow-lg" alt="Profile" />
              </div>
            </div>
          </div>
        </header>

        {/* 본문 레이아웃 */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-8 py-16 lg:py-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.99, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.01, y: -15 }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* 모바일 최적화 하단 탭 내비게이션 */}
      <nav className="lg:hidden fixed bottom-10 left-10 right-10 z-50 bg-slate-950 shadow-2xl border border-white/10 rounded-2xl p-4 flex justify-between items-center backdrop-blur-3xl bg-opacity-95">
        <NavButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<HomeIcon />} label="홈" />
        <NavButton active={activeTab === 'events'} onClick={() => setActiveTab('events')} icon={<Calendar />} label="행사" />
        <NavButton active={activeTab === 'subsidies'} onClick={() => setActiveTab('subsidies')} icon={<Wallet />} label="지원금" />
        <NavButton active={activeTab === 'restaurants'} onClick={() => setActiveTab('restaurants')} icon={<Utensils />} label="맛집" />
      </nav>
    </div>
  );
}

function SidebarButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-5 px-8 py-5 rounded-[1.75rem] font-black text-lg transition-all group ${active ? "bg-indigo-600 text-white shadow-2xl shadow-indigo-600/30" : "text-slate-500 hover:bg-white/5 hover:text-slate-200"}`}
    >
      <div className={`transition-transform duration-500 ${active ? "scale-110" : "scale-100 group-hover:rotate-12"}`}>
        {React.cloneElement(icon as React.ReactElement, { className: "w-7 h-7" })}
      </div>
      <span className="tracking-tight">{label}</span>
      {active && (
        <motion.div layoutId="desktopActive" className="ml-auto w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
      )}
    </button>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex-1 flex flex-col items-center gap-2 transition-all relative group py-3 ${active ? "text-indigo-400 scale-105" : "text-slate-500"}`}
    >
      <div className={`p-3 transition-all duration-500 rounded-2xl ${active ? "bg-indigo-500/10 shadow-inner" : ""}`}>
        {React.cloneElement(icon as React.ReactElement, { 
          className: `w-7 h-7 transition-colors ${active ? "stroke-[2.5px]" : "stroke-[1.5px]"}` 
        })}
      </div>
      <span className={`text-[11px] font-black uppercase tracking-tighter transition-all ${active ? "opacity-100" : "opacity-0 translate-y-2"}`}>{label}</span>
      {active && (
        <motion.div 
          layoutId="mobileActive"
          className="absolute -bottom-2 w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_12px_rgba(99,102,241,1)]"
        />
      )}
    </button>
  );
}
