'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Copy, 
  RefreshCw, 
  Trash2, 
  MessageSquare, 
  Compass,
  Check,
  Settings,
  Key
} from 'lucide-react';
import { useTrip } from '@/context/TripContext';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export default function ChatAssistantPage() {
  const { user, activeTrip } = useTrip();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: `Hello ${user?.name?.split(' ')[0] || 'Traveler'}! I am your 24/7 TravelMate AI Concierge. How can I assist your travel plans today? You can ask me for flight hacks, hidden local gems, or custom itinerary tweaks!`,
      timestamp: '10:30 AM'
    }
  ]);

  React.useEffect(() => {
    if (user?.name) {
      setMessages(prev => {
        const newMessages = [...prev];
        if (newMessages[0].id === 'msg-1' && newMessages.length === 1) {
          newMessages[0].text = `Hello ${user.name.split(' ')[0]}! I am your 24/7 TravelMate AI Concierge. How can I assist your travel plans today? You can ask me for flight hacks, hidden local gems, or custom itinerary tweaks!`;
        }
        return newMessages;
      });
    }
  }, [user]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState('');

  React.useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    } else if (process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      setApiKey(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
    }
  }, []);

  const saveApiKey = () => {
    localStorage.setItem('gemini_api_key', apiKey);
    setShowSettings(false);
  };

  const quickPrompts = [
    'Suggest top 3 ramen spots in Tokyo',
    'What is the best month to visit Kyoto for cherry blossoms?',
    'How do I handle public transit in Paris?',
    'List budget hacks for a Bali trip'
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    try {
      const tripIdStr = activeTrip?.id || '';
      const isDbTrip = !isNaN(parseInt(tripIdStr)) && !tripIdStr.includes('trip-');
      const endpoint = isDbTrip ? `/api/trips/${tripIdStr}/chat/stream` : '/api/chat/stream';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-key': apiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '',
          'Authorization': `Bearer ${localStorage.getItem('travelmate_token') || ''}`
        },
        body: JSON.stringify({ message: query }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch AI response');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      const aiMsgId = `msg-${Date.now() + 1}`;
      setMessages(prev => [...prev, {
        id: aiMsgId,
        sender: 'ai',
        text: '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsTyping(false); // Stop "typing" indicator, we are streaming now

      if (reader) {
        let aiText = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.replace('data: ', '').trim();
              if (dataStr === '[DONE]') continue;
              try {
                if (dataStr) {
                  const parsed = JSON.parse(dataStr);
                  if (parsed.text) {
                    aiText += parsed.text;
                    setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, text: aiText } : m));
                  }
                }
              } catch (e) {
                // Ignore parse errors from partial chunks
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat stream error:', error);
      setMessages(prev => [...prev, {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: 'Sorry, I encountered an error connecting to the AI provider.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsTyping(false);
    }
  };

  const copyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="h-[78vh] flex flex-col lg:flex-row gap-6">
      
      {/* Left Chat History Drawer Column */}
      <div className="hidden lg:flex flex-col w-64 glass-card p-4 border border-cyan-500/20 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-cyan-400 font-mono uppercase tracking-wider">Chat History</span>
          <button
            onClick={() => setMessages([messages[0]])}
            className="p-1 text-slate-500 hover:text-red-400 transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2 flex-1 overflow-y-auto pr-1">
          <button className="w-full text-left p-3 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-xs font-semibold flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="truncate">Tokyo & Kyoto Trip AI</span>
          </button>
          <button className="w-full text-left p-3 rounded-xl glass-panel text-slate-400 hover:text-slate-200 border border-cyan-500/10 text-xs font-medium flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-slate-500 shrink-0" />
            <span className="truncate">Paris Hotel Hacks</span>
          </button>
          <button className="w-full text-left p-3 rounded-xl glass-panel text-slate-400 hover:text-slate-200 border border-cyan-500/10 text-xs font-medium flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-slate-500 shrink-0" />
            <span className="truncate">Bali Flight Savings</span>
          </button>
        </div>

        <div className="pt-2 border-t border-cyan-500/10 text-[10px] text-slate-500 text-center font-mono">
          Model: Obsidian Aurora Neural v3
        </div>
      </div>

      {/* Main Chat Box */}
      <div className="flex-1 glass-card border border-cyan-500/20 flex flex-col justify-between overflow-hidden">
        
        {/* Chat Header */}
        <div className="p-4 glass-panel border-b border-cyan-500/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600">
              <Bot className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                AI Travel Concierge
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              </h2>
              <p className="text-[10px] text-cyan-400 font-mono">Real-time Travel Neural Assistant</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-lg glass-panel text-slate-400 hover:text-cyan-400 border border-cyan-500/10 hover:border-cyan-400/50"
              title="Settings & API Key"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMessages([messages[0]])}
              className="lg:hidden p-2 rounded-lg glass-panel text-slate-400 hover:text-red-400"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-2xl ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.sender === 'user'
                    ? 'bg-purple-500 text-slate-950'
                    : 'bg-cyan-400 text-slate-950'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`p-4 rounded-2xl text-xs space-y-2 border ${
                  msg.sender === 'user'
                    ? 'bg-purple-950/40 border-purple-500/30 text-slate-100'
                    : 'glass-panel border-cyan-500/20 text-slate-200'
                }`}
              >
                <div className="whitespace-pre-line leading-relaxed">{msg.text}</div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-cyan-500/10">
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'ai' && (
                    <button
                      onClick={() => copyMessage(msg.id, msg.text)}
                      className="hover:text-cyan-400 transition-colors flex items-center gap-1"
                    >
                      {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copiedId === msg.id ? 'Copied' : 'Copy'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono animate-pulse">
              <Bot className="w-4 h-4" /> AI is formulating travel recommendations...
            </div>
          )}
        </div>

        {/* Quick Prompts & Input Box */}
        <div className="p-4 glass-panel border-t border-cyan-500/10 space-y-3">
          
          {/* Prompt Chips */}
          <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-none">
            {quickPrompts.map((qp, i) => (
              <button
                key={i}
                onClick={() => handleSend(qp)}
                className="px-3 py-1 rounded-full text-[11px] font-semibold glass-panel border border-cyan-500/20 text-cyan-300 hover:border-cyan-400 shrink-0"
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about destinations, flights, weather, or hotels..."
              className="flex-1 px-4 py-3 rounded-full glass-panel border border-cyan-500/30 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-3 rounded-full btn-primary text-slate-950 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>
      
      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-card p-6 w-full max-w-md border border-cyan-500/30 shadow-2xl relative">
            <button onClick={() => setShowSettings(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-200">✕</button>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
                <Key className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-100">AI Concierge Setup</h3>
            </div>
            
            <p className="text-xs text-slate-300 mb-4">
              TravelMate AI uses Google's official Gemini AI for unparalleled responses. 
              <br/><br/>
              To power this experience, you must provide your own free Gemini API Key. It takes 30 seconds to generate one.
            </p>
            
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs font-bold text-cyan-400 hover:underline mb-4 block"
            >
              Get your free Gemini API Key here →
            </a>
            
            <div className="space-y-2 mb-6">
              <label className="text-xs font-semibold text-slate-400">Your API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-4 py-2.5 rounded-xl glass-panel border border-cyan-500/30 text-xs text-slate-100 focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowSettings(false)} className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-slate-100">
                Cancel
              </button>
              <button onClick={saveApiKey} className="px-5 py-2 rounded-lg btn-primary text-xs font-bold shadow-lg shadow-cyan-500/20">
                Save Key
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
