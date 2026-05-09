import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const { code, sourcePlatform, targetPlatform, assessment } = await req.json();

  const prompt = `You are an expert code migration engineer. Convert the following ${sourcePlatform} automation code to ${targetPlatform}.

SOURCE CODE (${sourcePlatform}):
\`\`\`
${code}
\`\`\`

MIGRATION CONTEXT:
- Target: ${targetPlatform}
- Known issues: ${assessment?.issues?.map((i: { title: string }) => i.title).join(", ") || "none"}
- AI opportunities: ${assessment?.aiOpportunities?.join(", ") || "none"}

REQUIREMENTS:
1. Produce clean, idiomatic ${targetPlatform} code
2. Add proper error handling and logging
3. Preserve all original business logic exactly
4. Add brief inline comments for non-obvious parts
5. If migrating to Python, follow PEP 8
6. If migrating to LangChain/AI-enhanced, add appropriate AI capabilities

Return a JSON object with exactly this structure:
{
  "convertedCode": <the full converted code as a string>,
  "language": <programming language identifier for syntax highlighting, e.g. "python", "javascript">,
  "changes": [<string describing each significant change made>],
  "warnings": [<string for any manual review items>]
}

Return ONLY the JSON, no markdown fences around it.`;

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";

    // Strip markdown fences if model wrapped response
    const cleaned = text.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
    const result = JSON.parse(cleaned);
    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Conversion failed" }, { status: 500 });
  }
}
