import React, { useEffect, useRef, useState } from 'react';
import { MessageCircle, Minus, Send, X } from 'lucide-react';
import { sendChatMessage } from '../../webservices/webservices';
import './ChatWidget.scss';

function timeNow() {
  return new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState(function () {
    return [{ role: 'assistant', text: 'Hi! How can I help you? I can tell you about my experience, projects or services.', time: timeNow() }];
  });

  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(function () {
    if (open && endRef.current) {
      endRef.current.scrollIntoView({ block: 'end', behavior: 'smooth' });
    } else {
      // panel is closed - nothing to scroll
    }
  }, [messages, loading, open]);

  useEffect(function () {
    if (open && inputRef.current) {
      const timer = setTimeout(() => inputRef.current && inputRef.current.focus(), 350);
      return function () {
        clearTimeout(timer);
      };
    } else {
      return undefined;
    }
  }, [open]);

  function send(event) {
    event.preventDefault();
    const text = input.trim();
    if (text && !loading) {
      setMessages(current => [...current, { role: 'user', text, time: timeNow() }]);
      setInput('');
      setLoading(true);
      sendChatMessage(sessionId, text)
        .then(function (result) {
          setSessionId(result.sessionId);
          setMessages(current => [...current, { role: 'assistant', text: result.reply, time: timeNow() }]);
        })
        .catch(function () {
          setMessages(current => [...current, { role: 'assistant', text: 'I could not reach the server just now. Please try again or email me directly.', time: timeNow() }]);
        })
        .finally(function () {
          setLoading(false);
        });
    } else {
      setInput(input);
    }
  }

  return <div className="chat-widget">
    <div className={`chat-panel ${open ? 'is-open' : ''}`} role="dialog" aria-label="Chat with me" aria-hidden={!open}>
      <div className="chat-header">
        <span className="chat-online" />
        <strong>Chat with me</strong>
        <button onClick={() => setOpen(false)} aria-label="Minimise chat" tabIndex={open ? 0 : -1}><Minus size={16} /></button>
        <button onClick={() => setOpen(false)} aria-label="Close chat" tabIndex={open ? 0 : -1}><X size={16} /></button>
      </div>
      <div className="chat-messages" aria-live="polite">
        {messages.map((message, index) => <div className={`chat-row ${message.role}`} key={`${message.role}-${index}`}>
          {message.role === 'assistant' && <span className="chat-avatar">AA</span>}
          <div className="chat-bubble-wrap"><p className="chat-bubble">{message.text}</p><time>{message.time}</time></div>
        </div>)}
        {loading && <div className="chat-row assistant"><span className="chat-avatar">AA</span><div className="chat-bubble-wrap"><p className="chat-bubble typing"><i /><i /><i /></p></div></div>}
        <div ref={endRef} />
      </div>
      <form className="chat-compose" onSubmit={send}>
        <input ref={inputRef} value={input} onChange={event => setInput(event.target.value)} placeholder="Type a message..." aria-label="Chat message" tabIndex={open ? 0 : -1} />
        <button type="submit" disabled={loading || !input.trim()} aria-label="Send message" tabIndex={open ? 0 : -1}><Send size={17} /></button>
      </form>
    </div>
    <button className={`chat-launcher ${open ? 'is-open' : ''}`} onClick={() => setOpen(!open)} aria-label={open ? 'Close chat' : 'Open chat'} aria-expanded={open}>
      <span className="launcher-icon"><MessageCircle size={22} className="icon-chat" /><X size={22} className="icon-close" /></span>
      <span className="launcher-label">Chat with me</span>
    </button>
  </div>;
}
