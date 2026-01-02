
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, FinancialInsight } from "../types";

// Always use process.env.API_KEY directly for initialization
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getFinancialAdvice(transactions: Transaction[]): Promise<FinancialInsight[]> {
  const model = "gemini-3-flash-preview";
  
  const recentTransactions = transactions.slice(-20).map(t => ({
    type: t.type,
    amount: t.amount,
    category: t.category,
    note: t.note
  }));

  const prompt = `Act as a friendly, supportive personal financial coach. Review these recent transactions and provide exactly 3 actionable, friendly insights. 
  Transactions: ${JSON.stringify(recentTransactions)}
  
  Focus on identifying patterns, potential savings, and offering encouragement. Ensure the tone is non-judgmental and helpful.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              suggestion: { type: Type.STRING },
              sentiment: { 
                type: Type.STRING,
                description: "One of: positive, neutral, negative"
              },
            },
            required: ["title", "description", "suggestion", "sentiment"],
          },
        },
      },
    });

    // Use response.text directly (it's a getter, not a method)
    const text = response.text || "[]";
    return JSON.parse(text) as FinancialInsight[];
  } catch (error) {
    console.error("Gemini Error:", error);
    return [{
      title: "Keep it up!",
      description: "You're taking the first step towards financial freedom by tracking your spending.",
      suggestion: "Add more transactions to get personalized AI insights.",
      sentiment: "positive"
    }];
  }
}
