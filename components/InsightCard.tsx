
import React, { forwardRef } from 'react';
import { InsightCardData } from '../types';

interface InsightCardProps {
  data: InsightCardData;
}

const InsightCard = forwardRef<HTMLDivElement, InsightCardProps>(({ data }, ref) => {
  const { title, subtitle, coreInsight, stages, transformation, wisdomQuote, colors } = data;

  return (
    <div 
      ref={ref}
      className="w-[750px] min-h-[1000px] flex flex-col bg-white rounded-2xl overflow-hidden shadow-2xl relative"
      style={{ backgroundColor: data.colors.background }}
    >
      {/* Visual Accent */}
      <div 
        className="absolute top-0 right-0 w-64 h-64 opacity-10 rounded-full -mr-20 -mt-20" 
        style={{ backgroundColor: colors.accent }}
      />
      
      <div className="p-[30px] flex-grow flex flex-col">
        {/* Header Section (approx 15% height) */}
        <header className="mb-10 relative z-10">
          <div className="flex items-center gap-4 mb-2">
            <div 
              className="w-1.5 h-10 rounded-full" 
              style={{ backgroundColor: colors.primary }}
            />
            <h1 className="text-main-title font-serif-sc font-bold leading-tight" style={{ color: colors.primary }}>
              {title}
            </h1>
          </div>
          <p className="text-section-title font-sans-sc font-medium opacity-80 pl-6" style={{ color: colors.secondary }}>
            {subtitle}
          </p>
        </header>

        {/* Core Insight (High impact area) */}
        <section className="mb-12 bg-white/60 backdrop-blur-sm p-8 rounded-2xl border-l-[6px]" style={{ borderColor: colors.accent }}>
          <div className="text-note-text font-bold mb-3 uppercase tracking-wider flex items-center gap-2" style={{ color: colors.accent }}>
            <i className="fa-solid fa-lightbulb" /> Core Insight 核心洞见
          </div>
          <p className="text-body-text font-sans-sc leading-[1.8] font-medium text-slate-800">
            {coreInsight}
          </p>
        </section>

        {/* Stages / Structure (Visual center) */}
        <section className="mb-12">
          <div className="grid gap-6">
            {stages.map((stage, idx) => (
              <div key={idx} className="flex gap-6 items-start group">
                <div 
                  className="w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center text-2xl transition-all duration-300 group-hover:scale-110"
                  style={{ backgroundColor: colors.primary + '20', color: colors.primary }}
                >
                  <i className={stage.icon}></i>
                </div>
                <div className="flex-grow pt-1">
                  <h3 className="text-[28px] font-bold mb-2 font-serif-sc" style={{ color: colors.primary }}>
                    {stage.label}
                  </h3>
                  <p className="text-body-text font-sans-sc leading-[1.6] text-slate-600">
                    {stage.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Transformation Section */}
        <section className="mb-12 grid grid-cols-2 gap-0 border-y border-slate-200 py-8">
          <div className="pr-6 border-r border-slate-200">
            <div className="text-note-text font-bold text-slate-400 mb-2">BEFORE / 过去</div>
            <p className="text-body-text text-slate-500 italic leading-[1.6]">{transformation.before}</p>
          </div>
          <div className="pl-6">
            <div className="text-note-text font-bold mb-2" style={{ color: colors.accent }}>AFTER / 跃迁</div>
            <p className="text-body-text font-bold leading-[1.6]" style={{ color: colors.primary }}>{transformation.after}</p>
          </div>
        </section>

        {/* Wisdom Quote (Social currency) */}
        <section className="mt-auto relative">
          <div className="absolute -left-4 -top-4 text-6xl opacity-10" style={{ color: colors.accent }}>
            <i className="fa-solid fa-quote-left"></i>
          </div>
          <div className="relative z-10 py-6 px-10 bg-white/40 rounded-xl italic">
            <p className="text-body-text font-serif-sc font-semibold leading-[1.8] text-center" style={{ color: colors.primary }}>
              “{wisdomQuote}”
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-slate-200 flex justify-between items-center text-note-text text-slate-400">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-brain"></i>
            <span>Knowledge Insight Card</span>
          </div>
          <div>{new Date().toLocaleDateString('zh-CN')}</div>
        </footer>
      </div>
    </div>
  );
});

InsightCard.displayName = 'InsightCard';

export default InsightCard;
