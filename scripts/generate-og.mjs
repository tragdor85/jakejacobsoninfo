#!/usr/bin/env node
// Generates public/og.png (1200x630) for LinkedIn/iMessage/Slack share cards.
// Pure dev-time tooling: satori (HTML -> SVG) + @resvg/resvg-js (SVG -> PNG),
// with system fonts. Re-run `npm run og` whenever the copy changes, then commit.
import { readFileSync, writeFileSync } from "node:fs";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const arialBlack = readFileSync("/System/Library/Fonts/Supplemental/Arial Black.ttf");
const andale = readFileSync("/System/Library/Fonts/Supplemental/Andale Mono.ttf");

const fonts = [
  { name: "Arial Black", data: arialBlack, weight: 400, style: "normal" },
  { name: "Andale Mono", data: andale, weight: 400, style: "normal" },
];

const BG = "#0c0a09";
const FG = "#f5f5f4";
const MUTED = "#a8a29e";
const ACCENT = "#fbbf24";
const LINE = "#292524";

const lines = Array.from({ length: 11 }, (_, i) => 80 + i * 48)
  .map((y) => `<div style="position:absolute;left:0;right:0;top:${y}px;height:1px;background:${LINE};opacity:0.35"></div>`)
  .join("");

const html = `
<div style="width:1200px;height:630px;background:${BG};position:relative;overflow:hidden">
  ${lines}
  <div style="position:absolute;left:80px;top:120px;font-family:'Andale Mono';font-size:26px;letter-spacing:6px;color:${ACCENT}">THE WORKBENCH</div>
  <div style="position:absolute;left:80px;top:175px;font-family:'Arial Black';font-size:84px;color:${FG}">Jake B. Jacobson</div>
  <div style="position:absolute;left:80px;top:320px;font-family:'Arial Black';font-size:40px;color:${MUTED}">Cloud engineer by day.</div>
  <div style="position:absolute;left:80px;top:375px;font-family:'Arial Black';font-size:40px;color:${MUTED}">Local AI, printers, and a home lab by night.</div>
  <div style="position:absolute;left:80px;top:500px;font-family:'Andale Mono';font-size:28px;letter-spacing:3px;color:${ACCENT}">jakejacobson.info</div>
  <div style="position:absolute;right:80px;bottom:80px;width:80px;height:40px;background:${ACCENT}"></div>
</div>`;

const svg = await satori(html, { width: 1200, height: 630, fonts });
const png = new Resvg(svg, {
  fitTo: { mode: "width", value: 1200 },
  font: { fonts: [arialBlack, andale], loadSystemFonts: false, defaultFontFamily: "Arial Black" },
}).render();

writeFileSync(new URL("../public/og.png", import.meta.url), png.asPng());
console.log("wrote public/og.png");
