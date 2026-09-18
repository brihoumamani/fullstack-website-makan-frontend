'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function SendMessageModal({
  isOpen,
  onClose,
  agentName = 'Micheal James',
  agentRole = 'Real Estate Specialist',
  agentAvatar = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  advertNo = '0-1234',
  propertyId = null,
  recipientAgentId = null
}) {
  const { user, API_BASE } = useAuth();
  const isCompany = agentRole.toLowerCase().includes('company');
  const modalTitle = isCompany ? 'Send Message to Building Company' : 'Send Message to Advertiser';
  const itemType = isCompany ? 'project' : 'advertisement';

  const [messages, setMessages] = useState([
    {
      id: 'init-1',
      sender: 'agent',
      text: `Hello, you can send your questions about the ${itemType} numbered ${advertNo}.`,
      time: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Escape key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || sending) return;

    const messageContent = inputText.trim();
    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: messageContent,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setSending(true);

    // Save to Backend Database
    try {
      const apiEndpoint = `${API_BASE || 'http://localhost:5000'}/api/leads`;
      await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: user?.name || 'Visiteur Makan',
          email: user?.email || 'visiteur@makan.dz',
          phone: user?.phone || '+213 550 00 00 00',
          message: messageContent,
          propertyId: propertyId || null,
          recipientAgentId: recipientAgentId || null
        })
      });
    } catch (err) {
      console.error('Error saving lead to database:', err);
    } finally {
      setSending(false);
    }

    // Simulate Agent / Company Typing & Auto-Response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `agent-${Date.now()}`,
          sender: 'agent',
          text: `Merci pour votre message concernant #${advertNo}. Notre conseiller vous répondra directement sur votre tableau de bord ou par téléphone !`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px] animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-[540px] bg-white dark:bg-[#1e293b] rounded-[4px] shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* 1. Header with Close Button */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-800">
          <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white tracking-tight mx-auto pl-6">
            {modalTitle}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-6 h-6 rounded-full bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-500 dark:text-gray-300 flex items-center justify-center text-xs transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* 2. Agent / Company Profile Strip */}
        <div className="flex items-center space-x-3.5 px-6 py-3.5 bg-gray-50/70 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-800">
          <div className="w-11 h-11 rounded-full border-2 border-amber-400 overflow-hidden shadow-xs shrink-0 bg-slate-800 flex items-center justify-center">
            {isCompany ? (
              <svg viewBox="0 0 100 100" className="w-8 h-8" fill="none">
                <path d="M50 10L25 90H45L60 35L50 10Z" fill="#38BDF8" />
                <path d="M55 25L42 90H62L75 45L55 25Z" fill="#818CF8" />
              </svg>
            ) : (
              <img
                src={agentAvatar}
                alt={agentName}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
              {agentName}
            </div>
            <div className="text-[11px] text-gray-400 dark:text-gray-400">
              {agentRole}
            </div>
          </div>
        </div>

        {/* 3. Messages Chat Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4 min-h-[220px] max-h-[340px] bg-[#FAFBFD] dark:bg-[#151e2e]">
          {messages.map((msg) => {
            const isAgent = msg.sender === 'agent';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isAgent ? 'items-start' : 'items-end'}`}
              >
                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-[13px] leading-relaxed max-w-[85%] shadow-xs ${
                    isAgent
                      ? 'bg-[#C8E6C9] dark:bg-emerald-950/70 text-[#1B5E20] dark:text-emerald-200 rounded-tl-xs border border-[#A5D6A7] dark:border-emerald-800/60'
                      : 'bg-[#4285F4] text-white rounded-tr-xs'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9.5px] text-gray-400 dark:text-gray-500 mt-1 px-1">
                  {msg.time}
                </span>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center space-x-1.5 bg-[#C8E6C9]/60 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 p-2.5 rounded-2xl rounded-tl-xs w-fit text-xs">
              <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 4. Bottom Input Form */}
        <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-[#1e293b] border-t border-gray-100 dark:border-slate-800 flex items-center space-x-2.5">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Your message..."
            autoFocus
            className="flex-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-[3px] py-2 px-3.5 text-xs sm:text-sm text-gray-800 dark:text-gray-200 outline-none focus:border-[#66BB6A] placeholder:text-gray-400"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className={`border px-5 py-2 rounded-[3px] text-xs font-bold transition-all ${
              inputText.trim()
                ? 'border-[#66BB6A] text-[#66BB6A] hover:bg-[#66BB6A] hover:text-white shadow-xs cursor-pointer'
                : 'border-gray-200 dark:border-slate-700 text-gray-300 dark:text-gray-600 cursor-not-allowed'
            }`}
          >
            Send
          </button>
        </form>

      </div>
    </div>
  );
}
