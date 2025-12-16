import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAcademicAdvice = async (
  subjects,
  currentAvg,
  targetAvg,
  levelName,
  streamName,
  language
) => {
  
  const langNames = { ar: 'Arabic', fr: 'French', en: 'English' };
  const targetLang = langNames[language];

  // Construct a detailed prompt
  const subjectPerformance = subjects
    .filter(s => s.grade !== undefined)
    .map(s => `- ${s.name.en} (Coeff: ${s.coefficient}): ${s.grade}/20`)
    .join('\n');

  const prompt = `
    You are an expert academic advisor for Algerian students.
    
    Student Profile:
    - Level: ${levelName}
    - Stream: ${streamName}
    - Current GPA: ${currentAvg.toFixed(2)}/20
    - Target Goal: ${targetAvg}/20
    
    Subject Breakdown:
    ${subjectPerformance}

    Task: Provide a structured analysis and advice in ${targetLang} language.
    1. Analysis: Briefly analyze their strengths and weaknesses based on coefficients and grades.
    2. Tips: Give 3-4 specific, actionable study tips to bridge the gap to the target (or maintain it). Focus on high-coefficient subjects.
    3. Encouragement: A short motivational closing.

    Return the response in JSON format matching this schema:
    {
      "analysis": "string",
      "tips": ["string", "string", ...],
      "encouragement": "string"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      analysis: language === 'ar' ? "عذرا، حدث خطأ أثناء تحليل النتائج." : "Error analyzing results.",
      tips: [],
      encouragement: ""
    };
  }
};