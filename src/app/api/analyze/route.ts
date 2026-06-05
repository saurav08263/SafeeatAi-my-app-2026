console.log("ANALYZE API LOADED");

import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

// ================= PROMPTS =================

const FOOD_SAFETY_PROMPT = `
You are SafeEat AI.

Return ONLY valid JSON.

{
  "productName":"Food Name",
  "safetyScore":85,
  "riskLevel":"low",

  "ingredients":[
    {
      "name":"Ingredient Name",
      "category":"Protein",
      "safety":"safe",
      "description":"Short description"
    }
  ],

  "warnings":[
    "warning1"
  ],

  "allergenAlerts":[
    {
      "name":"Allergen Name",
      "severity":"medium",
      "description":"Short description"
    }
  ],

  "nutritionSummary":{
    "protein":"10g",
    "carbs":"20g",
    "fat":"5g",
    "calories":"150"
  },

  "aiAnalysis":"short analysis"
}

IMPORTANT:
- ingredients must be objects
- allergenAlerts must be objects
- safety values: safe, caution, avoid
- severity values: low, medium, high, dangerous

Return JSON only.
`;
const COMBINATION_PROMPT = `
You are SafeEat AI.

Return ONLY valid JSON.

{
  "productName":"Food Combination",
  "safetyScore":85,
  "riskLevel":"low",
  "ingredients":[],
  "warnings":["warning"],
  "allergenAlerts":[],
  "nutritionSummary":{},
  "aiAnalysis":"Combination analysis"
}

Analyze the food combination and return JSON only.
`;

const EXPIRY_PROMPT = `
You are SafeEat AI.

Return ONLY valid JSON.

{
  "productName":"Food Product",
  "safetyScore":85,
  "riskLevel":"low",
  "ingredients":[],
  "warnings":["expiry warning"],
  "allergenAlerts":[],
  "nutritionSummary":{},
  "aiAnalysis":"Expiry analysis"
}

Analyze expiry safety and return JSON only.
`;

const MEDICINE_PROMPT = `
You are SafeEat AI.

Return ONLY valid JSON.

{
  "productName":"Food + Medicine",
  "safetyScore":85,
  "riskLevel":"low",
  "ingredients":[],
  "warnings":["interaction warning"],
  "allergenAlerts":[],
  "nutritionSummary":{},
  "aiAnalysis":"Medicine interaction analysis"
}

Return JSON only.
`;

const PREGNANCY_PROMPT = `
You are SafeEat AI.

Return ONLY valid JSON.

{
  "productName":"Pregnancy Food",
  "safetyScore":85,
  "riskLevel":"low",
  "ingredients":[],
  "warnings":["pregnancy warning"],
  "allergenAlerts":[],
  "nutritionSummary":{},
  "aiAnalysis":"Pregnancy safety analysis"
}

Return JSON only.
`;

const KIDS_PROMPT = `
You are SafeEat AI.

Return ONLY valid JSON.

{
  "productName":"Kids Food",
  "safetyScore":85,
  "riskLevel":"low",
  "ingredients":[],
  "warnings":["kids warning"],
  "allergenAlerts":[],
  "nutritionSummary":{},
  "aiAnalysis":"Kids safety analysis"
}

Return JSON only.
`;

const GYM_PROMPT = `
You are SafeEat AI.

Return ONLY valid JSON.

{
  "productName":"Gym Food",
  "safetyScore":85,
  "riskLevel":"low",
  "ingredients":[],
  "warnings":[],
  "allergenAlerts":[],
  "nutritionSummary":{
    "protein":"0g",
    "carbs":"0g",
    "fat":"0g",
    "calories":"0"
  },
  "aiAnalysis":"Gym nutrition analysis"
}

Return JSON only.
`;

type ScanType =
  | "image"
  | "text"
  | "combination"
  | "expiry"
  | "medicine"
  | "pregnancy"
  | "kids"
  | "gym";

const PROMPT_MAP: Record<ScanType, string> = {
  image: FOOD_SAFETY_PROMPT,
  text: FOOD_SAFETY_PROMPT,
  combination: COMBINATION_PROMPT,
  expiry: EXPIRY_PROMPT,
  medicine: MEDICINE_PROMPT,
  pregnancy: PREGNANCY_PROMPT,
  kids: KIDS_PROMPT,
  gym: GYM_PROMPT,
};

// ================= HELPERS =================

function parseAIResponse(raw: string) {
  try {
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start !== -1 && end !== -1) {
      return JSON.parse(raw.slice(start, end + 1));
    }
  } catch {}

  return {
    productName: "Unknown Product",
    safetyScore: 50,
    riskLevel: "medium",
    ingredients: [],
    warnings: [],
    allergenAlerts: [],
    nutritionSummary: {},
    aiAnalysis: raw,
  };
}

function validateResult(parsed: any) {
  parsed.safetyScore = Math.max(0, Math.min(100, Number(parsed.safetyScore) || 50));

  const validRisk = ["low", "medium", "high", "dangerous"];
  if (!validRisk.includes(parsed.riskLevel)) {
    parsed.riskLevel = "medium";
  }

  parsed.ingredients = Array.isArray(parsed.ingredients) ? parsed.ingredients : [];
  parsed.warnings = Array.isArray(parsed.warnings) ? parsed.warnings : [];
  parsed.allergenAlerts = Array.isArray(parsed.allergenAlerts)
    ? parsed.allergenAlerts
    : [];
    parsed.ingredients = parsed.ingredients.map((item: any) => {
  if (typeof item === "string") {
    return {
      name: item,
      category: "Food",
      safety: "safe",
      description: item,
    };
  }
  return item;
});

parsed.allergenAlerts = parsed.allergenAlerts.map((item: any) => {
  if (typeof item === "string") {
    return {
      name: item,
      severity: "medium",
      description: item,
    };
  }
  return item;
});

  return parsed;
}

// ================= MAIN API =================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { imageData, text, scanType = "text", comboItems } = body;

    console.log("SCAN TYPE:", scanType);
    console.log("IMAGE EXISTS:", !!imageData);

    

    const resolvedScanType: ScanType = scanType;

    const systemPrompt = PROMPT_MAP[resolvedScanType];

    // ================= IMAGE FLOW =================

    if (imageData && resolvedScanType === "image") {
      const cleanImage = imageData.includes(",")
        ? imageData.split(",")[1]
        : imageData;

      const completion = await client.chat.completions.create({
model: "openai/gpt-4o-mini",
  messages: [
    {
      role: "user",
      content: [
  {
    type: "text",
    text: `${systemPrompt}\nAnalyze this food image for safety.`,
  },
  {
    type: "image_url",
    image_url: {
      url: imageData,
    },
  },
],
    },
  ],
});

const responseText = completion.choices[0].message.content || "";
console.log("RAW AI RESPONSE:");
console.log(responseText);
const parsed = validateResult(parseAIResponse(responseText));

console.log("PARSED RESULT:");
console.log(JSON.stringify(parsed, null, 2));

      return NextResponse.json({ success: true, result: parsed });
    }

    // ================= TEXT FLOW =================

    let userPrompt = "";

    switch (resolvedScanType) {
      case "combination":
        userPrompt = `Check food combination: ${comboItems?.join(" + ")}`;
        break;
      case "expiry":
        userPrompt = `Check expiry: ${text}`;
        break;
      case "medicine":
        userPrompt = `Medicine interaction: ${text}`;
        break;
      case "pregnancy":
        userPrompt = `Pregnancy safety: ${text}`;
        break;
      case "kids":
        userPrompt = `Kids safety: ${text}`;
        break;
      case "gym":
        userPrompt = `Gym nutrition: ${text}`;
        break;
      default:
        userPrompt = `Analyze food: ${text}`;
    }

    const completion = await client.chat.completions.create({
  model: "openai/gpt-4o-mini",
  messages: [
    {
      role: "user",
      content: `${systemPrompt}\n\n${userPrompt}`,
    },
  ],
});

const responseText = completion.choices[0].message.content || "";

console.log("RAW AI RESPONSE:");
console.log(responseText);

const parsed = validateResult(parseAIResponse(responseText));

console.log("PARSED RESULT:");
console.log(JSON.stringify(parsed, null, 2));

return NextResponse.json({
  success: true,
  result: parsed,
});

  } catch (error: any) {
    console.error("Analysis error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to analyze",
        details: error?.message,
      },
      { status: 500 }
    );
  }
}