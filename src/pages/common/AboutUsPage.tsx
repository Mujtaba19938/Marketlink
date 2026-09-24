import React from 'react';
import { Sprout, Users, Award, Heart, ShieldCheck, MapPin, Store, Leaf } from 'lucide-react';

export const AboutUsPage: React.FC = () => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto py-2">
      {/* Hero Mission Section */}
      <div className="relative overflow-hidden rounded-3xl bg-[var(--color-primary)] text-white p-8 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold">
            <Leaf className="w-3.5 h-3.5" />
            <span>Theme: eGreen Basket • Aptech TechWiz 7</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            About MarketLink
          </h2>
          <p className="text-sm sm:text-base text-white/90 leading-relaxed font-medium">
            Bridging the gap between local organic growers and community shoppers. We empower farmers to forecast harvests, pre-sell seasonal crops, and eliminate food waste while making market day predictable and effortless.
          </p>
        </div>

        {/* Decorative blur backdrop */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Core Platform Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-[var(--color-surface-card)] p-6 rounded-3xl border border-[var(--color-border)] shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center">
            <Sprout className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[var(--color-text-main)]">
            Farm-to-Stall Transparency
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Every product listed on MarketLink is harvested directly from certified regional farms. Shoppers know exactly who grew their food and when it was picked.
          </p>
        </div>

        <div className="bg-[var(--color-surface-card)] p-6 rounded-3xl border border-[var(--color-border)] shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[var(--color-text-main)]">
            Zero Waste Pre-Orders
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            By allowing customers to pre-order against weekly stall quotas, farmers harvest only what is spoken for, cutting spoilage and guaranteeing produce freshness.
          </p>
        </div>

        <div className="bg-[var(--color-surface-card)] p-6 rounded-3xl border border-[var(--color-border)] shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[var(--color-text-main)]">
            Community Food Sovereignty
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Retaining 100% of dollars in the local regional economy by connecting consumers directly to independent family stalls without middleman fees.
          </p>
        </div>
      </div>

      {/* Project & Development Team Section (SRS Section 1.6 Requirement) */}
      <div className="bg-[var(--color-surface-card)] rounded-3xl p-6 sm:p-8 border border-[var(--color-border)] shadow-xs space-y-6">
        <div>
          <h3 className="text-lg font-bold text-[var(--color-text-main)]">
            Platform Development Team & Governance
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Engineered in compliance with Software Requirements Specification Version 1.0 (Aptech TechWiz 7 eGreen Basket).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'Lead Architect', role: 'Full-Stack Architecture & Security', avatar: 'LA' },
            { name: 'UI/UX Specialist', role: 'Accessible Theming & Visual Design', avatar: 'UX' },
            { name: 'Backend Engineer', role: 'Database Entities & Telemetry Logic', avatar: 'BE' },
            { name: 'QA & Compliance', role: 'SRS Requirements & Test Validation', avatar: 'QA' },
          ].map((member, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-[var(--color-surface-muted)] border border-[var(--color-border)] text-center space-y-2"
            >
              <div className="w-12 h-12 rounded-full bg-[var(--color-primary)] text-white font-black text-sm flex items-center justify-center mx-auto shadow-sm">
                {member.avatar}
              </div>
              <div>
                <h4 className="text-xs font-bold text-[var(--color-text-main)]">{member.name}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
