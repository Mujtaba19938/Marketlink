import React, { useState } from 'react';
import { useMarketData } from '../../context/MarketDataContext';
import { MockMap } from '../../components/common/MockMap';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Store,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { triggerToast, sendContactMessage } = useMarketData();
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'order_inquiry',
    message: '',
  });

  // saved to MongoDB (contactmessages) and shown in the admin's Contact Inbox
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      triggerToast('Please complete all required fields.', 'error');
      return;
    }
    setSending(true);
    const ok = await sendContactMessage(form);
    setSending(false);
    if (ok) setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-[#def54d] text-xs font-bold">
          <Phone className="w-3.5 h-3.5" />
          <span>Karachi Customer Operations &amp; Support Hub</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-['Outfit',sans-serif] tracking-tight">
          Get in Touch With MarketLink
        </h1>

        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
          Need assistance tracking a pre-order, finding a vendor stall in DHA or Saddar, or registering as an organic grower? Our Karachi team is available daily from 07:00 AM to 08:00 PM.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Form (Left) */}
        <div className="lg:col-span-7 bg-[#0c1b14] border border-emerald-900/50 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white font-['Outfit',sans-serif]">
              Send Us a Direct Message
            </h2>
            <p className="text-xs text-slate-400">
              Fill out the form below. We typically respond in under 15 minutes.
            </p>
          </div>

          {submitted ? (
            <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-2xl p-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-[#22c55e] mx-auto" />
              <h3 className="text-lg font-bold text-white">Thank You, {form.name}!</h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Your message regarding "{form.subject.replace('_', ' ')}" has been saved and our team will reply to {form.email}.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setForm({ name: '', email: '', phone: '', subject: 'order_inquiry', message: '' });
                }}
                className="mt-2 px-4 py-2 bg-[#22c55e] text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold block">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Asad Siddiqui"
                    className="w-full px-4 py-2.5 bg-[#07130e] border border-emerald-900/60 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold block">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="e.g. asad@gmail.com"
                    className="w-full px-4 py-2.5 bg-[#07130e] border border-emerald-900/60 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold block">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="e.g. 0300-1234567"
                    className="w-full px-4 py-2.5 bg-[#07130e] border border-emerald-900/60 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold block">Inquiry Category *</label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#07130e] border border-emerald-900/60 rounded-xl text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="order_inquiry">Pre-Order Status &amp; Tracking</option>
                    <option value="stall_navigation">Market Stall Location Guide</option>
                    <option value="farmer_onboarding">Grower / Farmer Registration</option>
                    <option value="quality_feedback">Produce Quality Feedback</option>
                    <option value="general">Other General Inquiries</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold block">Your Message *</label>
                <textarea
                  rows={4}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Describe your inquiry or order details..."
                  className="w-full px-4 py-2.5 bg-[#07130e] border border-emerald-900/60 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="disabled:opacity-50 w-full py-3 bg-[#22c55e] hover:bg-emerald-600 text-white rounded-xl font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-500/25 active:scale-98"
              >
                <Send className="w-4 h-4" />
                <span>{sending ? 'Sending…' : 'Submit Inquiry'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Karachi HQ Info & Details (Right) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0c1b14] border border-emerald-900/50 rounded-3xl p-6 space-y-5">
            <h3 className="text-base font-bold text-white font-['Outfit',sans-serif] flex items-center gap-2">
              <Store className="w-4 h-4 text-[#22c55e]" />
              <span>Karachi Operations Headquarters</span>
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-white block">Main Office &amp; Pavilion Center</strong>
                  <span className="text-slate-400">Khayaban-e-Shahbaz, Phase 6, DHA, Karachi, Pakistan</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-white block">Direct Telephone Hotline</strong>
                  <span className="text-slate-400 font-mono">(021) 3584-8901 / 0300-8291044</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-white block">Official Support Email</strong>
                  <span className="text-slate-400">support@marketlink.org / orders@marketlink.org</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-white block">Operating Schedule</strong>
                  <span className="text-slate-400">Monday - Sunday: 07:00 AM - 08:00 PM PKT</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mini Interactive Map Pinpoint of Karachi HQ */}
          <div className="bg-[#0c1b14] border border-emerald-900/50 rounded-3xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs px-2">
              <span className="font-bold text-white flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#def54d]" />
                <span>Karachi HQ Location</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">24.8015° N, 67.0682° E</span>
            </div>

            <div className="rounded-2xl overflow-hidden border border-emerald-950">
              <MockMap
                lat={24.8015}
                lng={67.0682}
                marketName="MarketLink Operations HQ"
                address="Khayaban-e-Shahbaz, Phase 6, DHA, Karachi"
                height="h-56"
                showDirections={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
