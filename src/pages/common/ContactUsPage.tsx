import React, { useState } from 'react';
import { useMarketData } from '../../context/MarketDataContext';
import { MockMap } from '../../components/common/MockMap';
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, ShieldCheck, CheckCircle } from 'lucide-react';

export const ContactUsPage: React.FC = () => {
  const { triggerToast } = useMarketData();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [inquiryType, setInquiryType] = useState('shopper');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setSubmitted(true);
    triggerToast('Thank you! Your message has been sent to the MarketLink support team.');
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Header */}
      <div className="text-center space-y-1.5">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text-main)] tracking-tight">
          Contact Us & Operations Center
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          Reach out to the MarketLink regional market coordination team or find our physical pavilion office.
        </p>
      </div>

      {/* 2-Column Split: Static Contact Info & Contact Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Static Team Contact Info (SRS Section 1.6 Requirement) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[var(--color-surface-card)] rounded-3xl p-6 border border-[var(--color-border)] shadow-xs space-y-5">
            <h3 className="text-base font-bold text-[var(--color-text-main)]">
              Central Office Information
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[var(--color-text-main)] block">Headquarters Address</span>
                  <p className="text-slate-500 mt-0.5 leading-relaxed">
                    100 Market Center Way, Suite 400<br />
                    Downtown Fresh Pavilion Plaza, CA 90210
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[var(--color-text-main)] block">Direct Support Lines</span>
                  <p className="text-slate-500 mt-0.5">
                    Toll-Free: (800) 555-FARM<br />
                    Market Desk: (555) 234-8901
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[var(--color-text-main)] block">Electronic Inquiries</span>
                  <p className="text-slate-500 mt-0.5">
                    General: support@marketlink.org<br />
                    Farmer Applications: farmers@marketlink.org
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[var(--color-text-main)] block">Hours of Operation</span>
                  <p className="text-slate-500 mt-0.5">
                    Mon – Fri: 8:00 AM – 6:00 PM<br />
                    Weekend Market Days: 6:30 AM – 3:30 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Contact Inquiry Form */}
        <div className="lg:col-span-7 bg-[var(--color-surface-card)] rounded-3xl p-6 border border-[var(--color-border)] shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--color-text-main)]">
                Send an Inquiry or Feedback
              </h3>
              <p className="text-xs text-slate-500">
                Responses typically dispatched within 2 business hours during market week.
              </p>
            </div>
          </div>

          {submitted && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-500" />
              <span>Your message has been logged and sent to the regional coordinator.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full px-3 py-2 bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl text-xs text-[var(--color-text-main)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sarah@example.com"
                  className="w-full px-3 py-2 bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl text-xs text-[var(--color-text-main)] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Inquiry Category
              </label>
              <select
                value={inquiryType}
                onChange={(e) => setInquiryType(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl text-xs text-[var(--color-text-main)] focus:outline-none"
              >
                <option value="shopper">Customer Pre-Orders & Stall Pickup</option>
                <option value="farmer">Farmer Stall Registration & Verification</option>
                <option value="market">New Farmers Market Partnership</option>
                <option value="other">General Platform Support</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Message Body *
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your inquiry, order question, or feedback..."
                className="w-full px-3 py-2 bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl text-xs text-[var(--color-text-main)] focus:outline-none resize-none"
              />
            </div>

            <div className="pt-2 text-right">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-primary)] hover:opacity-95 text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Inquiry</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Embedded Location Map (SRS Mandatory Requirement: Google Maps showing location) */}
      <div className="bg-[var(--color-surface-card)] rounded-3xl p-6 border border-[var(--color-border)] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[var(--color-primary)]" />
            <h3 className="text-sm font-bold text-[var(--color-text-main)]">
              MarketLink Headquarters Location Map (SRS)
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-slate-400">
            Civic Pavilion Coordinates: 37.7749° N, 122.4194° W
          </span>
        </div>

        <MockMap
          lat={37.7749}
          lng={-122.4194}
          marketName="MarketLink Operations HQ & Pavilion"
          stallName="Administrative Services Building"
          address="100 Market Center Way, Downtown Fresh Pavilion Plaza"
          showDirections={true}
          height="h-72"
        />
      </div>
    </div>
  );
};
