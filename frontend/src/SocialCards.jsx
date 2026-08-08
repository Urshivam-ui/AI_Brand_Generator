import React, { useRef } from 'react';
import { toPng } from 'html-to-image';
import { Download, Share2 } from 'lucide-react';

export default function SocialCards({ brandKit, businessName }) {
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const card3Ref = useRef(null);

  const downloadCard = async (ref, filename) => {
    if (!ref.current) return;
    try {
      const dataUrl = await toPng(ref.current, { cacheBust: true, quality: 0.95 });
      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export social graphic card:', err);
    }
  };

  const primaryColor = brandKit?.colorPalette?.[0]?.hex || '#4F46E5';
  const secondaryColor = brandKit?.colorPalette?.[1]?.hex || '#9333EA';
  const accentColor = brandKit?.colorPalette?.[2]?.hex || '#EC4899';
  const tagline = brandKit?.taglines?.[0] || 'Elevate Your Vision';

  return (
    <div className="p-6 sm:p-8 space-y-8">
      <div>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Automated Social Media Post Templates
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Instant promo visuals pre-styled with your generated brand palette and typography.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Card 1: Instagram Post (1:1) */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs text-slate-400 font-medium">
            <span>Instagram Post (1:1)</span>
            <button
              onClick={() => downloadCard(card1Ref, `${businessName.toLowerCase()}-insta-post`)}
              className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 transition cursor-pointer"
            >
              <Download size={13} /> Download PNG
            </button>
          </div>

          <div
            ref={card1Ref}
            className="w-full aspect-square rounded-2xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
              color: '#ffffff',
            }}
          >
            {/* Background Glow Overlay */}
            <div
              className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-2xl opacity-30"
              style={{ backgroundColor: accentColor }}
            />

            {/* Header */}
            <div className="flex items-center gap-3 z-10">
              {brandKit.logoUrl && (
                <img
                  src={brandKit.logoUrl}
                  alt="Logo"
                  className="w-10 h-10 object-contain rounded-lg bg-white/20 p-1 backdrop-blur-md"
                />
              )}
              <span className="font-bold text-sm tracking-wide">{businessName}</span>
            </div>

            {/* Body Quote */}
            <div className="my-auto z-10 space-y-2">
              <span className="text-[10px] uppercase tracking-widest text-white/70 font-semibold">Special Feature</span>
              <h4 className="text-xl sm:text-2xl font-extrabold leading-snug drop-shadow-sm font-serif">
                "{tagline}"
              </h4>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center text-[11px] text-white/80 border-t border-white/20 pt-3 z-10">
              <span>Link in Bio</span>
              <span className="font-mono">@{businessName.toLowerCase().replace(/\s+/g, '')}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Story / Reel Cover (9:16) */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs text-slate-400 font-medium">
            <span>Story Banner (9:16)</span>
            <button
              onClick={() => downloadCard(card2Ref, `${businessName.toLowerCase()}-story-banner`)}
              className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 transition cursor-pointer"
            >
              <Download size={13} /> Download PNG
            </button>
          </div>

          <div
            ref={card2Ref}
            className="w-full aspect-[9/16] max-h-[380px] rounded-2xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden"
            style={{
              backgroundColor: '#0F172A',
              border: `2px solid ${primaryColor}`,
            }}
          >
            <div
              className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20"
              style={{ backgroundColor: primaryColor }}
            />

            {/* Top Logo */}
            <div className="flex flex-col items-center text-center space-y-2 z-10 pt-2">
              {brandKit.logoUrl && (
                <img
                  src={brandKit.logoUrl}
                  alt="Logo"
                  className="w-12 h-12 object-contain rounded-xl bg-slate-900 border border-slate-700 p-1.5"
                />
              )}
              <h5 className="text-sm font-extrabold text-white">{businessName}</h5>
            </div>

            {/* Middle Message */}
            <div className="text-center space-y-2 my-auto z-10">
              <p className="text-lg font-bold text-slate-100 font-serif leading-snug">
                {tagline}
              </p>
              <p className="text-xs text-slate-400">Discover new possibilities with us.</p>
            </div>

            {/* Call to Action Button Visual */}
            <div className="z-10 text-center space-y-3 pb-2">
              <div
                className="w-full py-2.5 rounded-xl font-bold text-xs shadow-md text-white"
                style={{ backgroundColor: primaryColor }}
              >
                Swipe Up / Learn More
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Twitter / Banner Style (16:9) */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs text-slate-400 font-medium">
            <span>Promo Header (16:9)</span>
            <button
              onClick={() => downloadCard(card3Ref, `${businessName.toLowerCase()}-promo-header`)}
              className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 transition cursor-pointer"
            >
              <Download size={13} /> Download PNG
            </button>
          </div>

          <div
            ref={card3Ref}
            className="w-full aspect-[16/9] rounded-2xl p-6 flex items-center justify-between shadow-xl relative overflow-hidden"
            style={{
              background: `linear-gradient(90deg, ${secondaryColor}, #0F172A)`,
            }}
          >
            <div className="space-y-2 z-10 max-w-[65%]">
              <span className="text-[10px] uppercase font-mono tracking-wider text-pink-300 font-semibold">
                Official Brand Launch
              </span>
              <h4 className="text-lg sm:text-xl font-bold text-white leading-tight font-serif">
                {businessName}
              </h4>
              <p className="text-xs text-slate-300 line-clamp-2">
                "{tagline}"
              </p>
            </div>

            {brandKit.logoUrl && (
              <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-2 flex items-center justify-center shrink-0 z-10 shadow-lg">
                <img src={brandKit.logoUrl} alt="Logo" className="w-full h-full object-contain" />
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}