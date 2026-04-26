'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [replyText, setReplyText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin1234') {
      setIsAuthorized(true);
    } else {
      alert('비밀번호가 틀렸습니다.');
    }
  };

  // 세션 목록 불러오기 (2초마다 갱신)
  useEffect(() => {
    if (!isAuthorized) return;
    const fetchSessions = async () => {
      try {
        const res = await fetch('/api/chat-sessions'); // 세션 목록 API (추후 구현 가정)
        if (res.ok) setSessions(await res.json());
      } catch (err) {}
    };
    fetchSessions();
    const interval = setInterval(fetchSessions, 2000);
    return () => clearInterval(interval);
  }, [isAuthorized]);

  // 선택된 세션의 대화 내역 불러오기 (2초마다 갱신)
  useEffect(() => {
    if (!isAuthorized || !selectedSession) return;
    const fetchHistory = async () => {
      try {
        const res = await fetch(`/api/chat-poll?sessionId=${selectedSession}`);
        if (res.ok) setMessages(await res.json());
      } catch (err) {}
    };
    fetchHistory();
    const interval = setInterval(fetchHistory, 2000);
    return () => clearInterval(interval);
  }, [isAuthorized, selectedSession]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedSession) return;
    const text = replyText.trim();
    setReplyText('');

    try {
      await fetch('/api/chat-human', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: selectedSession, message: text, sender: 'admin' }),
      });
      // 즉시 갱신
      const res = await fetch(`/api/chat-poll?sessionId=${selectedSession}`);
      if (res.ok) setMessages(await res.json());
    } catch (error) {
      console.error("답장 실패:", error);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <form onSubmit={handleLogin} className="p-8 bg-white rounded-2xl shadow-xl w-full max-w-sm text-center">
          <h1 className="text-2xl font-bold mb-6 text-slate-800">관리자 로그인</h1>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호 입력"
            className="w-full p-3 border border-slate-200 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">접속</button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f0f2f5] font-sans">
      {/* 사이드바: 상담 목록 */}
      <div className="w-1/3 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            🎧 상담 대기 리스트
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {sessions.length === 0 && (
            <div className="p-10 text-center text-slate-400 text-sm">현재 대기 중인 상담이 없습니다.</div>
          )}
          {sessions.map(s => (
            <div 
              key={s.id} 
              onClick={() => setSelectedSession(s.id)}
              className={`p-5 border-b border-slate-50 cursor-pointer transition-all ${selectedSession === s.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'hover:bg-slate-50'}`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-bold text-slate-700 truncate w-2/3">{s.id}</span>
                <span className="text-[10px] text-slate-400">{new Date(s.lastTimestamp || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
              <div className="text-xs text-slate-500 truncate">{s.lastMessage || '대기 중...'}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 메인: 대화창 */}
      <div className="flex-1 flex flex-col h-full">
        {selectedSession ? (
          <>
            <div className="p-5 bg-white border-b border-slate-200 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">👤</div>
              <div>
                <h3 className="font-bold text-slate-800">{selectedSession}님과 상담 중</h3>
                <p className="text-xs text-green-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> 연결됨
                </p>
              </div>
            </div>
            
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 px-12">
              {messages.map(m => (
                <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end pr-4' : 'justify-start'}`}>
                  <div className={`
                    max-w-[80%] p-4 rounded-2xl text-[16px] shadow-md leading-relaxed
                    ${m.sender === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-white text-slate-700 rounded-tl-none border border-slate-200'}
                  `}>
                    {m.message || m.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-5 bg-white border-t border-slate-200">
              <div className="flex gap-3 bg-slate-100 p-2 rounded-2xl">
                <input 
                  type="text" 
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                  placeholder="답장을 입력하세요..."
                  className="flex-1 bg-transparent border-none px-4 py-2 text-sm focus:outline-none"
                />
                <button 
                  onClick={handleSendReply}
                  disabled={!replyText.trim()}
                  className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 disabled:bg-slate-300 transition-colors shadow-md"
                >
                  전송
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-4">
            <div className="text-5xl opacity-20">💬</div>
            <p>상담할 세션을 왼쪽에서 선택해 주세요.</p>
          </div>
        )}
      </div>
    </div>
  );
}
