import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { code, sourcePlatform, targetPlatform } = await req.json();

  if (!code || !sourcePlatform) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const prompt = `You are an expert code migration analyst specializing in enterprise automation modernization.

Analyze the following ${sourcePlatform} code and provide a detailed migration assessment.

SOURCE CODE (${sourcePlatform}):
\`\`\`
${code}
\`\`\`

TARGET PLATFORM: ${targetPlatform}

Provide your assessment as a JSON object with exactly this structure:
{
  "complexityScore": <number 1-10>,
  "migrationReadiness": <"High" | "Medium" | "Low">,
  "linesOfCode": <number>,
  "estimatedEffort": <string like "2-3 days" or "1 week">,
  "codeAccuracyEstimate": <number 0-100>,
  "issues": [
    { "severity": <"critical" | "high" | "medium" | "low">, "title": <string>, "description": <string> }
  ],
  "aiOpportunities": [<string>, ...],
  "summary": <2-3 sentence assessment>,
  "platformInsights": <1-2 sentences about migrating from source to target specifically>
}

Be realistic and specific. Return ONLY the JSON, no markdown.`;

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const assessment = JSON.parse(text);
    return NextResponse.json(assessment);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Assessment failed" }, { status: 500 });
  }
}
