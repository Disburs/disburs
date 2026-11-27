// Generates the Disburs social kit: the logo, an X banner and a LinkedIn
// cover. Edit the COPY block below, then run:
//
//   node brand/generate.mjs
//   node brand/generate.mjs --tagline "Payroll that lands in seconds."
//
// Logos go to public/logos/ and banners to brand/banners/. Pages are drawn as HTML and
// photographed with the Chromium that Playwright already installed, so the
// fonts match the website (Playfair Display and Archivo from Google Fonts).
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

// ---------------------------------------------------------------- COPY ----
const COPY = {
  tagline: "Private payroll. Prepared by an agent, approved by you.",
  // The small line under the tagline.
  sub: "Stablecoin payroll on Stellar",
  site: "disburs.xyz",
};

// Colours from app/globals.css.
const INK = "#0E1A14";
const INK_DEEP = "#08110D";
const MINT = "#12FF80";
const WHITE = "#FFFFFF";
const SOFT = "#B7C4BC";
const RING = "#2A4F3B";

// ---------------------------------------------------------------- LOGO ----
// The mark is drawn on a 100 x 100 grid and kept inside the middle 60%, so
// the circle crop on X and LinkedIn never cuts it. One bar (the treasury) and
// payments going out from it; together they read as a D.
const mark = (fg, accent) => `
    <rect x="27" y="24" width="8" height="52" rx="4" fill="${fg}"/>
    <path d="M45 24 A26 26 0 0 1 45 76" fill="none" stroke="${accent}" stroke-width="8" stroke-linecap="round"/>
    <path d="M45 39 A11 11 0 0 1 45 61" fill="none" stroke="${accent}" stroke-width="8" stroke-linecap="round"/>`;

const THEMES = {
  ink: { bg: INK, fg: WHITE, accent: MINT },
  mint: { bg: MINT, fg: INK_DEEP, accent: INK_DEEP },
  white: { bg: WHITE, fg: INK, accent: "#07751A" },
};

function markSvg(theme = "mint", { background = true, size = 100 } = {}) {
  const t = THEMES[theme];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}">
  ${background ? `<rect width="100" height="100" fill="${t.bg}"/>` : ""}
  ${mark(t.fg, t.accent)}
</svg>`;
}

// ------------------------------------------------------------- HTML -------
const page = (w, h, body, css = "") => `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: ${w}px; height: ${h}px; overflow: hidden; }
  body { background: ${INK}; color: ${WHITE}; font-family: Archivo, -apple-system, sans-serif; position: relative; }
  .display { font-family: "Playfair Display", Georgia, serif; font-weight: 600; letter-spacing: -0.02em; }
  .mint { color: ${MINT}; }
  ${css}
</style></head><body>${body}</body></html>`;

/** The picture on the right of a banner: the Fan mark, very large, with a
 *  mint dot at the end of each payment line. */
function art(w, h, scale) {
  const cx = w - 300 * scale;
  const cy = h / 2;
  const radii = [70, 140, 210, 280, 350, 420].map((r) => r * scale);
  const rings = radii
    .map(
      (r) =>
        `<path d="M${cx} ${cy - r} A${r} ${r} 0 0 1 ${cx} ${cy + r}" fill="none" stroke="${RING}" stroke-width="${1.5 * Math.max(scale, 0.7)}"/>`,
    )
    .join("");
  // Dots sit on the rings at fixed angles (degrees from straight right).
  const dots = [
    [0, -38, 1], [1, 22, 1], [2, -12, 0.9], [2, 52, 0.55],
    [3, -47, 0.7], [3, 14, 1], [4, -20, 0.5], [4, 36, 0.8], [5, 3, 0.45],
  ]
    .map(([ring, deg, opacity]) => {
      const a = (deg * Math.PI) / 180;
      const x = cx + radii[ring] * Math.cos(a);
      const y = cy + radii[ring] * Math.sin(a);
      return `<circle cx="${x}" cy="${y}" r="${7 * scale}" fill="${MINT}" opacity="${opacity}"/>`;
    })
    .join("");
  const bar = `<rect x="${cx - 40 * scale}" y="${cy - 70 * scale}" width="${14 * scale}" height="${140 * scale}" rx="${7 * scale}" fill="${WHITE}"/>`;
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="position:absolute;inset:0">${rings}${dots}${bar}</svg>`;
}

/** X header, 1500 x 500. The profile photo covers the bottom-left corner, so
 *  the words start at x = 440. */
function xBanner(tagline) {
  return page(
    1500,
    500,
    `${art(1500, 500, 1)}
     <div class="block">
       <div class="display line">${tagline}</div>
       <div class="sub"><span class="chip">${COPY.sub}</span><span>${COPY.site}</span></div>
     </div>`,
    `.block { position: absolute; left: 440px; top: 0; height: 500px; width: 680px;
              display: flex; flex-direction: column; justify-content: center; gap: 22px; }
     .line { font-size: 68px; line-height: 1.05; text-wrap: balance; }
     .sub { display: flex; align-items: center; gap: 20px; font-size: 27px; color: ${SOFT}; margin-top: 8px; }
     .chip { background: ${MINT}; color: ${INK_DEEP}; font-weight: 600; padding: 8px 20px; border-radius: 999px; }`,
  );
}

/** How the banner and logo sit together on an X profile, on a computer and
 *  on a phone. This is a check for the eye, not a file to upload. */
function xPreview(bannerData, logoData) {
  const profile = (w, avatar, inset) => `
    <div class="p" style="width:${w}px">
      <img src="${bannerData}" style="width:${w}px;height:${w / 3}px;display:block">
      <img src="${logoData}" class="av" style="width:${avatar}px;height:${avatar}px;left:${inset}px;top:${w / 3 - avatar / 2}px">
      <div class="meta" style="padding-top:${avatar / 2 + 12}px;padding-left:${inset}px">
        <b>Disburs</b><span>@disburs</span></div>
    </div>`;
  return page(
    1100,
    420,
    `<div class="wrap">${profile(600, 134, 16)}${profile(390, 80, 14)}</div>`,
    `body { background: #1b1f1d; }
     .wrap { display: flex; gap: 50px; align-items: flex-start; padding: 30px; }
     .p { position: relative; background: #000; padding-bottom: 20px; }
     .av { position: absolute; border-radius: 50%; border: 4px solid #000; }
     .meta { display: flex; flex-direction: column; gap: 2px; font-size: 20px; }
     .meta span { color: #71767b; font-size: 15px; font-weight: 400; }`,
  );
}

/** LinkedIn company cover, 1128 x 191. The logo covers the bottom-left corner. */
function linkedinCover(tagline) {
  return page(
    1128,
    191,
    `${art(1128, 191, 0.42)}
     <div class="block">
       <div class="display line">${tagline}</div>
       <div class="sub"><span class="chip">${COPY.sub}</span><span>${COPY.site}</span></div>
     </div>`,
    `.block { position: absolute; left: 250px; top: 0; height: 191px; width: 640px;
              display: flex; flex-direction: column; justify-content: center; gap: 14px; }
     .line { font-size: 33px; line-height: 1.1; text-wrap: balance; }
     .sub { display: flex; align-items: center; gap: 12px; font-size: 14px; color: ${SOFT}; }
     .chip { background: ${MINT}; color: ${INK_DEEP}; font-weight: 600; padding: 4px 11px; border-radius: 999px; }`,
  );
}

// ------------------------------------------------------------- RUN --------
const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};
if (flag("tagline")) COPY.tagline = flag("tagline");

// Logos live with the website's other logos, so pages and emails can link to
// them. Banners are only uploaded to X and LinkedIn, so they stay in brand/.
const here = path.dirname(fileURLToPath(import.meta.url));
const LOGOS = path.join(here, "..", "public", "logos");
const BANNERS = path.join(here, "banners");
await mkdir(LOGOS, { recursive: true });
await mkdir(BANNERS, { recursive: true });

const browser = await chromium.launch();
async function shoot(html, w, h, file, scale = 1) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: scale });
  const tab = await ctx.newPage();
  await tab.setContent(html, { waitUntil: "networkidle" }).catch(() => tab.setContent(html));
  await tab.evaluate(() => document.fonts.ready);
  await tab.screenshot({ path: file });
  await ctx.close();
  console.log(`  ${path.relative(path.join(here, ".."), file)}`);
}
async function save(file, text) {
  await writeFile(file, text);
  console.log(`  ${path.relative(path.join(here, ".."), file)}`);
}

console.log("Writing:");
// The logo. Mint is the profile photo; dark and light are for other backgrounds.
for (const [theme, name] of [["mint", "disburs"], ["ink", "disburs-dark"], ["white", "disburs-light"]]) {
  await shoot(page(400, 400, markSvg(theme, { size: 400 })), 400, 400, path.join(LOGOS, `${name}.png`), 2);
  await save(path.join(LOGOS, `${name}.svg`), markSvg(theme));
}
await save(path.join(LOGOS, "disburs-mark.svg"), markSvg("ink", { background: false }));

const xFile = path.join(BANNERS, "x-banner.png");
await shoot(xBanner(COPY.tagline), 1500, 500, xFile);
await shoot(linkedinCover(COPY.tagline), 1128, 191, path.join(BANNERS, "linkedin-cover.png"), 2);

// A check for the eye: the banner and photo together on an X profile.
// Not committed (see .gitignore) and not for upload.
const data = async (f) => "data:image/png;base64," + (await readFile(f)).toString("base64");
await shoot(
  xPreview(await data(xFile), await data(path.join(LOGOS, "disburs.png"))),
  1100, 420, path.join(here, "preview-x.png"), 2,
);

await browser.close();
console.log("Done.");
