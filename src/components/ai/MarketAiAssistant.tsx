import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, HelpCircle, ChevronDown, MessageSquare } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

const FAQ_PROMPTS = [
  'What are Downtown Market operating hours?',
  'Where is Green Valley Stall #14 located?',
  'Can I cancel or modify after cutoff time?',
  'How do farmers get USDA Organic approval?',
];

export const MarketAiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: 'Hello! I am MarketLink AI Assistant. How can I help you today with market hours, vendor pre-orders, stall locations, or fresh produce recommendations?',
      timestamp: 'Just now',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Generate intelligent contextual response
    setTimeout(() => {
      let reply = "I'm here to assist with any questions on market locations, stall pickups, or farmer orders!";
      const q = query.toLowerCase();

      if (q.includes('downtown') || q.includes('hours') || q.includes('timings')) {
        reply =
          'Downtown Fresh Pavilion is open Wednesday, Saturday & Sunday from 07:30 AM to 02:00 PM. Pre-order curbside pickup is located at Gate 2 North Shed.';
      } else if (q.includes('green valley') || q.includes('stall') || q.includes('located') || q.includes('where')) {
        reply =
          'Green Valley Organic Stall is at Booth #14 inside North Shed A. Coordinates: 37.7749° N, 122.4194° W. Check the Navigation tab for turn-by-turn directions!';
      } else if (q.includes('modify') || q.includes('cancel') || q.includes('cutoff')) {
        reply =
          'Pre-orders can be modified or cancelled up to the cutoff time (Friday 08:00 PM for weekend pickup). Once cutoff passes, vendors prepare the fresh harvest and orders are locked.';
      } else if (q.includes('organic') || q.includes('approval') || q.includes('usda') || q.includes('farmer')) {
        reply =
          'Farmers apply for certification through the Admin Panel. Superadmins verify USDA organic licenses, pesticide-free lab tests, and farm coordinates prior to granting the Bio-Certified badge.';
      } else if (q.includes('reorder') || q.includes('cart')) {
        reply =
          'You can reorder previous favorites with a single click in your Customer Dashboard under "Order History".';
      } else {
        reply = `Thanks for asking about "${query}". In MarketLink, you can easily check real-time stock, reserve morning harvest batches, and navigate straight to vendor stalls!`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: 'ai-' + Date.now(),
          sender: 'ai',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Collapsed Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-4 py-3 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 cursor-pointer border border-emerald-400/30"
          title="Open Market AI Assistant"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-300 rounded-full border-2 border-emerald-700 animate-pulse" />
          </div>
          <span className="text-xs font-bold tracking-wide">MarketLink AI</span>
          <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
        </button>
      )}

      {/* Expanded Floating Chat Panel */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 to-emerald-950 p-4 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold flex items-center gap-1.5">
                  MarketLink Concierge
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                </h4>
                <p className="text-[11px] text-emerald-200/80">Always active • Market FAQs & Assistance</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          {/* Quick FAQ Chips */}
          <div className="p-3 bg-emerald-50/40 border-b border-emerald-100 flex gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
            {FAQ_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap bg-white text-slate-700 border border-emerald-200/70 hover:border-emerald-500 hover:bg-emerald-50 px-2.5 py-1 rounded-full font-medium transition-colors shrink-0 shadow-2xs cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 text-xs mt-0.5 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 shadow-2xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-slate-900 text-white rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-200/70 rounded-bl-xs'
                  }`}
                >
                  <p>{m.text}</p>
                  <span
                    className={`block text-[9px] mt-1 ${
                      m.sender === 'user' ? 'text-slate-400 text-right' : 'text-slate-400'
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 items-center text-slate-400 text-xs pl-2">
                <Bot className="w-4 h-4 text-emerald-600 animate-bounce" />
                <span>Assistant is typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about markets, vendors, cutoff times..."
              className="flex-1 text-xs px-3.5 py-2.5 bg-slate-100/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="w-9 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white flex items-center justify-center transition-all shrink-0 cursor-pointer shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
