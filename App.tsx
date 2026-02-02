
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GeminiService } from './services/geminiService';
import { InsightCardData, GeneratorState } from './types';
import InsightCard from './components/InsightCard';
import html2canvas from 'html2canvas';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [state, setState] = useState<GeneratorState>({
    isLoading: false,
    error: null,
    data: null,
  });
  const [isMobile, setIsMobile] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleGenerate = async () => {
    if (!inputText.trim()) {
      setState(prev => ({ ...prev, error: '请输入文章内容' }));
      return;
    }

    setState({ isLoading: true, error: null, data: null });
    const gemini = new GeminiService();

    try {
      const data = await gemini.analyzeArticle(inputText);
      setState({ isLoading: false, error: null, data });
    } catch (err: any) {
      console.error(err);
      setState({ 
        isLoading: false, 
        error: '生成失败: ' + (err.message || '未知错误'), 
        data: null 
      });
    }
  };

  const handleAction = useCallback(async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      if (isMobile) {
        const dataURL = canvas.toDataURL('image/png', 1.0);
        const newWindow = window.open();
        if (newWindow) {
          newWindow.document.write(`
            <!DOCTYPE html>
            <html lang="zh">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>长按保存图片</title>
              <style>
                body,html{margin:0;padding:0;background-color:#f0f2f5;display:flex;flex-direction:column;align-items:center;}
                .container{padding:20px;display:flex;flex-direction:column;align-items:center;gap:20px;min-height:100vh;box-sizing:border-box}
                p{color:#333;font-family:sans-serif;font-size:16px;text-align:center;line-height:1.5;background-color:#fff;padding:12px 20px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1)}
                img{max-width:100%;height:auto;border-radius:8px;box-shadow:0 4px 15px rgba(0,0,0,0.15)}
              </style>
            </head>
            <body>
              <div class="container">
                <p>请长按下方图片，然后选择 "存储图像" 或 "添加到照片"。</p>
                <img src="${dataURL}" alt="生成的文章概念卡片" />
              </div>
            </body>
            </html>
          `);
          newWindow.document.close();
        }
      } else {
        canvas.toBlob(async (blob) => {
          if (!blob) return;
          try {
            const item = new ClipboardItem({ "image/png": blob });
            await navigator.clipboard.write([item]);
            alert('卡片已复制到剪贴板！');
          } catch (error) {
            console.error('Clipboard copy failed', error);
            // Fallback: Download
            const link = document.createElement('a');
            link.download = `insight-card-${Date.now()}.png`;
            link.href = canvas.toDataURL();
            link.click();
          }
        });
      }
    } catch (err) {
      alert('生成图片失败，请重试');
    }
  }, [isMobile]);

  return (
    <div className="min-h-screen flex flex-col items-center py-10 px-4 gap-8">
      {/* Input Section */}
      <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <i className="fa-solid fa-wand-magic-sparkles text-blue-600"></i>
          知识洞见卡生成器
        </h1>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="在此粘贴文章内容，我们将为您智能提取核心洞见并生成高美感卡片..."
          className="w-full h-48 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none custom-scrollbar text-lg"
        />
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            基于 Gemini 3.0 深度分析，自动匹配配色与逻辑结构。
          </p>
          <button
            onClick={handleGenerate}
            disabled={state.isLoading}
            className={`px-8 py-3 rounded-full font-bold text-white transition-all shadow-lg hover:shadow-xl active:scale-95 ${
              state.isLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {state.isLoading ? (
              <span className="flex items-center gap-2">
                <i className="fa-solid fa-spinner fa-spin"></i> 正在分析洞见...
              </span>
            ) : (
              '立即生成洞见卡'
            )}
          </button>
        </div>
      </div>

      {/* Error Display */}
      {state.error && (
        <div className="w-full max-w-4xl p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-3">
          <i className="fa-solid fa-circle-exclamation"></i>
          {state.error}
        </div>
      )}

      {/* Card Display Area */}
      {state.data && (
        <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-6 flex gap-4">
            <button
              onClick={handleAction}
              className="px-6 py-2 bg-slate-800 text-white rounded-full font-bold shadow-md hover:bg-slate-900 transition-all flex items-center gap-2"
            >
              <i className={isMobile ? "fa-solid fa-download" : "fa-solid fa-copy"}></i>
              {isMobile ? '保存洞见卡' : '复制到剪贴板'}
            </button>
          </div>

          {/* The Actual Card - Wrap in a overflow-hidden container to prevent layout shifts */}
          <div className="shadow-2xl rounded-2xl overflow-hidden mb-12 transform scale-[0.6] sm:scale-100 origin-top">
            <InsightCard ref={cardRef} data={state.data} />
          </div>
        </div>
      )}

      {!state.data && !state.isLoading && (
        <div className="flex flex-col items-center text-slate-400 mt-20 opacity-50">
          <i className="fa-solid fa-id-card text-8xl mb-4"></i>
          <p className="text-xl">等待灵感注入...</p>
        </div>
      )}
    </div>
  );
};

export default App;
