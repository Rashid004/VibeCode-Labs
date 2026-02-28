import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Instantiated once at module level — reused across warm invocations.
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SUPPORTED_LANGUAGES = [
  "javascript",
  "typescript",
  "python",
  "java",
  "cpp",
  "rust",
  "go",
  "php",
];

const MAX_CODE_LENGTH = 10_000;

const SYSTEM_PROMPT = `You are a brutally honest senior software engineer with 15+ years of experience reviewing pull requests.

Your personality:
- Sharp, witty, and slightly sarcastic
- Technically precise — every critique must be correct
- Never offensive toward the developer, only toward the code
- Funny but intelligent — think clever roast, not cheap insult

Your response MUST follow this EXACT format (use these exact emoji headers):

🔥 Brutal Roast:
[2–4 sentences roasting the code humorously]

⭐ Code Quality Score:
[X/10] — and one sentence justifying the score

🧠 What's Wrong:
- [Issue 1 — technically specific]
- [Issue 2 — technically specific]
- [Issue 3 — technically specific]
(Add more if warranted. Minimum 2.)

🛠 How To Fix:
- [Concrete fix 1]
- [Concrete fix 2]
(Include a short code snippet if it meaningfully illustrates the fix.)

📈 If This Was a Real PR:
[One realistic senior engineer review comment, 1–2 sentences]

💀 Savage One-Liner:
[A single meme-style roast sentence about the code]

Rules:
- Never insult the developer personally.
- Only roast the code quality.
- If the code is actually good, acknowledge it — roast lightly and be honest.
- Be technically precise. Invented issues are worse than no issues.`;

// Extract numeric score from roast text e.g. "7/10"
function parseScore(roastText: string): number | null {
  const match = roastText.match(/(\d{1,2})\/10/);
  if (!match) return null;
  const score = parseInt(match[1], 10);
  return score >= 0 && score <= 10 ? score : null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, language } = body;

    // Validate code
    if (!code || typeof code !== "string" || !code.trim()) {
      return NextResponse.json(
        { error: "Code is required." },
        { status: 400 }
      );
    }

    if (code.length > MAX_CODE_LENGTH) {
      return NextResponse.json(
        { error: `Code must be ${MAX_CODE_LENGTH.toLocaleString()} characters or fewer.` },
        { status: 400 }
      );
    }

    // Validate language
    if (!language || !SUPPORTED_LANGUAGES.includes(language)) {
      return NextResponse.json(
        { error: `Unsupported language. Supported: ${SUPPORTED_LANGUAGES.join(", ")}.` },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: `Please roast the following ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\``,
        },
      ],
      temperature: 0.85,
      max_tokens: 1200,
    });

    const roastText = completion.choices[0]?.message?.content;

    if (!roastText) {
      return NextResponse.json(
        { error: "No response from AI. Try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      roast: roastText,
      score: parseScore(roastText),
    });
  } catch (error: unknown) {
    console.error("[/api/roast] Error:", error);

    // Surface OpenAI-specific errors
    if (error instanceof OpenAI.APIError) {
      if (error.status === 429) {
        return NextResponse.json(
          { error: "Rate limit hit. Please wait a moment and try again." },
          { status: 429 }
        );
      }
      if (error.status === 401) {
        return NextResponse.json(
          { error: "API key invalid or missing." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
