import React, { useEffect, useState } from 'react';
import { ArrowUpRight, CheckCircle2, Mail } from 'lucide-react';
import { submitEnquiry } from '../../webservices/webservices';
import SectionHeading from '../SectionHeading/SectionHeading';
import { PREFILL_EVENT } from '../Services/Services';
import './Contact.scss';

const initialForm = { name: '', email: '', company: '', enquiryType: 'freelance', serviceType: 'backend-development', projectDescription: '', budget: '', timeline: '' };

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  useEffect(function () {
    function onPrefill(event) {
      setForm(current => ({ ...current, enquiryType: 'freelance', serviceType: event.detail }));
    }
    window.addEventListener(PREFILL_EVENT, onPrefill);
    return function () {
      window.removeEventListener(PREFILL_EVENT, onPrefill);
    };
  }, []);

  function update(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function submit(event) {
    event.preventDefault();
    setStatus('loading');
    setMessage('');
    submitEnquiry(form)
      .then(function () {
        setStatus('success');
        setMessage("Thanks. Your enquiry has been received and I'll reply by email.");
        setForm(initialForm);
      })
      .catch(function (error) {
        setStatus('error');
        setMessage(error.message || 'Could not submit your enquiry. Please try again.');
      });
  }

  return <section className="contact-section section-wrap" id="contact">
    <div className="contact-intro"><SectionHeading eyebrow="Get in touch" title={<>Have something<br /><span>in mind?</span></>} description="Tell me a little about what you're building. I'll get back to you by email." /><a className="contact-email" href="mailto:amaljithanaswar@gmail.com"><Mail size={17} /> amaljithanaswar@gmail.com <ArrowUpRight size={15} /></a></div>
    <form className="contact-form" onSubmit={submit}>
      <div className="form-row"><label>Your name<input name="name" value={form.name} onChange={update} required maxLength="120" placeholder="Jane Doe" /></label><label>Email address<input type="email" name="email" value={form.email} onChange={update} required maxLength="255" placeholder="jane@company.com" /></label></div>
      <div className="form-row"><label>Company (optional)<input name="company" value={form.company} onChange={update} maxLength="160" placeholder="Company name" /></label><label>I'm reaching out about<select name="enquiryType" value={form.enquiryType} onChange={update}><option value="freelance">Freelance project</option><option value="career">Career opportunity</option><option value="other">Something else</option></select></label></div>
      <div className="form-row"><label>Service<select name="serviceType" value={form.serviceType} onChange={update}><option value="backend-development">Backend development</option><option value="ai-integration">AI integration</option><option value="api-integrations">API integrations</option><option value="database-development">Database development</option><option value="full-stack-development">Full-stack development</option><option value="other">Other</option></select></label><label>Budget (optional)<select name="budget" value={form.budget} onChange={update}><option value="">Not decided</option><option value="under-50000">Under ₹50,000</option><option value="50000-100000">₹50,000–₹1,00,000</option><option value="100000-300000">₹1,00,000–₹3,00,000</option><option value="above-300000">Above ₹3,00,000</option></select></label></div>
      <label>Tell me about the project<textarea name="projectDescription" value={form.projectDescription} onChange={update} required maxLength="5000" rows="5" placeholder="A little context about the problem, what you need and any timeline..." /></label>
      <label>Expected timeline (optional)<select name="timeline" value={form.timeline} onChange={update}><option value="">Flexible / not sure</option><option value="asap">As soon as possible</option><option value="2-4-weeks">2–4 weeks</option><option value="1-2-months">1–2 months</option><option value="3-plus-months">3+ months</option></select></label>
      <button className="button button-primary" type="submit" disabled={status === 'loading'}>{status === 'loading' ? 'Sending...' : 'Send enquiry'} <ArrowUpRight size={16} /></button>
      {message && <p className={`form-message ${status}`}>{status === 'success' && <CheckCircle2 size={16} />}{message}</p>}
    </form>
  </section>;
}
