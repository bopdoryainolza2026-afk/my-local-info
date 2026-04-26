'use client';

import React, { useState, useEffect, useRef } from 'react';
import chatData from '../../chat-data.json';

interface Message {
  type: 'user' | 'bot';
  text: string;
  id: number;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // 세션 ID 초기화 및 채팅 내역 불러오기
  useEffect(() => {
    let sid = localStorage.getItem('chat_session_id');
    if (!sid) {
      sid = 'user_' + Math.random().toString(36).substring(2, 11);
      localStorage.setItem('chat_session_id', sid);
    }
    setSessionId(sid);
  }, []);

  // 2초마다 새 메시지 확인 (폴링)
  useEffect(() => {
    if (!sessionId || !isOpen) return;

    const fetchHistory = async () => {
      try {
        const res = await fetch(`/api/chat/history?sessionId=${sessionId}`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        }
      } catch (err) {
        console.error("채팅 내역 조회 실패:", err);
      }
    };

    fetchHistory(); // 최초 실행
    const interval = setInterval(fetchHistory, 2000); // 2초마다 실행
    return () => clearInterval(interval);
  }, [sessionId, isOpen]);

  // 새 메시지가 추가될 때마다 하단으로 스크롤
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async (text: string) => {
    if (!text.trim() || !sessionId) return;

    const userText = text.trim();
    setInputText('');

    try {
      await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, message: userText, sender: 'user' }),
      });
      // 전송 성공 시 즉시 내역 갱신 (폴링을 기다리지 않음)
      const res = await fetch(`/api/chat/history?sessionId=${sessionId}`);
      if (res.ok) setMessages(await res.json());
    } catch (error) {
      console.error("메시지 전송 실패:", error);
    }
  };

  const handleQuestionClick = (question: string, answer: string) => {
    handleSend(question); // 질문을 DB에 저장
    // [참고] 시나리오 답변은 현재 1:1 상담 위주이므로 필요시 관리자가 직접 답변하게 됨
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      {/* --- 채팅창 --- */}
      <div 
        className={`
          absolute bottom-20 right-0 w-[360px] h-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col
          transition-all duration-300 origin-bottom-right
          ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}
          max-md:fixed max-md:inset-0 max-md:w-full max-md:h-full max-md:rounded-none
        `}
      >
        {/* 상단 헤더 */}
        <div className="bg-blue-600 p-5 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">🤖</div>
            <div>
              <h3 className="font-bold text-lg">AI 상담원</h3>
              <p className="text-xs text-blue-100 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> 실시간 답변 중
              </p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* 대화 영역 */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 bg-[#f0f2f5] space-y-4"
        >
          {messages.length === 0 && (
            <div className="text-center text-slate-400 text-xs mt-10">
              상담을 시작하려면 메시지를 입력해 주세요.
            </div>
          )}
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`
                max-w-[85%] p-3 rounded-2xl text-[13.5px] shadow-sm leading-relaxed
                ${msg.sender === 'user' 
                  ? 'bg-blue-500 text-white rounded-tr-none' 
                  : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'}
              `}>
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}
        </div>

        {/* 하단 질문 및 입력 영역 */}
        <div className="bg-white border-t border-slate-100 px-6 pt-4 pb-10">
          {/* 자주 묻는 질문 버튼 리스트 */}
          <div className="flex flex-wrap gap-2 mb-6 px-1">
            <p className="w-full text-[11px] text-slate-400 mb-1 ml-1 font-medium">자주 묻는 질문</p>
            {chatData.slice(0, 3).map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleQuestionClick(item.question, item.answer)}
                className="text-[12px] bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200 py-2 px-3.5 rounded-xl transition-all shadow-sm"
              >
                {item.question}
              </button>
            ))}
          </div>

          {/* 입력창 영역 - 훨씬 크고 여유롭게 변경 */}
          <div className="px-1">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(inputText); }}
              className="flex items-center gap-3 bg-slate-100 p-2.5 rounded-2xl shadow-inner border border-slate-200/50"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="궁금한 내용을 입력하세요..."
                className="flex-1 bg-transparent border-none focus:outline-none px-4 py-1.5 text-[14.5px] placeholder:text-slate-400"
                disabled={isLoading}
              />
              <button 
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className={`
                  w-11 h-11 rounded-xl flex items-center justify-center transition-all shadow-sm
                  ${inputText.trim() && !isLoading ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-300 text-slate-100'}
                `}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* --- 플로팅 버튼 --- */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-16 h-16 bg-blue-600 rounded-full shadow-lg flex items-center justify-center text-white
          hover:scale-110 active:scale-95 transition-all duration-300
          ${isOpen ? 'rotate-90' : 'rotate-0'}
        `}
      >
        {isOpen ? (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
        )}
      </button>
    </div>
  );
}
