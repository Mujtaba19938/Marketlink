import React, { useState } from 'react';
import { useAppRouter } from '../../routes/RouterContext';
import {
  ShieldCheck,
  Leaf,
  Truck,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Store,
  CheckCircle2,
  DollarSign,
  Heart,
  ArrowRight,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigateWebsite } = useAppRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const workflowSteps = [
    {
      step: '01',
      title: 'Farmer Morning Picking (5:00 AM)',
      desc: 'Growers harvest vegetables and fruits directly from orchards and greenhouses at dawn upon receiving batch reservations.',
    },
    {
      step: '02',
      title: 'Quality & Weight Inspection',
      desc: 'Stall staff inspects for firmness, crispness, and zero chemical preservatives before weighing and packing in eco-pouches.',
    },
    {
      step: '03',
      title: 'Arrival at Karachi Pavilion',
      desc: 'Batches arrive directly at our Karachi market stalls (DHA Phase 6, Empress Market, Gulshan, Hydri, Malir) by 7:30 AM.',
    },
    {
      step: '04',
      title: 'Express Curbside Staging (Gate 2)',
      desc: 'Pre-ordered customer bags are labeled with unique order numbers and held at the designated fast-track pickup counter.',
    },
    {
      step: '05',
      title: 'Doorstep Courier Dispatch',
      desc: 'For home delivery orders, dedicated couriers receive temperature-controlled produce bags and route straight to your address.',
    },
    {
      step: '06',
      title: 'QR Code Handover & Feedback',
      desc: 'Verify produce freshness with the driver or stall desk. Confirm handover via QR code and rate your grower.',
    },
  ];

  const faqs = [
    {
      q: 'How does MarketLink guarantee produce freshness?',
      a: 'Unlike traditional supermarket produce that spends 4 to 7 days in transit and cold storages, MarketLink produce is harvested by farmers on the morning of market day, arriving directly at stalls within 3 hours.',
    },
    {
      q: 'Where are your Karachi pickup stalls located?',
      a: 'We operate across 5 primary Karachi districts: DHA Phase 6 (Khayaban-e-Shahbaz), Empress Market Saddar, Gulshan-e-Iqbal (Hassan Square), Hydri North Nazimabad (Block H), and Malir Cantonment. Each market features designated Gate 2 customer parking.',
    },
    {
      q: 'Are there any hidden service or payment fees?',
      a: 'None! We operate on a fair-trade, zero-markup model. You pay the exact same price as shopping directly at the farm gate.',
    },
    {
      q: 'Can I pay with Cash on Delivery or Card?',
      a: 'Yes! We support convenient Cash on Delivery, wireless Card on Delivery, mobile wallet transfers, as well as pay-at-stall pickup counters.',
    },
    {
      q: 'What if an item does not meet my quality standards?',
      a: 'We offer an unconditional instant refund or replacement guarantee. If any vegetable or fruit is bruised or unsatisfactory, simply notify us in your dashboard for an immediate resolution.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-[#def54d] text-xs font-bold">
          <Leaf className="w-3.5 h-3.5" />
          <span>Our Story &amp; Workflow Standard</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-['Outfit',sans-serif] tracking-tight">
          Pioneering Fair-Trade Farm Direct in Karachi
        </h1>

        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
          MarketLink was built to eliminate predatory wholesale intermediaries, empowering verified Sindh farmers with direct retail pricing while ensuring Karachi families receive nutrient-rich, dawn-harvested produce.
        </p>
      </div>

      {/* 3 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0c1b14] border border-emerald-900/50 p-8 rounded-3xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Heart className="w-6 h-6 text-[#22c55e]" />
          </div>
          <h3 className="text-lg font-bold text-white font-['Outfit',sans-serif]">
            Direct Farmer Empowerment
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            100% of purchase proceeds flow straight to grower accounts. Farmers receive transparent weekly settlements without arbitrary wholesale cuts.
          </p>
        </div>

        <div className="bg-[#0c1b14] border border-emerald-900/50 p-8 rounded-3xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-[#22c55e]" />
          </div>
          <h3 className="text-lg font-bold text-white font-['Outfit',sans-serif]">
            Bio-Organic Certification
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            All partner farms undergo regular soil and chemical lab inspections. Zero synthetic hormones, ripening gases, or toxic pest sprays.
          </p>
        </div>

        <div className="bg-[#0c1b14] border border-emerald-900/50 p-8 rounded-3xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Truck className="w-6 h-6 text-[#22c55e]" />
          </div>
          <h3 className="text-lg font-bold text-white font-['Outfit',sans-serif]">
            6-Stage Transparent Logistics
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            From the morning tree clipping to the final QR delivery sign-off, every stage of your order is tracked live with driver GPS and courier phone numbers.
          </p>
        </div>
      </div>

      {/* 6-Stage Workflow Grid */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-[#def54d] uppercase tracking-wider">
            Operational Excellence
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-['Outfit',sans-serif]">
            Our 6-Stage Farm-to-Table Journey
          </h2>
          <p className="text-xs text-slate-400">
            How your pre-order moves from the soil of Sindh to your Karachi kitchen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflowSteps.map((step) => (
            <div
              key={step.step}
              className="bg-[#0c1b14] border border-emerald-900/40 p-6 rounded-3xl space-y-3 relative overflow-hidden"
            >
              <span className="text-4xl font-black text-emerald-900/30 absolute right-4 top-4 font-['Outfit',sans-serif]">
                {step.step}
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 font-extrabold text-xs flex items-center justify-center">
                {step.step}
              </div>
              <h4 className="font-bold text-white text-sm font-['Outfit',sans-serif]">{step.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="space-y-6 max-w-3xl mx-auto pt-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-[#def54d] uppercase tracking-wider">Common Inquiries</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-['Outfit',sans-serif]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={faq.q}
                className="bg-[#0c1b14] border border-emerald-900/50 rounded-2xl overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-bold text-white text-xs sm:text-sm hover:text-emerald-400 transition cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-emerald-950/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Ready to Order Banner */}
      <div className="bg-gradient-to-r from-[#0c2217] via-[#0f2d1e] to-[#07130e] border border-emerald-500/30 rounded-3xl p-8 sm:p-10 text-center space-y-4 shadow-xl">
        <h3 className="text-2xl sm:text-3xl font-black text-white font-['Outfit',sans-serif]">
          Taste the Difference of True Dawn Harvest
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
          Explore today's fresh catalog and pre-order for fast stall pickup or express doorstep delivery.
        </p>
        <button
          type="button"
          onClick={() => navigateWebsite('shop')}
          className="px-6 py-3 bg-[#22c55e] hover:bg-emerald-600 text-white rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-lg flex items-center gap-2 cursor-pointer active:scale-95 mx-auto"
        >
          <span>Explore Fresh Produce Shop</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
