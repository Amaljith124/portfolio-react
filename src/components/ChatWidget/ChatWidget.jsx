import React, { useEffect, useRef, useState } from 'react';
import { Minus, Send, X } from 'lucide-react';
import { sendChatMessage, startChatSession } from '../../webservices/webservices';
import { usePortfolio } from '../../context/PortfolioContext';
import './ChatWidget.scss';

function timeOf(value) {
  return (value ? new Date(value) : new Date()).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function firstNameOf(name) {
  return String(name || '').trim().split(/\s+/)[0];
}

// Byte, the assistant. The chat starts with the visitor's name and email: the session belongs to that email on this portfolio, so coming
// back with the same email continues the same conversation (its earlier messages are loaded). Name and email are then locked for the
// session; "Not you?" ends it on this device. The browser remembers them so a reload goes straight back to the chat.
export default function ChatWidget() {
  const { portfolio, slug } = usePortfolio();
  const storageKey = `byte-chat:${slug}`;
  const ownerName = portfolio.profile.name;
  const intro = (portfolio.assistant && portfolio.assistant.greeting) || `Hi! I'm Byte, the AI assistant on this site. Ask me about ${ownerName}'s experience, projects or services.`;

  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState('intake'); // intake | starting | chat
  const [form, setForm] = useState({ name: '', email: '' });
  const [formError, setFormError] = useState('');
  const [visitor, setVisitor] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const resumeTried = useRef(false);

  const endRef = useRef(null);
  const inputRef = useRef(null);

  function begin(name, email) {
    setPhase('starting');
    setFormError('');
    startChatSession(slug, name, email)
      .then(function (result) {
        const first = firstNameOf(result.visitorName || name);
        const history = (result.messages || []).map(item => ({ role: item.role, text: item.message, time: timeOf(item.createdDate) }));
        const hello = result.resumed
          ? { role: 'assistant', text: `Welcome back, ${first}! Pick up where we left off, or ask me something new.`, time: timeOf() }
          : { role: 'assistant', text: `Hi ${first}! I'm Byte, the AI assistant on this site. Ask me about ${ownerName}'s experience, projects or services, or tell me what you're building.`, time: timeOf() };
        setVisitor({ name: result.visitorName || name, email: result.visitorEmail || email });
        setSessionId(result.sessionId);
        setMessages([...history, hello]);
        localStorage.setItem(`${storageKey}:name`, result.visitorName || name);
        localStorage.setItem(`${storageKey}:email`, result.visitorEmail || email);
        setPhase('chat');
      })
      .catch(function (error) {
        setFormError(error.message || 'Could not start the chat. Please try again.');
        setPhase('intake');
      });
  }

  // the first time the panel opens on a device that already chatted: resume with the remembered name and email
  useEffect(function () {
    if (open && !resumeTried.current) {
      resumeTried.current = true;
      const name = localStorage.getItem(`${storageKey}:name`);
      const email = localStorage.getItem(`${storageKey}:email`);
      if (name && email) {
        setForm({ name: name, email: email });
        begin(name, email);
      } else {
        // a new visitor: the form is shown
      }
    } else {
      // already tried
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(function () {
    if (open && endRef.current) {
      endRef.current.scrollIntoView({ block: 'end', behavior: 'smooth' });
    } else {
      // panel is closed - nothing to scroll
    }
  }, [messages, loading, open, phase]);

  useEffect(function () {
    if (open && phase === 'chat' && inputRef.current) {
      const timer = setTimeout(() => inputRef.current && inputRef.current.focus(), 350);
      return function () {
        clearTimeout(timer);
      };
    } else {
      return undefined;
    }
  }, [open, phase]);

  function submitIntake(event) {
    event.preventDefault();
    const name = form.name.trim();
    const email = form.email.trim();
    if (name && email) {
      begin(name, email);
    } else {
      setFormError('Please enter your name and email.');
    }
  }

  // ends the chat on this device (the conversation itself stays saved under that email)
  function notYou() {
    localStorage.removeItem(`${storageKey}:name`);
    localStorage.removeItem(`${storageKey}:email`);
    setVisitor(null);
    setSessionId(null);
    setMessages([]);
    setForm({ name: '', email: '' });
    setPhase('intake');
  }

  function send(event) {
    event.preventDefault();
    const text = input.trim();
    if (text && !loading && sessionId) {
      setMessages(current => [...current, { role: 'user', text, time: timeOf() }]);
      setInput('');
      setLoading(true);
      sendChatMessage(slug, sessionId, text)
        .then(function (result) {
          setMessages(current => [...current, { role: 'assistant', text: result.reply, time: timeOf() }]);
        })
        .catch(function (error) {
          if (/start the chat again/i.test(error.message || '')) {
            // the session is gone (for example another portfolio's id): back to the form
            notYou();
            setFormError('Please enter your name and email to start again.');
          } else {
            setMessages(current => [...current, { role: 'assistant', text: 'I could not reach the server just now. Please try again or email me directly.', time: timeOf() }]);
          }
        })
        .finally(function () {
          setLoading(false);
        });
    } else {
      setInput(input);
    }
  }

  const tabIndex = open ? 0 : -1;

  return <div className="chat-widget">
    <div className={`chat-panel ${open ? 'is-open' : ''}`} role="dialog" aria-label="Chat with Byte" aria-hidden={!open}>
      <div className="chat-header">
        <img className="chat-header-logo" src="/byte-logo.png" alt="" width="28" height="28" />
        <strong>Byte <small>AI assistant</small></strong>
        <span className="chat-online" title="Online" />
        <button onClick={() => setOpen(false)} aria-label="Minimise chat" tabIndex={tabIndex}><Minus size={16} /></button>
        <button onClick={() => setOpen(false)} aria-label="Close chat" tabIndex={tabIndex}><X size={16} /></button>
      </div>

      {phase !== 'chat' && (
        <form className="chat-intake" onSubmit={submitIntake}>
          <p className="chat-intake-intro">{intro}</p>
          <p className="chat-intake-ask">Before we start, who am I talking to?</p>
          <label>Your name<input value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} maxLength="120" autoComplete="name" required tabIndex={tabIndex} disabled={phase === 'starting'} /></label>
          <label>Your email<input type="email" value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} maxLength="255" autoComplete="email" required tabIndex={tabIndex} disabled={phase === 'starting'} /></label>
          {formError && <p className="chat-intake-error" role="alert">{formError}</p>}
          <button className="button button-primary" type="submit" disabled={phase === 'starting'} tabIndex={tabIndex}>{phase === 'starting' ? 'Starting...' : 'Start chat'}</button>
          <small>Your name and email are saved with this chat so you can continue it later, and are only shared with {ownerName}.</small>
        </form>
      )}

      {phase === 'chat' && (
        <>
          <div className="chat-identity"><span>Chatting as <strong>{visitor.name}</strong> · {visitor.email}</span><button type="button" onClick={notYou} tabIndex={tabIndex}>Not you?</button></div>
          <div className="chat-messages" aria-live="polite">
            {messages.map((message, index) => <div className={`chat-row ${message.role}`} key={`${message.role}-${index}`}>
              {message.role === 'assistant' && <span className="chat-avatar"><img src="/byte-logo.png" alt="Byte" width="22" height="22" /></span>}
              <div className="chat-bubble-wrap"><p className="chat-bubble">{message.text}</p><time>{message.time}</time></div>
            </div>)}
            {loading && <div className="chat-row assistant"><span className="chat-avatar"><img src="/byte-logo.png" alt="Byte" width="22" height="22" /></span><div className="chat-bubble-wrap"><p className="chat-bubble typing"><i /><i /><i /></p></div></div>}
            <div ref={endRef} />
          </div>
          <form className="chat-compose" onSubmit={send}>
            <input ref={inputRef} value={input} onChange={event => setInput(event.target.value)} placeholder="Type a message..." aria-label="Chat message" tabIndex={tabIndex} />
            <button type="submit" disabled={loading || !input.trim()} aria-label="Send message" tabIndex={tabIndex}><Send size={17} /></button>
          </form>
        </>
      )}
    </div>
    <button className={`chat-launcher ${open ? 'is-open' : ''}`} onClick={() => setOpen(!open)} aria-label={open ? 'Close chat' : 'Open chat with Byte'} aria-expanded={open}>
      <span className="launcher-icon"><img className="icon-chat" src="/byte-logo.png" alt="" width="24" height="24" /><X size={22} className="icon-close" /></span>
      <span className="launcher-label">Chat with Byte</span>
    </button>
  </div>;
}
