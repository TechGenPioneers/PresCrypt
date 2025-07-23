"use client";
import Message from "./message";

export default function MessageList({ messages, messagesEndRef }) {
return (
    <div className="p-4 overflow-y-auto h-[calc(100%-130px)] bg-white">
        <div className="flex justify-center mb-4">
            <div className="w-76 h-50 flex items-center justify-center">
                <img 
                    src="/195.jpg" 
                    alt="Chatbot" 
                    className="h-39 w-60 animate-bounce"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgY2xhc3M9ImZlYXRoZXIgZmVhdGhlci11c2VyIj48cGF0aCBkPSJNMjAgMjF2LTJhNCA0IDAgMCAwLTQtNEg4YTQgNCAwIDAgMC00IDR2MiI+PC9wYXRoPjxjaXJjbGUgY3g9IjEyIiBjeT0iNyIgcj0iNCI+PC9jaXJjbGU+PC9zdmc+";
                    }}
                />
            </div>
        </div>

        {messages.map((message, index) => (
            <div
                key={index}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
            >
                <Message message={message} />
            </div>
        ))}
        
        <div ref={messagesEndRef} />
    </div>
);
}