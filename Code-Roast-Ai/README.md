# 🔥 Roast My Code

> Brutally honest. Technically precise. Mildly savage.

Paste your code. Get roasted by a senior engineer AI. Grow stronger (or cry).

---

## Stack

- **Next.js 14** (App Router)
- **TypeScript** (strict mode — no `any` crimes here)
- **Tailwind CSS**
- **OpenAI API** (gpt-4o-mini)

---

## Getting Started

### 1. Clone & install

```bash
git clone https://github.com/your-username/roast-my-code
cd roast-my-code
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Then open `.env.local` and add your OpenAI API key:

```
OPENAI_API_KEY=sk-...
```

Get a key at [platform.openai.com](https://platform.openai.com).

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
app/
 ├─ page.tsx          # UI, state, API call — single-file frontend
 ├─ layout.tsx        # Root layout + font + metadata
 ├─ globals.css       # Tailwind base + custom scrollbar
 └─ api/
     └─ roast/
         └─ route.ts  # POST handler — validation, OpenAI call, error handling
```

---

## What Was Fixed vs. The MVP

| Issue | MVP | This Project |
|---|---|---|
| `err: any` | ❌ | ✅ `unknown` + type narrowing |
| Input length validation | ❌ | ✅ 10,000 char limit (frontend + backend) |
| Language validation server-side | ❌ | ✅ Allowlist enforced |
| System prompt | `...` (literally) | ✅ Full structured prompt |
| OpenAI error handling | Generic 500 | ✅ 429, 401, 502 surfaced |
| Score parsing | Missing | ✅ Extracted + visualised |
| API error surfaced to client | ❌ | ✅ `data.error` passed through |
| Keyboard shortcut (⌘+Enter) | ❌ | ✅ |
| Char counter with warning | ❌ | ✅ |

---

## Deploy to Vercel

```bash
npx vercel
```

Add `OPENAI_API_KEY` in your Vercel project's Environment Variables.

---

## License

MIT
