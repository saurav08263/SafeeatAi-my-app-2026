import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function generateText(prompt: string) {
  const completion = await client.chat.completions.create({
    model: "openai/gpt-oss-20b:free",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return completion.choices[0]?.message?.content || "";
}