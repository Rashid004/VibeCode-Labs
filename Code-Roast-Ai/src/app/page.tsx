"use client";

import { useState, useRef } from "react";

const SUPPORTED_LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "rust", label: "Rust" },
  { value: "go", label: "Go" },
  { value: "php", label: "PHP" },
];

const MAX_CODE_LENGTH = 10_000;

type RoastResponse = {
  roast: string;
  score: number | null;
};

export default function RoastMyCode() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [roast, setRoast] = useState<RoastResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const outputRef = useRef<HTMLDivElement>(null);

  const charCount = code.length;
  const isOverLimit = charCount > MAX_CODE_LENGTH;

  const handleRoast = async () => {
    if (!code.trim()) {
      setError("Paste some code first. Even bad code counts.");
      return;
    }
    if (isOverLimit) {
      setError(`Code exceeds ${MAX_CODE_LENGTH.toLocaleString()} character limit.`);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setRoast(null);

      const response = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to roast code.");
      }

      setRoast(data);

      setTimeout(() => {
        outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      handleRoast();
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white font-mono">
      {/* Noise texture overlay */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03] z-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-4xl mx-auto px-6 py-16 space-y-10">

        {/* Header */}
        <header className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🔥</span>
            <h1 className="text-4xl font-black tracking-tighter text-white">
              ROAST MY CODE
            </h1>
          </div>
          <p className="text-gray-500 text-sm tracking-widest uppercase">
            Brutally honest. Technically precise. Mildly savage.
          </p>
          <div className="h-px bg-gradient-to-r from-red-600 via-orange-500 to-transparent mt-4" />
        </header>

        {/* Controls */}
        <section className="space-y-4">
          {/* Language selector */}
          <div className="flex items-center gap-4">
            <label className="text-xs text-gray-500 uppercase tracking-widest shrink-0">
              Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-[#111] border border-gray-800 text-white text-sm px-3 py-2 rounded-md focus:outline-none focus:border-red-600 transition-colors cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          {/* Code input */}
          <div className="relative">
            <div className="absolute top-3 left-4 flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="// Paste your disaster here..."
              maxLength={MAX_CODE_LENGTH + 500}
              className="w-full h-72 bg-[#111] border border-gray-800 text-gray-200 text-sm p-4 pt-10 rounded-lg resize-none focus:outline-none focus:border-red-600 transition-colors placeholder:text-gray-700 leading-relaxed"
              spellCheck={false}
            />

            {/* Char counter */}
            <div
              className={`absolute bottom-3 right-4 text-xs tabular-nums transition-colors ${
                isOverLimit
                  ? "text-red-500 font-bold"
                  : charCount > MAX_CODE_LENGTH * 0.85
                  ? "text-yellow-500"
                  : "text-gray-700"
              }`}
            >
              {charCount.toLocaleString()} / {MAX_CODE_LENGTH.toLocaleString()}
            </div>
          </div>

          {/* Hint */}
          <p className="text-xs text-gray-700">
            ⌘ + Enter to roast
          </p>

          {/* Submit */}
          <button
            onClick={handleRoast}
            disabled={loading || isOverLimit}
            className="relative overflow-hidden bg-red-600 hover:bg-red-500 disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed text-white font-bold px-8 py-3 rounded-md text-sm uppercase tracking-widest transition-all duration-200 group"
          >
            <span className="relative z-10">
              {loading ? "Analyzing your disaster..." : "Roast My Code 🔥"}
            </span>
            {/* Shine effect */}
            {!loading && (
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            )}
          </button>
        </section>

        {/* Error */}
        {error && (
          <div className="border border-red-900 bg-red-950/30 text-red-400 px-4 py-3 rounded-md text-sm flex gap-2 items-start">
            <span className="shrink-0">⚠</span>
            <span>{error}</span>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-3 animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-3 bg-gray-800 rounded"
                style={{ width: `${70 + Math.random() * 30}%` }}
              />
            ))}
          </div>
        )}

        {/* Roast output */}
        {roast && !loading && (
          <div ref={outputRef} className="space-y-6">
            <div className="h-px bg-gradient-to-r from-red-600 via-orange-500 to-transparent" />

            {/* Score badge */}
            {roast.score !== null && (
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-500 uppercase tracking-widest">Quality Score</span>
                <div className="flex items-baseline gap-1">
                  <span
                    className={`text-4xl font-black tabular-nums ${
                      roast.score >= 7
                        ? "text-green-400"
                        : roast.score >= 4
                        ? "text-yellow-400"
                        : "text-red-500"
                    }`}
                  >
                    {roast.score}
                  </span>
                  <span className="text-gray-600 text-xl">/10</span>
                </div>
                <div className="flex-1 h-1.5 bg-gray-900 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      roast.score >= 7
                        ? "bg-green-400"
                        : roast.score >= 4
                        ? "bg-yellow-400"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${roast.score * 10}%` }}
                  />
                </div>
              </div>
            )}

            {/* Roast text */}
            <div className="bg-[#111] border border-gray-800 rounded-lg p-6">
              <pre className="whitespace-pre-wrap text-sm text-gray-300 leading-relaxed font-mono">
                {roast.roast}
              </pre>
            </div>

            {/* Retry */}
            <button
              onClick={() => { setRoast(null); setCode(""); }}
              className="text-xs text-gray-600 hover:text-gray-400 transition-colors uppercase tracking-widest"
            >
              ↩ Roast another piece of code
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
