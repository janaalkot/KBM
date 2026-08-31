import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Plus, Bot, ArrowLeft, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { ChatMessage } from '../types';

export const ChatbotPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      text: 'Hello, How can I help you today? Ask me anything about our knowledge base.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: `Based on our knowledge base, I found relevant documentation regarding "${userText}".\n\nKey takeaways:\n• System workflows follow standardized engineering practices.\n• Ensure validation matrices are applied in accordance with QA protocols.\n\nWould you like me to pull up the full lesson?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 850);
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        sender: 'assistant',
        text: 'Hello, How can I help you today? Feel free to ask any technical or procedural question.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-4.25rem)] max-w-7xl flex-col px-4 py-3 sm:px-6 lg:px-8">
      <div className="shrink-0 mb-2">
        <Breadcrumbs items={[{ label: 'AI Copilot' }]} />
      </div>

      <div className="grid flex-1 grid-cols-1 gap-6 overflow-hidden md:grid-cols-4 pb-2">
        {/* History Sidebar */}
        <div className="hidden flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800/80 dark:bg-[#0b1623] md:flex">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                History
              </span>
              <button
                type="button"
                onClick={handleNewChat}
                title="Clear Chat"
                className="text-slate-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="mt-4 text-xs text-slate-600 dark:text-slate-400">
              All your conversations and engineering inquiries are saved in this session.
            </p>
          </div>

          <button
            type="button"
            onClick={handleNewChat}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700/80 dark:bg-[#07101a] dark:text-slate-200 dark:hover:bg-[#0f1d2e] dark:hover:text-white"
          >
            <Plus className="h-4 w-4 text-sky-500" />
            New Conversation
          </button>
        </div>

        {/* Chat Main Area */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-800/80 dark:bg-[#0b1623] md:col-span-3">
          {/* Top Header */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-5 py-3 backdrop-blur dark:border-slate-800 dark:bg-[#07101a]">
            <div className="flex items-center gap-3">
              <Link
                to="/lessons"
                aria-label="Back to lessons"
                className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 border border-sky-500/30 dark:bg-sky-500/20 dark:text-sky-400">
                  <Bot className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">AI Assistant</h2>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Advansys Knowledge Copilot</p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleNewChat}
              className="md:hidden flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:text-slate-300"
            >
              <Plus className="h-3.5 w-3.5 text-sky-500" />
              New
            </button>
          </div>

          {/* Message Stream */}
          <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 border border-sky-500/20 dark:bg-sky-500/20 dark:text-sky-400">
                    <Sparkles className="h-4 w-4" />
                  </div>
                )}
                <div className="flex flex-col gap-1 max-w-[85%] sm:max-w-md">
                  <div
                    className={`rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm whitespace-pre-line ${
                      msg.sender === 'user'
                        ? 'bg-sky-600 text-white rounded-br-none'
                        : 'border border-slate-200 bg-slate-100 text-slate-800 rounded-bl-none dark:border-slate-800/80 dark:bg-[#07101a] dark:text-slate-200'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span
                    className={`text-[10px] text-slate-400 px-1 ${
                      msg.sender === 'user' ? 'text-right' : 'text-left'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 justify-start items-center">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400">
                  <Sparkles className="h-4 w-4 animate-spin" />
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-xs text-slate-500 dark:border-slate-800 dark:bg-[#07101a] dark:text-slate-400">
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Fixed Input */}
          <div className="border-t border-slate-200 bg-slate-50/80 p-3.5 dark:border-slate-800 dark:bg-[#07101a]">
            <form onSubmit={handleSend} className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about your knowledge base..."
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-4 pr-12 text-xs text-slate-900 placeholder-slate-400 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700/80 dark:bg-[#0b1623] dark:text-white dark:placeholder-slate-500"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                aria-label="Send message"
                className="absolute right-1.5 rounded-lg bg-sky-600 p-2 text-white shadow-sm transition hover:bg-sky-500 disabled:opacity-40 disabled:hover:bg-sky-600"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
            <p className="mt-1.5 text-center text-[10px] text-slate-500 dark:text-slate-400">
              AI may produce inaccurate info. Verify important facts with original documents.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};