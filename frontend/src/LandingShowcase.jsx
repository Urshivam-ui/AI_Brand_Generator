import React, { useState } from 'react';
import { 
  Sparkles, 
  Palette, 
  Layout, 
  Share2, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight, 
  Plus, 
  Layers, 
  Download, 
  Clock, 
  Zap, 
  Award,
  ChevronRight,
  Code
} from 'lucide-react';

export default function Dashboard({ user, onNavigateToGenerator }) {
  const userName = user?.name || 'Creator';

  // State for active feature showcase tab
  const [activeTab, setActiveTab] = useState('brandkit');

  // Real-world Feature Use Cases Data (SaaS & Tech Startup Example)
  const useCases = {
    brandkit: {
      title: "AI Brand Identity Generator",
      badge: "Save 10+ Hours & $500 Design Fees",
      description: "Generates custom logos, professional color palettes, font pairings, and taglines tailored to your company.",
      benefit: "Launch a full tech brand identity in 60 seconds without hiring expensive agencies.",
      demoContent: (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white text-lg shadow-md">
              N
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-wide">Nexus Analytics AI</h4>
              <p className="text-[11px] text-cyan-400">Next-Gen Data Intelligence</p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <div className="h-10 rounded-lg bg-[#06B6D4] flex items-center justify-center text-[10px] font-mono text-slate-950 font-bold">#06B6D4</div>
            <div className="h-10 rounded-lg bg-[#3B82F6] flex items-center justify-center text-[10px] font-mono text-white">#3B82F6</div>
            <div className="h-10 rounded-lg bg-[#0F172A] flex items-center justify-center text-[10px] font-mono text-slate-300">#0F172A</div>
            <div className="h-10 rounded-lg bg-[#F8FAFC] flex items-center justify-center text-[10px] font-mono text-slate-800">#F8FAFC</div>
          </div>
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800/80 text-xs text-slate-300">
            <span className="text-cyan-400 font-semibold">AI Tagline:</span> "Transforming Raw Data into Actionable Intelligence."
          </div>
        </div>
      )
    },
    storefront: {
      title: "Live Landing Page & SaaS Preview",
      badge: "3x Higher Conversion Rate",
      description: "Displays your generated brand on a live, high-converting product landing page with call-to-action sections.",
      benefit: "Test and pitch your startup idea instantly before writing a single line of frontend code.",
      demoContent: (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-white">SaaS Landing Page Preview</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">Live UI</span>
          </div>
          <div className="p-3 bg-slate-900 rounded-xl space-y-2 border border-slate-800">
            <div className="flex justify-between items-center">
              <h5 className="text-xs font-bold text-white">Nexus Enterprise Pro</h5>
              <span className="text-xs font-extrabold text-cyan-400">$49/mo</span>
            </div>
            <p className="text-[10px] text-slate-400">Automated SQL reporting & real-time dashboard tracking for teams.</p>
            <button className="w-full py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-[11px] shadow">
              Start Free 14-Day Trial
            </button>
          </div>
        </div>
      )
    },
    socialKit: {
      title: "Social Marketing & Ad Generator",
      badge: "Automate Campaign Designs",
      description: "Auto-applies your brand colors and typography onto social banners, feature flyers, and ad templates.",
      benefit: "Create campaign graphics instantly without needing Canva or Photoshop skills.",
      demoContent: (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">Product Launch Banner</span>
            <span className="text-[10px] text-slate-400">1200 x 630 px</span>
          </div>
          <div className="h-28 rounded-xl bg-gradient-to-r from-slate-900 via-cyan-950 to-blue-950 border border-cyan-500/30 p-3 flex flex-col justify-between">
            <span className="text-[10px] font-bold tracking-widest text-cyan-400 uppercase">Version 2.0 Live</span>
            <div>
              <p className="text-sm font-extrabold text-white">Build AI Dashboards in Minutes</p>
              <p className="text-[10px] text-slate-300">Join over 10,000+ data analysts today.</p>
            </div>
          </div>
        </div>
      )
    },
    exportKit: {
      title: "Developer & Print Asset Exporter",
      badge: "Production Ready",
      description: "Download high-resolution PNG logos, Tailwind CSS configuration snippets, and brand guideline PDFs.",
      benefit: "Directly hand off design tokens and code configs to your engineering team.",
      demoContent: (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-slate-300 font-mono">tailwind.config.js</span>
            <span className="text-xs text-emerald-400 font-bold">Ready</span>
          </div>
          <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-slate-300 font-mono">Brand-Assets-HD.zip</span>
            <span className="text-xs text-cyan-400 font-bold">14.2 MB</span>
          </div>
        </div>
      )
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-6 lg:p-8 space-y-10">
      
      {/* 1. WELCOME HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-6 sm:p-10">
        
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <Sparkles size={14} />
            <span>AI Brand Studio v2.0 Dashboard</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Welcome back, <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">{userName}</span>!
          </h1>
          
          <p className="text-sm text-slate-300 leading-relaxed">
            Create high-converting brand identities, landing page previews, and social media kits in under 60 seconds. Everything you build is ready to export and deploy.
          </p>

          <div className="pt-2 flex flex-wrap gap-4 items-center">
            <button 
              onClick={onNavigateToGenerator}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/25 transition flex items-center gap-2 cursor-pointer"
            >
              <Plus size={18} />
              <span>Create New Brand Kit</span>
            </button>
            
            <a 
              href="#use-cases"
              className="px-5 py-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-semibold text-sm transition flex items-center gap-2"
            >
              <span>Explore Features & Benefits</span>
              <ChevronRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* 2. STATS & BENEFITS OVERVIEW */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <Clock size={20} />
          </div>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Time Saved</p>
          <p className="text-2xl font-black text-white">95% Faster</p>
          <p className="text-[11px] text-emerald-400 font-medium">From days to under 1 minute</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <TrendingUp size={20} />
          </div>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Cost Efficiency</p>
          <p className="text-2xl font-black text-white">Save $500+</p>
          <p className="text-[11px] text-slate-400">No agency retainers needed</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <Layers size={20} />
          </div>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Asset Output</p>
          <p className="text-2xl font-black text-white">All-In-One Kit</p>
          <p className="text-[11px] text-purple-400 font-medium">Logos, Colors, Web & Social</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center">
            <Award size={20} />
          </div>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Conversion Boost</p>
          <p className="text-2xl font-black text-white">3x Sales Impact</p>
          <p className="text-[11px] text-slate-400">High trust factor design</p>
        </div>

      </section>

      {/* 3. INTERACTIVE FEATURE USE-CASE SHOWCASE */}
      <section id="use-cases" className="space-y-6">
        
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            See What You Can Build & Achieve
          </h2>
          <p className="text-xs text-slate-400">
            Click through each feature below to explore how Brand Studio transforms your business assets.
          </p>
        </div>

        {/* Feature Selector Tabs */}
        <div className="flex flex-wrap justify-center gap-2">
          {[
            { id: 'brandkit', label: 'Brand Identity', icon: Palette },
            { id: 'storefront', label: 'Landing Page Preview', icon: Layout },
            { id: 'socialKit', label: 'Social Media Banners', icon: Share2 },
            { id: 'exportKit', label: 'Export Code & Assets', icon: Code }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Feature Use Case Preview Card */}
        <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center shadow-2xl">
          
          {/* Left Info Column */}
          <div className="md:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold">
              <Zap size={13} />
              <span>{useCases[activeTab].badge}</span>
            </div>

            <h3 className="text-xl font-extrabold text-white">
              {useCases[activeTab].title}
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              {useCases[activeTab].description}
            </p>

            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 flex items-start gap-3">
              <CheckCircle2 size={18} className="text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-white">Real Business Benefit:</p>
                <p className="text-[11px] text-slate-400">{useCases[activeTab].benefit}</p>
              </div>
            </div>

            <button 
              onClick={onNavigateToGenerator}
              className="pt-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition cursor-pointer"
            >
              <span>Try this feature now</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Right Live Visual Demo Column */}
          <div className="md:col-span-5">
            {useCases[activeTab].demoContent}
          </div>

        </div>

      </section>

      {/* 4. RECENT BRANDS / QUICK START SECTION */}
      <section className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-bold text-white">Ready to create your brand?</h3>
            <p className="text-xs text-slate-400">Generate your customized assets in less than a minute.</p>
          </div>
          
          <button 
            onClick={onNavigateToGenerator}
            className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/20"
          >
            <Sparkles size={16} />
            <span>Start AI Generator</span>
          </button>
        </div>
      </section>

    </div>
  );
}