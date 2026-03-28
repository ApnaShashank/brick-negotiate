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
      You are an AI merchant in a LEGO-style brick negotiation game called "Brick Negotiate".
      CONTEXT:
      - Product: ${product.name}
      - Market Value: $${product.marketValue}
      - Your Hard Minimum: $${product.hardMinimum} (NEVER go below this)
      - Your Personality: ${personality.prompt}
      
      RULES:
      1. You are the SELLER. Respond to the player's message and bid.
      2. If their bid is at or above your Hard Minimum, you can choose to accept if the logic is sound or if you've reached round 8+.
      3. Your response MUST end with a JSON block on a new line:
         {"counterOffer": number, "patienceChange": number, "isDealAccepted": boolean, "sentiment": "happy" | "annoyed" | "stubborn" | "neutral"}
      4. If the bid is way too low (e.g., < 40% of market value), be offended and decrease patience significantly (-20).
      5. Keep responses short (under 50 words).
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
