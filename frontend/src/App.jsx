import React, { useState, useEffect } from 'react';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { 
  Palette, 
  Sparkles, 
  Layout, 
  MessageSquare, 
  Image as ImageIcon, 
  Copy, 
  Check, 
  Download, 
  RefreshCw, 
  Type, 
  Archive, 
  Share2,
  LogIn,
  LogOut,
  User,
  Edit3,
  Save,
  Upload,
  CheckCircle,
  Send,
  Wand2
} from 'lucide-react';

import SocialCards from './SocialCards';
import AuthModal from './AuthModal';
import LandingShowcase from './LandingShowcase';

// Fetch Google Client ID from environment variables or fallback
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "445908655127-asmnac05n7923s3e936qald957tq9cdb.apps.googleusercontent.com";
const LOCAL_STORAGE_KEY = 'brand_studio_ai_data';

export default function App() {
  // Single Prompt State replacing the old structured multi-field form
  const [prompt, setPrompt] = useState('');

  // Editable user/business contact details state
  const [customDetails, setCustomDetails] = useState({
    phone: '+1 (555) 019-2834',
    email: 'contact@mybusiness.com',
    address: '101 Main Street, Suite 400',
    ownerName: 'Alex Morgan',
    openingDate: 'Saturday, Next Month 15th',
  });

  const [loading, setLoading] = useState(false);
  const [regeneratingLogo, setRegeneratingLogo] = useState(false);
  const [exportingZip, setExportingZip] = useState(false);
  const [brandKit, setBrandKit] = useState(null);
  const [activeTab, setActiveTab] = useState('brand');
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [saveStatus, setSaveStatus] = useState('');

  // AUTH STATE: Starts as null so guests see Landing Showcase first
  const [user, setUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // ---------------------------------------------------------
  // LOCAL STORAGE & DATA IMPORT/EXPORT HANDLERS
  // ---------------------------------------------------------

  // Load saved local data on initial render
  useEffect(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.brandKit) setBrandKit(parsed.brandKit);
        if (parsed.prompt) setPrompt(parsed.prompt);
        if (parsed.customDetails) setCustomDetails(parsed.customDetails);
      } catch (err) {
        console.error('Error parsing stored local brand data:', err);
      }
    }
  }, []);

  // Save active brand state directly to user's Local Storage
  const handleSaveToLocalStorage = () => {
    if (!brandKit) return;
    const dataToSave = { prompt, customDetails, brandKit };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
    setSaveStatus('Saved locally!');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  // Export brand kit as a downloadable .json file on user system
  const handleExportJSON = () => {
    if (!brandKit) return;
    const exportData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      prompt,
      customDetails,
      brandKit
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${(brandKit.businessName || 'brand').toLowerCase().replace(/\s+/g, '-')}-kit.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import brand kit directly from user's local JSON file
  const handleImportJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.readAsText(file, "UTF-8");
    fileReader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        if (importedData.brandKit) {
          setBrandKit(importedData.brandKit);
          if (importedData.prompt) setPrompt(importedData.prompt);
          if (importedData.customDetails) setCustomDetails(importedData.customDetails);
          
          // Sync with Local Storage
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(importedData));
          alert("Brand Kit restored and saved to your local browser successfully!");
        } else {
          alert("Invalid Brand Kit JSON format.");
        }
      } catch (err) {
        alert("Error reading local JSON file.");
      }
    };
  };

  // ---------------------------------------------------------
  // CORE API & UTILITY HANDLERS
  // ---------------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setBrandKit(null);

    try {
      const response = await axios.post('http://localhost:5001/api/generate-brand', { prompt });
      if (response.data.success) {
        const generatedData = response.data.data;
        setBrandKit(generatedData);

        // Auto-fill custom fields with clean defaults tailored to the generated business name
        const cleanSlug = (generatedData.businessName || 'business').toLowerCase().replace(/\s+/g, '');
        const updatedDetails = {
          phone: '+1 (555) 019-2834',
          email: `contact@${cleanSlug || 'business'}.com`,
          address: '101 Main Street, Suite 400',
          ownerName: user?.name || 'Alex Morgan',
          openingDate: 'Saturday, Next Month 15th',
        };
        setCustomDetails(updatedDetails);

        // Auto-save generated result locally
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
          prompt,
          customDetails: updatedDetails,
          brandKit: generatedData
        }));
      }
    } catch (error) {
      console.error('Error generating brand kit:', error);
      alert('Failed to generate brand kit. Please ensure backend is active on port 5001.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateLogo = async () => {
    if (!brandKit) return;
    setRegeneratingLogo(true);

    try {
      const response = await axios.post('http://localhost:5001/api/generate-logo', {
        businessName: brandKit.businessName,
        niche: brandKit.niche,
        vibe: brandKit.vibe,
        logoPrompt: brandKit.logoPrompt,
      });

      if (response.data.success) {
        const updatedKit = { ...brandKit, logoUrl: response.data.logoUrl };
        setBrandKit(updatedKit);
        
        // Update local cache
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
          prompt,
          customDetails,
          brandKit: updatedKit
        }));
      }
    } catch (error) {
      console.error('Error regenerating logo:', error);
      alert('Failed to regenerate logo.');
    } finally {
      setRegeneratingLogo(false);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const downloadPDF = () => {
    const element = document.getElementById('brand-kit-pdf-content');
    if (!element) return;

    const opt = {
      margin: 0.4,
      filename: `${(brandKit?.businessName || 'brand').toLowerCase().replace(/\s+/g, '-')}-brand-kit.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  const downloadZipBundle = async () => {
    if (!brandKit) return;
    setExportingZip(true);

    try {
      const zip = new JSZip();
      const folderName = (brandKit.businessName || 'brand').toLowerCase().replace(/\s+/g, '-');
      const rootFolder = zip.folder(`${folderName}-brand-assets`);

      let marketingText = `=======================================\n`;
      marketingText += `${(brandKit.businessName || 'BRAND').toUpperCase()} - BRAND ASSETS\n`;
      marketingText += `=======================================\n\n`;
      
      marketingText += `--- CONTACT & BUSINESS DETAILS ---\n`;
      marketingText += `Owner: ${customDetails.ownerName}\n`;
      marketingText += `Phone: ${customDetails.phone}\n`;
      marketingText += `Email: ${customDetails.email}\n`;
      marketingText += `Address: ${customDetails.address}\n`;
      marketingText += `Opening Date: ${customDetails.openingDate}\n\n`;

      if (brandKit.taglines) {
        marketingText += `--- TAGLINES ---\n`;
        brandKit.taglines.forEach((t, i) => { marketingText += `${i + 1}. ${t}\n`; });
      }
      
      if (brandKit.socialCaptions) {
        marketingText += `\n--- SOCIAL MEDIA CAPTIONS ---\n`;
        brandKit.socialCaptions.forEach((c, i) => { marketingText += `Caption ${i + 1}:\n${c}\n\n`; });
      }

      rootFolder.file('taglines-and-captions.txt', marketingText);

      const brandMetadata = {
        businessName: brandKit.businessName,
        niche: brandKit.niche,
        vibe: brandKit.vibe,
        customDetails: customDetails,
        typography: brandKit.typography,
        colorPalette: brandKit.colorPalette,
      };
      rootFolder.file('brand-identity-spec.json', JSON.stringify(brandMetadata, null, 2));

      if (brandKit.landingPageHTML) {
        rootFolder.file('landing-page-hero.html', brandKit.landingPageHTML);
      }

      if (brandKit.logoUrl) {
        try {
          const logoResponse = await fetch(brandKit.logoUrl);
          const logoBlob = await logoResponse.blob();
          rootFolder.file('logo-mark.png', logoBlob);
        } catch (err) {
          console.warn('Could not fetch logo blob:', err);
        }
      }

      const zipContent = await zip.generateAsync({ type: 'blob' });
      saveAs(zipContent, `${folderName}-brand-kit-bundle.zip`);
    } catch (error) {
      console.error('Error generating ZIP:', error);
      alert('Failed to generate ZIP bundle.');
    } finally {
      setExportingZip(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
        
        {/* Ambient background lighting */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-pink-500/10 blur-[120px] pointer-events-none rounded-full" />

        {/* Navigation Bar */}
        <nav className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 py-3.5">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <Sparkles size={18} />
              </div>
              <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                BrandStudio AI
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Import Saved local JSON file option */}
              <label className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-medium text-slate-300 px-3 py-1.5 rounded-xl transition cursor-pointer">
                <Upload size={14} />
                <span className="hidden sm:inline">Import Kit File</span>
                <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
              </label>

              {user ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full">
                    {user.picture ? (
                      <img src={user.picture} alt={user.name} className="w-6 h-6 rounded-full object-cover" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold">
                        <User size={13} />
                      </div>
                    )}
                    <span className="text-xs font-medium text-slate-200">{user.name}</span>
                  </div>

                  <button
                    onClick={() => {
                      setUser(null);
                      setBrandKit(null);
                    }}
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400 transition px-2.5 py-1.5 rounded-xl hover:bg-slate-900 cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOut size={14} />
                    <span className="hidden sm:inline">Sign Out</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow-md shadow-indigo-600/20 cursor-pointer"
                >
                  <LogIn size={14} />
                  <span>Sign In</span>
                </button>
              )}
            </div>

          </div>
        </nav>

        {/* VIEW CONTROLLER */}
        <main className="p-4 sm:p-8 relative z-10 max-w-6xl mx-auto space-y-10">

          {!user ? (
            /* DEFAULT HOME PAGE VIEW FOR GUESTS */
            <LandingShowcase onOpenAuth={() => setIsAuthOpen(true)} />
          ) : (
            /* BRAND GENERATOR TOOL VIEW */
            <div className="space-y-10 animate-fade-in">
              
              <header className="text-center space-y-2 pt-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold">
                  <Wand2 size={14} /> AI Brand Engine
                </div>
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                  Describe Your Vision
                </h1>
                <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto">
                  Type naturally about your business idea. Our system will analyze your prompt and build a cohesive identity suite.
                </p>
              </header>

              {/* STREAMLINED SINGLE PROMPT FORM */}
              <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto">
                <div className="relative bg-slate-900/90 border border-slate-800 focus-within:border-indigo-500 rounded-2xl p-2 shadow-2xl transition-all backdrop-blur-md">
                  <textarea
                    rows={4}
                    required
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g. I am opening a premium beauty & bridal makeup studio in Dhoomanganj called 'Anjana Makeup Studio'. It should feel elegant, glamorous, and trustworthy with rose gold and charcoal tones..."
                    className="w-full bg-transparent text-slate-100 placeholder-slate-500 p-4 focus:outline-none resize-none text-sm leading-relaxed"
                  />
                  
                  <div className="flex justify-between items-center border-t border-slate-800/80 pt-3 px-3">
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                      <Sparkles size={12} className="text-indigo-400" />
                      Natural prompt processing ready
                    </div>

                    <button
                      type="submit"
                      disabled={loading || !prompt.trim()}
                      className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white px-5 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition disabled:opacity-50 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Building Brand Assets...
                        </>
                      ) : (
                        <>
                          Generate Identity <Send size={14} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>

              {/* Output Dashboard */}
              {brandKit && (
                <div className="space-y-6">

                  {/* LIVE PERSONALIZATION BAR */}
                  <div className="bg-slate-950/90 border border-indigo-500/30 p-5 rounded-2xl space-y-4 shadow-xl">
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                        <Edit3 size={15} /> Personalize Card & Flyer Details
                      </h3>
                      <span className="text-[11px] text-slate-400 font-medium">Updates all business cards & invites live</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">Owner / Founder Name</label>
                        <input
                          type="text"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                          value={customDetails.ownerName}
                          onChange={(e) => setCustomDetails({ ...customDetails, ownerName: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">Phone Number</label>
                        <input
                          type="text"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                          value={customDetails.phone}
                          onChange={(e) => setCustomDetails({ ...customDetails, phone: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">Official Email</label>
                        <input
                          type="email"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                          value={customDetails.email}
                          onChange={(e) => setCustomDetails({ ...customDetails, email: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">Business Address</label>
                        <input
                          type="text"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                          value={customDetails.address}
                          onChange={(e) => setCustomDetails({ ...customDetails, address: e.target.value })}
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">Grand Opening Date & Time</label>
                        <input
                          type="text"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                          value={customDetails.openingDate}
                          onChange={(e) => setCustomDetails({ ...customDetails, openingDate: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* DASHBOARD CONTAINER */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 bg-slate-950/60 border-b border-slate-800/80 gap-4">
                      <div className="flex items-center gap-3">
                        <div>
                          <h2 className="text-xl font-bold text-white tracking-tight">Generated Brand Kit</h2>
                          <p className="text-xs text-slate-400 mt-0.5">Brand Identity for <span className="text-indigo-400 font-medium">{brandKit.businessName}</span></p>
                        </div>
                        {saveStatus && (
                          <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-800/40 px-2.5 py-1 rounded-full">
                            <CheckCircle size={12} /> {saveStatus}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5">
                        {/* Save Locally Button */}
                        <button
                          onClick={handleSaveToLocalStorage}
                          className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl transition border border-slate-700 cursor-pointer"
                        >
                          <Save size={14} /> Save to Browser
                        </button>

                        {/* Save/Export JSON File */}
                        <button
                          onClick={handleExportJSON}
                          className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl transition border border-slate-700 cursor-pointer"
                        >
                          <Download size={14} /> Export JSON File
                        </button>

                        {/* Download Zip */}
                        <button
                          onClick={downloadZipBundle}
                          disabled={exportingZip}
                          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow-md cursor-pointer border border-emerald-500/30 disabled:opacity-50"
                        >
                          <Archive size={15} className={exportingZip ? "animate-spin" : ""} />
                          {exportingZip ? 'Packaging Zip...' : 'Download ZIP Bundle'}
                        </button>

                        {/* Export PDF */}
                        <button
                          onClick={downloadPDF}
                          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow-md cursor-pointer border border-indigo-500/30"
                        >
                          <Download size={15} /> Export PDF Kit
                        </button>
                      </div>
                    </div>

                    {/* Dashboard Tabs */}
                    <div className="flex border-b border-slate-800/80 bg-slate-950/40 p-2 gap-2 overflow-x-auto">
                      <button
                        onClick={() => setActiveTab('brand')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition cursor-pointer ${
                          activeTab === 'brand' ? 'bg-indigo-600/90 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                        }`}
                      >
                        <Palette size={16} /> Brand Identity
                      </button>
                      <button
                        onClick={() => setActiveTab('marketing')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition cursor-pointer ${
                          activeTab === 'marketing' ? 'bg-indigo-600/90 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                        }`}
                      >
                        <MessageSquare size={16} /> Marketing Copy
                      </button>
                      <button
                        onClick={() => setActiveTab('landing')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition cursor-pointer ${
                          activeTab === 'landing' ? 'bg-indigo-600/90 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                        }`}
                      >
                        <Layout size={16} /> Landing Page
                      </button>
                      <button
                        onClick={() => setActiveTab('social')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition cursor-pointer ${
                          activeTab === 'social' ? 'bg-indigo-600/90 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                        }`}
                      >
                        <Share2 size={16} /> Cards & Graphics
                      </button>
                    </div>

                    {/* PDF-Exportable Workspace Content */}
                    <div id="brand-kit-pdf-content">

                      {/* TAB 1: BRAND IDENTITY */}
                      {activeTab === 'brand' && (
                        <div className="p-6 sm:p-8 space-y-8">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Logo Box with Fallback Protection */}
                            <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-6 flex flex-col items-center justify-between text-center space-y-4">
                              <div className="flex items-center justify-between w-full">
                                <span className="text-[11px] uppercase font-semibold text-slate-400 tracking-wider">Logo Concept</span>
                                <button
                                  type="button"
                                  onClick={handleRegenerateLogo}
                                  disabled={regeneratingLogo}
                                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded-xl border border-indigo-500/20 disabled:opacity-50 transition cursor-pointer"
                                >
                                  <RefreshCw size={12} className={regeneratingLogo ? "animate-spin" : ""} />
                                  {regeneratingLogo ? 'Refreshing...' : 'New Variant'}
                                </button>
                              </div>

                              <div className="w-52 h-52 bg-slate-900 border border-slate-800 rounded-xl p-2 flex items-center justify-center shadow-inner overflow-hidden">
                                <img 
                                  src={brandKit.logoUrl} 
                                  alt={brandKit.businessName || "Generated Logo"} 
                                  className="w-full h-full object-contain rounded-lg"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(brandKit.businessName || 'Brand')}&background=4f46e5&color=fff&size=512`;
                                  }}
                                />
                              </div>
                              <p className="text-xs text-slate-500 italic">High-res AI generated visual mark</p>
                            </div>

                            {/* Taglines Box */}
                            <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
                              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Recommended Taglines</h3>
                              <div className="space-y-3 my-auto">
                                {brandKit.taglines?.map((tagline, i) => (
                                  <div key={i} className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl text-slate-200 italic text-sm shadow-sm flex items-center justify-between group">
                                    <span>"{tagline}"</span>
                                    <button
                                      onClick={() => copyToClipboard(tagline, `tag-${i}`)}
                                      className="text-slate-500 hover:text-slate-200 transition opacity-0 group-hover:opacity-100 cursor-pointer"
                                    >
                                      {copiedIndex === `tag-${i}` ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                                    </button>
                                  </div>
                                ))}
                              </div>
                              <p className="text-xs text-slate-500">Pick any tagline for social bios or marketing headlines.</p>
                            </div>
                          </div>

                          {/* Color Palette & Typography Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Color Swatches */}
                            <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-6 space-y-4">
                              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Color Palette</h3>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {brandKit.colorPalette?.map((color, i) => (
                                  <div key={i} className="bg-slate-900/90 border border-slate-800/80 p-2.5 rounded-xl space-y-2">
                                    <div className="h-12 rounded-lg shadow-inner" style={{ backgroundColor: color.hex }} />
                                    <div>
                                      <p className="text-xs font-semibold text-slate-200 truncate">{color.name}</p>
                                      <p className="text-[10px] font-mono text-slate-400 uppercase">{color.hex}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Typography Pairings */}
                            <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-6 space-y-4">
                              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Typography Suite</h3>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-slate-900/90 border border-slate-800/80 p-4 rounded-xl space-y-1">
                                  <span className="text-[10px] text-indigo-400 font-bold block uppercase tracking-wider">Heading Font</span>
                                  <span className="text-lg font-bold text-white font-serif">{brandKit.typography?.heading || 'Serif Primary'}</span>
                                </div>
                                <div className="bg-slate-900/90 border border-slate-800/80 p-4 rounded-xl space-y-1">
                                  <span className="text-[10px] text-purple-400 font-bold block uppercase tracking-wider">Body Font</span>
                                  <span className="text-sm text-slate-300 font-sans">{brandKit.typography?.body || 'Sans-Serif Body'}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* TAB 2: MARKETING COPY */}
                      {activeTab === 'marketing' && (
                        <div className="p-6 sm:p-8 space-y-6">
                          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Generated Social Captions</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {brandKit.socialCaptions?.map((caption, i) => (
                              <div key={i} className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
                                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{caption}</p>
                                <button
                                  onClick={() => copyToClipboard(caption, `cap-${i}`)}
                                  className="w-full flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium py-2 rounded-xl border border-slate-800 transition cursor-pointer"
                                >
                                  {copiedIndex === `cap-${i}` ? (
                                    <>
                                      <Check size={14} className="text-emerald-400" /> Copied!
                                    </>
                                  ) : (
                                    <>
                                      <Copy size={14} /> Copy Caption
                                    </>
                                  )}
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* TAB 3: LANDING PAGE HERO PREVIEW */}
                      {activeTab === 'landing' && (
                        <div className="p-6 sm:p-8 space-y-4">
                          <div className="flex justify-between items-center">
                            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Live Landing Page Hero Preview</h3>
                            {brandKit.landingPageHTML && (
                              <button
                                onClick={() => copyToClipboard(brandKit.landingPageHTML, 'html-code')}
                                className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-3 py-1.5 rounded-xl border border-indigo-500/20 cursor-pointer"
                              >
                                {copiedIndex === 'html-code' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                                <span>Copy HTML Code</span>
                              </button>
                            )}
                          </div>

                          <div className="border border-slate-800 rounded-2xl overflow-hidden bg-white min-h-[400px]">
                            {brandKit.landingPageHTML ? (
                              <iframe
                                title="Landing Page Preview"
                                srcDoc={brandKit.landingPageHTML}
                                className="w-full h-[500px] border-none"
                              />
                            ) : (
                              <div className="p-8 text-center text-slate-500 text-xs">
                                Preview HTML snippet not provided for this brand kit.
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* TAB 4: SOCIAL CARDS & GRAPHICS */}
                      {activeTab === 'social' && (
                        <div className="p-6 sm:p-8">
                          <SocialCards brandKit={brandKit} customDetails={customDetails} />
                        </div>
                      )}

                    </div>
                  </div>

                </div>
              )}

            </div>
          )}
        </main>

        <AuthModal 
          isOpen={isAuthOpen} 
          onClose={() => setIsAuthOpen(false)} 
          onLoginSuccess={(userData) => {
            setUser(userData);
            setIsAuthOpen(false);
          }} 
        />
      </div>
    </GoogleOAuthProvider>
  );
}