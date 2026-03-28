import { GoogleGenerativeAI } from "@google/generative-ai";
import { Groq } from "groq-sdk";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, bid, history, round, product, personality } = body;

    if (!product || !personality) {
      console.error("Missing product or personality in request");
      return NextResponse.json({ error: "Context missing (product/personality)" }, { status: 400 });
    }

    const systemPrompt = `
      You are an elite, street-smart merchant in a high-stakes negotiation simulation called "Brick Negotiate".
      
      INVENTORY CONTEXT:
      - Product: ${product.name}
      - Asking Price (Market Value): $${product.marketValue}
      - YOUR BOTTOM LINE: $${product.hardMinimum} (ABSOLUTE MINIMUM. NEVER go below this. Walk away if they demand lower).
      - Persona: ${personality.prompt}
      
      CORE LINGUISTIC DIRECTIVE ("DESI MIRROR"):
      - You MUST flawlessly mirror the buyer's language. If they use fluent Hindi, Hinglish (e.g., "bhai yaar", "kam karo na", "maza nahi aaya"), you MUST reply in natural, street-level Hinglish.
      - Do NOT sound like a robot translator. Use emojis naturally. Be dramatic if offended.
      
      IRONCLAD NEGOTIATION ALGORITHM:
      1. MATH RULES (NEVER BREAK):
         - Your 'counterOffer' CANNOT be higher than your previous offer.
         - Your 'counterOffer' CANNOT be lower than the user's 'bid'.
         - NEVER accept a deal ("isDealAccepted": true) if the bid is strictly below YOUR BOTTOM LINE. PERIOD. Give them a final warning and walk away if they persist.
      2. PATIENCE DECAY:
         - Standard penalty: Drop patience by -5 every round.
         - Severe Offense: If they offer <50% of Market Value, drop patience by -20 and act deeply insulted ("kya mazak kar rahe ho bhai?").
         - Reward: Genuine flattery or great logic = +10 patience.
      3. LENGTH: Speak strictly under 40 words. Be punchy.

      OUTPUT FORMAT (CRITICAL):
      DO NOT surround the JSON with markdown formatting (no \`\`\`json). The final line MUST be pure raw JSON.
      Your conversational response text.
      {"counterOffer": number, "patienceChange": number, "isDealAccepted": boolean, "sentiment": "happy" | "annoyed" | "stubborn" | "neutral"}
    `;


    let aiText = "";

    try {
      // Primary: Gemini
      console.log(`[Negotiate] Attempting Gemini (Round ${round})...`);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `System Instructions: ${systemPrompt}\n\nHistory: ${JSON.stringify(history.slice(-6))}\n\nUser Message: ${message}\nUser Bid: $${bid}`;
      
      const result = await model.generateContent(prompt);
      aiText = result.response.text();
      console.log(`[Negotiate] Gemini Success.`);
    } catch (geminiError) {
      console.error("[Negotiate] Gemini failed, falling back to Groq:", geminiError);
      
      // Secondary: Groq
      try {
        const completion = await groq.chat.completions.create({
          messages: [
            { role: "system", content: systemPrompt },
            ...history.slice(-4).map((m: any) => ({ 
              role: (m.speaker === "ai" ? "assistant" : "user") as "assistant" | "user", 
              content: m.text 
            })),
            { role: "user", content: `New Message: ${message}, Bid: $${bid}` }
          ],
          model: "llama-3.3-70b-versatile",
        });
        aiText = completion.choices[0]?.message?.content || "";
        console.log(`[Negotiate] Groq Success.`);
      } catch (groqError: any) {
        console.error("[Negotiate] Groq also failed:", groqError);
        return NextResponse.json({ error: "AI negotiation service failure", details: groqError.message }, { status: 502 });
      }
    }

    return parseAIResponse(aiText, product.marketValue);
  } catch (error: any) {
    console.error("Negotiation API Critical Error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}

function parseAIResponse(text: string, defaultOffer: number) {
  try {
    // Regex for grabbing the last JSON block in the text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn("[Parse] No JSON block found in AI text. Using fallback.");
      throw new Error("No JSON block found");
    }
    
    const jsonData = JSON.parse(jsonMatch[0]);
    const cleanText = text.replace(jsonMatch[0], "").trim();

    return NextResponse.json({
      response: cleanText || "I've made my decision.",
      counterOffer: jsonData.counterOffer || defaultOffer,
      patienceChange: jsonData.patienceChange ?? -10,
      isDealAccepted: !!jsonData.isDealAccepted,
      sentiment: jsonData.sentiment || "neutral"
    });
  } catch (e) {
    console.error("[Parse] Error parsing AI response:", e, "Raw:", text);
    return NextResponse.json({
      response: text.replace(/\{[\s\S]*\}/, "").trim() || "Let's stick to the negotiation.",
      counterOffer: defaultOffer * 0.95,
      patienceChange: -5,
      isDealAccepted: false,
      sentiment: "neutral"
    });
  }
}
