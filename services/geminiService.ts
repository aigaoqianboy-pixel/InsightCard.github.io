
import { GoogleGenAI, Type } from "@google/genai";
import { InsightCardData } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async analyzeArticle(content: string): Promise<InsightCardData> {
    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `分析以下文章内容，并提取其核心洞见、关键阶段和智慧总结。请以高密度的知识结构呈现。

文章内容:
${content}

请根据文章的情感基调（如：专业、温暖、激励、深刻）生成一组和谐的色彩方案。`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "文章主标题 (40px scale)" },
            subtitle: { type: Type.STRING, description: "副标题 (32px scale)" },
            coreInsight: { type: Type.STRING, description: "最核心、最违反直觉或最具影响力的想法" },
            structureType: { 
              type: Type.STRING, 
              enum: ['process', 'comparison', 'concept'],
              description: "文章逻辑结构：过程（顺序）、比较（对比）或概念（原则）" 
            },
            stages: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING, description: "阶段/组成部分名称" },
                  description: { type: Type.STRING, description: "简短描述" },
                  icon: { type: Type.STRING, description: "对应的 Font Awesome 6 图标类名 (例如: fa-solid fa-rocket)" }
                },
                required: ["label", "description", "icon"]
              },
              minItems: 3,
              maxItems: 5
            },
            transformation: {
              type: Type.OBJECT,
              properties: {
                before: { type: Type.STRING, description: "转变前的状态/旧观念" },
                after: { type: Type.STRING, description: "转变后的状态/新智慧" }
              },
              required: ["before", "after"]
            },
            wisdomQuote: { type: Type.STRING, description: "一句令人难忘的经典智慧之语" },
            colors: {
              type: Type.OBJECT,
              properties: {
                primary: { type: Type.STRING, description: "主色调 (Hex)" },
                secondary: { type: Type.STRING, description: "辅助色 (Hex)" },
                accent: { type: Type.STRING, description: "强调色 (Hex)" },
                background: { type: Type.STRING, description: "卡片浅背景色 (Hex)" }
              },
              required: ["primary", "secondary", "accent", "background"]
            }
          },
          required: ["title", "subtitle", "coreInsight", "structureType", "stages", "transformation", "wisdomQuote", "colors"]
        }
      }
    });

    if (!response.text) {
      throw new Error("Failed to generate insight data");
    }

    return JSON.parse(response.text.trim()) as InsightCardData;
  }
}
