import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, User, Cpu } from "lucide-react";
import { chatbotResponses, chatbotKeywords } from "./ChatbotReponses";

export default function Chat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: "user" | "bot"; text: string; id: number }[]>([]);
  const [input, setInput] = useState("");
  const [messageId, setMessageId] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isTyping]);

  const detectCategory = (text: string): string => {
    const lower = text.toLowerCase();
    for (const category in chatbotKeywords) {
      if (chatbotKeywords[category].some(keyword => lower.includes(keyword))) {
        return category;
      }
    }
    return "default";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user" as const, text: input, id: messageId };
    setMessageId(prev => prev + 1);
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    setIsTyping(true);
    setTimeout(() => {
      const category = detectCategory(input);
      const botText = chatbotResponses[category] || chatbotResponses.default;
      const botMsg = { sender: "bot" as const, text: botText, id: messageId + 1 };
      setMessageId(prev => prev + 1);
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Bouton Chat flottant */}
      <button
        className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MessageCircle className="w-7 h-7" />
      </button>

      {/* Boîte de chat */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-96 h-[480px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 transform transition-all duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-3 flex justify-between items-center rounded-t-2xl">
            <span className="font-bold text-lg">PrintMG Assistant</span>
            <button onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "bot" && <Cpu className="w-6 h-6 text-purple-600" />}
                {msg.sender === "user" && <User className="w-6 h-6 text-blue-500" />}
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-2xl break-words
                    ${msg.sender === "user" ? "bg-blue-500 text-white rounded-br-none" : "bg-gradient-to-r from-purple-200 to-pink-200 text-gray-900 rounded-bl-none"}
                  `}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-start gap-3">
                <Cpu className="w-6 h-6 text-purple-600 animate-bounce" />
                <div className="max-w-[40%] px-4 py-2 rounded-2xl bg-purple-100 text-gray-600 italic animate-pulse">
                  ... Écris un message
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t flex gap-2 bg-white">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Écrire un message..."
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full hover:scale-105 transition-transform shadow-md"
            >
              Envoyer
            </button>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease forwards;
          }
        `}
      </style>
    </div>
  );
}
