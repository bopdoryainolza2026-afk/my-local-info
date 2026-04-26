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
  const [messages, setMessages] = useState<Message[]>([
    { type: 'bot', text: '안녕하세요! 무엇을 도와드릴까요?', id: Date.now() }
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 새 메시지가 추가될 때마다 하단으로 스크롤
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleQuestionClick = (question: string, answer: string) => {
    const userMsg: Message = { type: 'user', text: question, id: Date.now() };
    const botMsg: Message = { type: 'bot', text: answer, id: Date.now() + 1 };
    
    setMessages(prev => [...prev, userMsg]);
    
    // 봇 답변은 약간의 지연 시간을 두어 자연스럽게 표시
    setTimeout(() => {
      setMessages(prev => [...prev, botMsg]);
    }, 500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      {/* --- 채팅창 --- */}
      <div 
        className={`
          absolute bottom-20 right-0 w-[360px] h-[500px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col
          transition-all duration-300 origin-bottom-right
          ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}
          max-sm:fixed max-sm:inset-0 max-sm:w-full max-sm:h-full max-sm:rounded-none
        `}
      >
        {/* 상단 헤더 */}
        <div className="bg-blue-600 p-5 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">🤖</div>
            <div>
              <h3 className="font-bold text-lg">AI 상담원</h3>
              <p className="text-xs text-blue-100 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> 온라인
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
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`
                max-w-[80%] p-3 rounded-2xl text-sm shadow-sm
                ${msg.type === 'user' 
                  ? 'bg-blue-500 text-white rounded-tr-none' 
                  : 'bg-white text-slate-700 rounded-tl-none'}
              `}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* 하단 질문 영역 */}
        <div className="p-4 bg-white border-t border-slate-100">
          <p className="text-xs text-slate-400 mb-3 ml-1">자주 묻는 질문</p>
          <div className="flex flex-wrap gap-2">
            {chatData.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleQuestionClick(item.question, item.answer)}
                className="text-xs bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200 hover:border-blue-200 py-2 px-3 rounded-xl transition-all"
              >
                {item.question}
              </button>
            ))}
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
