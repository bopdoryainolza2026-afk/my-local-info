'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function AdminChatPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [replyText, setReplyText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // 세션 목록 불러오기 (2초마다 갱신)
  useEffect(() => {
    const fetchSessions = async () => {
      const res = await fetch('/api/chat/sessions');
      if (res.ok) setSessions(await res.json());
    };
    fetchSessions();
    const interval = setInterval(fetchSessions, 2000);
    return () => clearInterval(interval);
  }, []);

  // 선택된 세션의 대화 내역 불러오기 (2초마다 갱신)
  useEffect(() => {
    if (!selectedSession) return;
    const fetchHistory = async () => {
      const res = await fetch(`/api/chat/history?sessionId=${selectedSession}`);
      if (res.ok) setMessages(await res.json());
    };
    fetchHistory();
    const interval = setInterval(fetchHistory, 2000);
    return () => clearInterval(interval);
  }, [selectedSession]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedSession) return;
    const text = replyText.trim();
    setReplyText('');

    try {
      await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: selectedSession, message: text, sender: 'admin' }),
      });
      const res = await fetch(`/api/chat/history?sessionId=${selectedSession}`);
      if (res.ok) setMessages(await res.json());
    } catch (error) {
      console.error("답장 전송 실패:", error);
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans">
      {/* 사이드바: 세션 목록 */}
      <div className="w-1/3 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-5 border-b border-slate-100 bg-slate-50">
          <h1 className="text-xl font-bold text-slate-800">채팅 상담 관리</h1>
        </div>
        <div className="flex-1 overflow-y-auto">
          {sessions.map(s => (
            <div 
              key={s.id} 
              onClick={() => setSelectedSession(s.id)}
              className={`p-4 border-b border-slate-50 cursor-pointer transition-colors ${selectedSession === s.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'hover:bg-slate-50'}`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-sm font-bold text-slate-700">{s.id}</span>
                <span className="text-[10px] text-slate-400">{new Date(s.lastTimestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
              <div className="text-xs text-slate-500 truncate">{s.lastMessage}</div>
              {s.unread && <span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-1"></span>}
            </div>
          ))}
        </div>
      </div>

      {/* 메인: 대화창 */}
      <div className="flex-1 flex flex-col bg-[#f0f2f5]">
        {selectedSession ? (
          <>
            <div className="p-5 bg-white border-b border-slate-200 flex justify-between items-center">
              <h2 className="font-bold text-slate-700">{selectedSession} 상담 중</h2>
            </div>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map(m => (
                <div key={m.id} className={`flex ${m.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${m.sender === 'admin' ? 'bg-yellow-400 text-slate-800 rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none border border-slate-200 shadow-sm'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-white border-t border-slate-200">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                  placeholder="답장을 입력하세요..."
                  className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  onClick={handleSendReply}
                  className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-blue-700"
                >
                  전송
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400">
            좌측에서 상담할 세션을 선택해 주세요.
          </div>
        )}
      </div>
    </div>
  );
}
