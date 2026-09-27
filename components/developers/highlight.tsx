import type { ReactNode } from "react";

type Lang = "bash" | "ts" | "json";

/**
 * Tiny tokenizer for the three snippets on the developer page. Not a general
 * highlighter; just enough classes of token to read well on a dark card.
 */
const RULES: Record<Lang, [RegExp, string][]> = {
  bash: [
    [/^#.*$/m, "text-white/40 italic"],
    [/"[^"\n]*"|'[^'\n]*'/, "text-mint"],
    [/\b(curl|POST|GET)\b/, "text-[#C4B5FD]"],
    [/(-X|-H|-d|-b)\b/, "text-[#FDE68A]"],
    [/https?:\/\/[^\s"']+/, "text-[#93C5FD] underline underline-offset-2"],
    [/\\\n/, "text-white/40"],
  ],
  json: [
    [/^\s*#.*$/m, "text-white/40 italic"],
    [/"[^"\n]*"(?=\s*:)/, "text-[#93C5FD]"],
    [/"[^"\n]*"/, "text-mint"],
    [/\b\d+(\.\d+)?\b/, "text-[#FDE68A]"],
    [/\b(true|false|null)\b/, "text-[#C4B5FD]"],
  ],
  ts: [
    [/\/\/.*$/m, "text-white/40 italic"],
    [/"[^"\n]*"|'[^'\n]*'|`[^`]*`/, "text-mint"],
    [/\b(import|from|const|let|await|async|new|export|return|process)\b/, "text-[#C4B5FD]"],
    [/\b(console)\b/, "text-[#FDE68A]"],
    [/\b[A-Z][A-Za-z0-9]*\b/, "text-[#FDE68A]"],
    [/(?<=\.)[a-zA-Z_][\w]*(?=\()/, "text-[#93C5FD]"],
    [/\b[a-zA-Z_]\w*(?=\s*:)/, "text-[#93C5FD]"],
    [/\b\d+(\.\d+)?\b/, "text-[#FDE68A]"],
  ],
};

export function highlight(code: string, lang: Lang): ReactNode[] {
  const rules = RULES[lang];
  const out: ReactNode[] = [];
  let rest = code;
  let key = 0;
  while (rest.length) {
    let best: { idx: number; len: number; cls: string } | null = null;
    for (const [re, cls] of rules) {
      const m = re.exec(rest);
      if (m && m[0].length && (best === null || m.index < best.idx)) best = { idx: m.index, len: m[0].length, cls };
    }
    if (!best) {
      out.push(rest);
      break;
    }
    if (best.idx > 0) out.push(rest.slice(0, best.idx));
    out.push(
      <span key={key++} className={best.cls}>
        {rest.slice(best.idx, best.idx + best.len)}
      </span>,
    );
    rest = rest.slice(best.idx + best.len);
  }
  return out;
}
