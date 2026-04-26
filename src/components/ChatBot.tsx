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
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 새 메시지가 추가될 때마다 하단으로 스크롤
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, isLoading]);

  const addMessage = (type: 'user' | 'bot', text: string) => {
    setMessages(prev => [...prev, { type, text, id: Date.now() }]);
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userText = text.trim();
    setInputText('');
    addMessage('user', userText);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText }),
      });

      const data = await response.json();
      if (data.answer) {
        addMessage('bot', data.answer);
      } else {
        addMessage('bot', '죄송합니다. 답변을 가져오는 중에 문제가 발생했습니다.');
      }
    } catch (error) {
      addMessage('bot', '서버와의 통신에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionClick = (question: string, answer: string) => {
    addMessage('user', question);
    setTimeout(() => {
      addMessage('bot', answer);
    }, 500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      {/* --- 채팅창 --- */}
      <div 
        className={`
          absolute bottom-20 right-0 w-[360px] h-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col
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
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`
                max-w-[85%] p-3 rounded-2xl text-[13.5px] shadow-sm leading-relaxed
                ${msg.type === 'user' 
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
        <div className="bg-white border-t border-slate-100 p-3">
          {/* 자주 묻는 질문 버튼들 */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {chatData.slice(0, 3).map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleQuestionClick(item.question, item.answer)}
                className="text-[11px] bg-slate-50 hover:bg-blue-50 text-slate-500 hover:text-blue-600 border border-slate-200 py-1.5 px-2.5 rounded-lg transition-all"
              >
                {item.question}
              </button>
            ))}
          </div>

          {/* 입력창 */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(inputText); }}
            className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="메시지를 입력하세요..."
              className="flex-1 bg-transparent border-none focus:outline-none px-3 text-sm"
              disabled={isLoading}
            />
            <button 
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className={`
                p-2 rounded-xl transition-all
                ${inputText.trim() && !isLoading ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-300 text-slate-100'}
              `}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
          </form>
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
