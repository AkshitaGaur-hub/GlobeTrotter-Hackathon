import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi there! I'm your GlobeTrotter AI assistant. How can I help you plan your perfect trip today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Add user message
    const newMsg = { id: Date.now(), text: input, sender: 'user' };
    const userText = input.toLowerCase();
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    
    // Mock bot response logic
    setTimeout(() => {
      let botResponse = "I'm a demo assistant! Since this is a hackathon MVP, I'm still learning, but I'll make sure to note that down for your travels!";
      
      // Keyword matching for Taj Mahal ticket prices
      if (userText.includes('taj') && (userText.includes('ticket') || userText.includes('price') || userText.includes('cost') || userText.includes('fee'))) {
        botResponse = "The ticket price for the Taj Mahal is ₹50 for Indian citizens and ₹1,100 for foreign tourists. There is an additional optional ₹200 fee if you wish to enter the main mausoleum. Children under 15 years enter free!";
      } else if (userText.includes('hi') || userText.includes('hello')) {
        botResponse = "Hello! Where are you planning to travel next?";
      }

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot'
      }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-96 transition-all duration-300 transform origin-bottom-right animate-in fade-in zoom-in-95">
          {/* Header */}
          <div className="bg-emerald-600 text-white px-4 py-3 flex justify-between items-center shadow-sm z-10">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-emerald-100" />
              <span className="font-bold text-sm">Travel Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-emerald-100 hover:text-white transition-colors bg-emerald-700/50 hover:bg-emerald-700 rounded-full p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50 dark:bg-slate-800/50 space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-sm shadow-md' 
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-sm shadow-sm border border-slate-100 dark:border-slate-700'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input */}
          <form onSubmit={handleSend} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type your message..." 
              className="flex-1 bg-slate-100 dark:bg-slate-800 border-transparent rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 dark:text-white transition-all"
            />
            <button type="submit" disabled={!input.trim()} className="bg-emerald-600 text-white p-2 rounded-full hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
      
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-full shadow-xl shadow-emerald-600/30 transition-transform hover:scale-105 flex items-center justify-center animate-bounce"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}

