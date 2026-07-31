import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, PDFFont, PDFPage, StandardFonts, rgb } from "pdf-lib";

export type FitReportInput = {
  website: string;
  finalUrl: string;
  generatedAt: string;
  cached: boolean;
  score: number | null;
  context: { sector: string; users: string; priority: string; systems: string[] };
  mobile: ReportScan;
  desktop: ReportScan;
  evidence: {
    availability: string;
    measurementStatus: string;
    analytics: Array<{ name: string; status: string; evidence: string[] }>;
    dataLayer: { present: boolean; pushCount: number; eventNames: string[] };
    consentPlatform: string | null;
    headers: Array<{ name: string; value: string; present: boolean }>;
    technologies: string[];
    notes: string[];
  };
  priorities: Array<{ title: string; why: string; evidence: string; action: string; priority: string }>;
};

type ReportFinding = { title: string; detail: string | null };
type ReportScan = {
  scores: { performance: number | null; accessibility: number | null; bestPractices: number | null; seo: number | null };
  metrics: Record<string, string | null>;
  fieldData: Record<string, { percentile: number; category: string | null } | null>;
  opportunities: ReportFinding[];
  diagnostics: ReportFinding[];
  passedChecks: ReportFinding[];
};

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const MARGIN = 24;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const BRAND = rgb(226 / 255, 30 / 255, 16 / 255);
const LOGO_RED = rgb(191 / 255, 25 / 255, 0);
const INK = rgb(21 / 255, 20 / 255, 18 / 255);
const MUTED = rgb(87 / 255, 82 / 255, 77 / 255);
const BACKGROUND = rgb(242 / 255, 238 / 255, 230 / 255);
const SURFACE = rgb(1, 253 / 255, 250 / 255);
const LINE = rgb(200 / 255, 192 / 255, 181 / 255);
const LIGHT_RED = rgb(1, 240 / 255, 237 / 255);

const CRIB_LOGO_PATHS = [
  "M401.17,0l-1.5,186.82h119.38l34.52-34.41.74-38.81-17.71-18.32,17.71-19.05.18-42.73L522.05,0h-120.88ZM446.62,47.95h53.45c.78,0,12.48,7.71,12.47,8.49l-12.47,13.49h-53.45v-21.98ZM500.07,140.86h-52.95l-1.28-1.5c-.03-.41.78-.75.78-1v-19.48h56.44l10.48,10.47-13.48,11.51Z",
  "M327.54,90.21v-53.54L291.28,0h-119.38v186.82h45.96v-71.93l71.43,71.93h38.46v-35.47l-29.95-30.97,29.75-30.18ZM267.3,79.92h-49.45v-31.97h50.45l15.47,15.48-16.47,16.48Z",
  "M158.21,130.05l-70.33.07-23.27,17.37c-.8.6-2.39.56-2.39-.57v-16.87c-.55-.86-13.22-.04-15.4-.39-.89-.14-1.55-.54-1.86-1.41v-49.76s.75-1.07.75-1.07l55.8-41.82c.99-.89,2.09-.89,3.08,0l54.51,40.95-.18-13.62V0H42.52L1.01,40.41l-1.01,3.99.27,99.76,41.25,42.66h118.38v-46.95l-.13-10.33c-.47.3-1.02.48-1.56.52Z",
  "M341.23,0L339.73,1.5V186.82H387.68V1.5L386.18,0Z",
];

type Fonts = { display: PDFFont; body: PDFFont; bold: PDFFont; mono: PDFFont };

function clean(value: string) {
  return value.normalize("NFKD").replace(/[\u2013\u2014]/g, "-").replace(/[\u2018\u2019]/g, "'").replace(/[\u201c\u201d]/g, '"').replace(/[^\x20-\x7E]/g, "").replace(/\s+/g, " ").trim();
}

function wrap(value: string, font: PDFFont, size: number, width: number) {
  const words = clean(value).split(" ").filter(Boolean);
  if (!words.length) return [""];
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (!current || font.widthOfTextAtSize(candidate, size) <= width) current = candidate;
    else { lines.push(current); current = word; }
  }
  if (current) lines.push(current);
  return lines;
}

function drawTextTop(page: PDFPage, value: string, x: number, top: number, size: number, font: PDFFont, color = INK) {
  page.drawText(clean(value), { x, y: PAGE_HEIGHT - top - size, size, font, color });
}

function drawWrapped(page: PDFPage, value: string, x: number, top: number, width: number, size: number, font: PDFFont, color = INK, leading = size + 1.5) {
  for (const row of wrap(value, font, size, width)) {
    drawTextTop(page, row, x, top, size, font, color);
    top += leading;
  }
  return top;
}

function drawRectTop(page: PDFPage, x: number, top: number, width: number, height: number, color = SURFACE, borderColor?: typeof LINE, shadow = false) {
  if (shadow) page.drawRectangle({ x: x + 3, y: PAGE_HEIGHT - top - height - 3, width, height, color: INK });
  page.drawRectangle({ x, y: PAGE_HEIGHT - top - height, width, height, color, borderColor, borderWidth: borderColor ? 0.7 : 0 });
}

function drawLineTop(page: PDFPage, x1: number, x2: number, top: number, color = LINE, thickness = 0.7) {
  page.drawLine({ start: { x: x1, y: PAGE_HEIGHT - top }, end: { x: x2, y: PAGE_HEIGHT - top }, thickness, color });
}

function sectionHeader(page: PDFPage, label: string, x: number, top: number, width: number, fonts: Fonts) {
  drawTextTop(page, label.toUpperCase(), x, top, 10, fonts.display, INK);
  drawLineTop(page, x, x + width, top + 12, BRAND, 1.4);
  return top + 18;
}

function humanize(value: string) {
  return value.replace(/([A-Z])/g, " $1").replaceAll("_", " ").trim();
}

function drawKeyValue(page: PDFPage, label: string, value: string, x: number, top: number, width: number, fonts: Fonts, size = 6.2) {
  drawTextTop(page, label.toUpperCase(), x, top, 5.5, fonts.mono, MUTED);
  return drawWrapped(page, value, x + 78, top, width - 78, size, fonts.body, INK, size + 1.2) + 1;
}

function measureFindingHeight(findings: ReportFinding[], width: number, size: number, fonts: Fonts) {
  return findings.reduce((height, finding) => {
    const titleLines = wrap(finding.title, fonts.bold, size, width - 18).length;
    const detailLines = finding.detail ? wrap(finding.detail, fonts.body, size - 0.5, width - 18).length : 0;
    return height + titleLines * (size + 1.1) + detailLines * size + 4;
  }, 0);
}

function drawFindingColumn(page: PDFPage, label: string, findings: ReportFinding[], x: number, top: number, width: number, height: number, fonts: Fonts) {
  let y = sectionHeader(page, label, x, top, width, fonts);
  if (!findings.length) {
    drawTextTop(page, "No findings returned.", x, y, 5.5, fonts.body, MUTED);
    return;
  }
  const available = height - (y - top);
  let size = 6.7;
  while (size > 5.2 && measureFindingHeight(findings, width, size, fonts) > available) size -= 0.2;
  const measured = measureFindingHeight(findings, width, size, fonts);
  const rowGap = Math.max(3, 3 + (available - measured) / findings.length);
  findings.forEach((finding, index) => {
    drawTextTop(page, String(index + 1).padStart(2, "0"), x, y, size - 0.5, fonts.mono, BRAND);
    y = drawWrapped(page, finding.title, x + 18, y, width - 18, size, fonts.bold, INK, size + 1.1);
    if (finding.detail) y = drawWrapped(page, finding.detail, x + 18, y, width - 18, size - 0.5, fonts.body, MUTED, size);
    y += rowGap;
  });
}

function drawPriorityCard(page: PDFPage, item: FitReportInput["priorities"][number], index: number, x: number, top: number, width: number, height: number, fonts: Fonts) {
  drawRectTop(page, x, top, width, height, SURFACE, LINE, true);
  drawTextTop(page, `0${index + 1} / ${item.priority.toUpperCase()}`, x + 9, top + 8, 5.4, fonts.mono, BRAND);
  let y = drawWrapped(page, item.title, x + 9, top + 20, width - 18, 10, fonts.display, INK, 10.7);
  const blocks = [`WHY: ${item.why}`, `EVIDENCE: ${item.evidence}`, `NEXT: ${item.action}`];
  let size = 6;
  const remaining = top + height - y - 7;
  const needed = () => blocks.reduce((sum, block) => sum + wrap(block, fonts.body, size, width - 18).length * (size + 0.9) + 1, 0);
  while (size > 5.4 && needed() > remaining) size -= 0.2;
  blocks.forEach((block, blockIndex) => {
    y = drawWrapped(page, block, x + 9, y + 1, width - 18, size, blockIndex === 2 ? fonts.mono : fonts.body, blockIndex === 2 ? BRAND : MUTED, size + 0.9);
  });
}

async function loadBebas(fontBytes?: Uint8Array) {
  if (fontBytes) return fontBytes;
  const response = await fetch("/fonts/BebasNeue-Regular.ttf");
  if (!response.ok) throw new Error("The Bebas Neue PDF font could not be loaded.");
  return new Uint8Array(await response.arrayBuffer());
}

export async function createFitReportPdf(input: FitReportInput, fontBytes?: Uint8Array) {
  const document = await PDFDocument.create();
  document.registerFontkit(fontkit);
  const [display, body, bold, mono] = await Promise.all([
    document.embedFont(await loadBebas(fontBytes), { subset: true }),
    document.embedFont(StandardFonts.Helvetica),
    document.embedFont(StandardFonts.HelveticaBold),
    document.embedFont(StandardFonts.Courier),
  ]);
  const fonts: Fonts = { display, body, bold, mono };
  const page = document.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  drawRectTop(page, 0, 0, PAGE_WIDTH, PAGE_HEIGHT, BACKGROUND);

  CRIB_LOGO_PATHS.forEach((path) => page.drawSvgPath(path, { x: MARGIN, y: 768, scale: 0.115, color: LOGO_RED }));
  drawTextTop(page, "GOOGLE PAGESPEED INSIGHTS / COMPLETE SCAN", 366, 25, 5.4, mono, MUTED);
  drawLineTop(page, 0, PAGE_WIDTH, 52, BRAND, 2);

  drawTextTop(page, "SITE PERFORMANCE REPORT", MARGIN, 63, 26, display, INK);
  drawTextTop(page, clean(input.finalUrl || input.website), MARGIN, 91, 6.2, body, MUTED);
  drawTextTop(page, `GENERATED ${input.generatedAt.toUpperCase()} / ${input.cached ? "CACHED" : "FRESH"} SCAN`, MARGIN, 102, 4.8, mono, MUTED);

  drawRectTop(page, MARGIN, 116, 96, 66, BRAND, undefined, true);
  drawTextTop(page, "COMBINED SITE SCORE", MARGIN + 10, 126, 5, mono, LIGHT_RED);
  drawTextTop(page, input.score === null ? "-" : String(input.score), MARGIN + 10, 137, 36, display, SURFACE);
  drawTextTop(page, "/ 100", MARGIN + 60, 158, 6, mono, LIGHT_RED);
  drawWrapped(page, "Equal-weight average of every available mobile and desktop Lighthouse score across performance, accessibility, best practices, and SEO.", 134, 121, 153, 6.1, body, MUTED, 8);
  drawTextTop(page, "HIGHER IS BETTER", 134, 162, 5, mono, BRAND);
  drawTextTop(page, "This does not grade the business or determine CRIB fit.", 134, 172, 4.9, body, MUTED);

  const scoreWidth = 70;
  const scoreStart = 304;
  const scoreKeys = ["performance", "accessibility", "bestPractices", "seo"] as const;
  const scoreGroups: Array<[string, ReportScan["scores"]]> = [["MOBILE", input.mobile.scores], ["DESKTOP", input.desktop.scores]];
  scoreGroups.forEach(([label, scores], row) => {
    const top = 116 + row * 35;
    scoreKeys.forEach((key, index) => {
      const x = scoreStart + index * (scoreWidth + 4);
      drawRectTop(page, x, top, scoreWidth, 31, SURFACE, LINE, true);
      drawTextTop(page, key === "bestPractices" ? "BEST PRACTICES" : key.toUpperCase(), x + 6, top + 6, 4.4, mono, MUTED);
      drawTextTop(page, scores[key] === null ? "-" : String(scores[key]), x + 6, top + 12, 13, display, INK);
      if (index === 0) drawTextTop(page, label, x, top - 7, 4.2, mono, MUTED);
    });
  });

  const leftX = MARGIN;
  const leftWidth = 270;
  const rightX = 306;
  const rightWidth = 282;
  let y = sectionHeader(page, "Context and experience", leftX, 198, leftWidth, fonts);
  y = drawKeyValue(page, "Sector", input.context.sector, leftX, y, leftWidth, fonts);
  y = drawKeyValue(page, "Users", input.context.users, leftX, y, leftWidth, fonts);
  y = drawKeyValue(page, "Priority", input.context.priority, leftX, y, leftWidth, fonts);
  y = drawKeyValue(page, "Systems", input.context.systems.join(", ") || "None supplied", leftX, y, leftWidth, fonts);

  const metricTop = Math.max(258, y + 3);
  const halfWidth = (leftWidth - 10) / 2;
  let labY = sectionHeader(page, "Mobile lab", leftX, metricTop, halfWidth, fonts);
  Object.entries(input.mobile.metrics).forEach(([key, value]) => {
    drawTextTop(page, humanize(key).toUpperCase(), leftX, labY, 5, mono, MUTED);
    drawTextTop(page, value ?? "N/A", leftX + 92, labY, 6, bold, INK);
    labY += 9.5;
  });
  let fieldY = sectionHeader(page, "Real-user data", leftX + halfWidth + 10, metricTop, halfWidth, fonts);
  Object.entries(input.mobile.fieldData).forEach(([key, metric]) => {
    drawTextTop(page, humanize(key).toUpperCase(), leftX + halfWidth + 10, fieldY, 4.8, mono, MUTED);
    const isCls = key === "cumulativeLayoutShift";
    const formattedValue = metric ? (isCls ? (metric.percentile / 100).toFixed(3) : `${(metric.percentile / 1000).toFixed(1)} s`) : "N/A";
    const value = metric ? `${formattedValue} / ${(metric.category ?? "N/A").replaceAll("_", " ").toLowerCase()}` : "N/A";
    fieldY = drawWrapped(page, value, leftX + halfWidth + 10, fieldY + 7, halfWidth, 5.6, body, INK, 6.6) + 2;
  });

  let measurementY = sectionHeader(page, "Measurement implementation", rightX, 198, rightWidth, fonts);
  drawTextTop(page, "READINESS", rightX, measurementY, 4.2, mono, MUTED);
  drawTextTop(page, input.evidence.measurementStatus.toUpperCase(), rightX + 72, measurementY - 1, 9, display, BRAND);
  drawTextTop(page, "ANALYTICS SIGNALS", rightX, 228, 6.8, display, INK);
  drawLineTop(page, rightX, rightX + 169, 237, LINE, 0.7);
  drawTextTop(page, "RESPONSE HEADERS", rightX + 180, 228, 6.8, display, INK);
  drawLineTop(page, rightX + 180, rightX + rightWidth, 237, LINE, 0.7);
  measurementY = 242;
  const analyticsWidth = 169;
  if (input.evidence.analytics.length) {
    input.evidence.analytics.forEach((signal) => {
      drawTextTop(page, signal.name, rightX, measurementY, 5.5, bold, INK);
      drawTextTop(page, signal.status.replaceAll("_", " ").toUpperCase(), rightX + 101, measurementY, 4.1, mono, BRAND);
      measurementY = drawWrapped(page, signal.evidence.join(" / "), rightX + 8, measurementY + 7, analyticsWidth - 8, 5, body, MUTED, 5.9) + 2;
    });
  } else {
    drawTextTop(page, "No supported analytics platform observed.", rightX, measurementY, 4.8, body, MUTED);
    measurementY += 8;
  }

  let headerY = 242;
  input.evidence.headers.forEach((header) => {
    drawTextTop(page, header.name.toUpperCase(), rightX + 180, headerY, 4.6, mono, MUTED);
    drawTextTop(page, header.present ? "PRESENT" : "NOT OBSERVED", rightX + 180, headerY + 5.5, 4.2, mono, header.present ? BRAND : MUTED);
    headerY += 11.2;
  });
  const implementationTop = 310;
  const implementationGap = 4;
  const implementationWidth = (rightWidth - implementationGap * 2) / 3;
  const implementationRows = [
    ["DATALAYER", input.evidence.dataLayer.present ? `Present / ${input.evidence.dataLayer.pushCount} pushes${input.evidence.dataLayer.eventNames.length ? ` / ${input.evidence.dataLayer.eventNames.join(", ")}` : ""}` : "Not observed"],
    ["CONSENT", input.evidence.consentPlatform ?? "Not observed"],
    ["TECHNOLOGY", input.evidence.technologies.join(", ") || "Not observed"],
  ];
  implementationRows.forEach(([label, value], index) => {
    const x = rightX + index * (implementationWidth + implementationGap);
    drawRectTop(page, x, implementationTop, implementationWidth, 30, SURFACE, LINE);
    drawTextTop(page, label, x + 5, implementationTop + 4, 4.5, mono, MUTED);
    drawWrapped(page, value, x + 5, implementationTop + 11, implementationWidth - 10, 5.1, body, INK, 5.6);
  });

  drawLineTop(page, MARGIN, PAGE_WIDTH - MARGIN, 344, LINE, 0.7);
  drawWrapped(page, input.evidence.notes.join(" / "), MARGIN, 349, CONTENT_WIDTH, 5, body, MUTED, 6);

  const priorityTop = 367;
  const priorityGap = 9;
  const priorityWidth = (CONTENT_WIDTH - priorityGap * 2) / 3;
  input.priorities.slice(0, 3).forEach((item, index) => drawPriorityCard(page, item, index, MARGIN + index * (priorityWidth + priorityGap), priorityTop, priorityWidth, 123, fonts));

  const findingsTop = 506;
  const findingGap = 12;
  const findingWidth = (CONTENT_WIDTH - findingGap * 2) / 3;
  drawFindingColumn(page, "Performance opportunities", input.mobile.opportunities, MARGIN, findingsTop, findingWidth, 234, fonts);
  drawFindingColumn(page, "Technical diagnostics", input.mobile.diagnostics, MARGIN + findingWidth + findingGap, findingsTop, findingWidth, 234, fonts);
  drawFindingColumn(page, "Checks passed", input.mobile.passedChecks, MARGIN + (findingWidth + findingGap) * 2, findingsTop, findingWidth, 234, fonts);

  drawRectTop(page, MARGIN, 756, CONTENT_WIDTH, 24, INK);
  drawTextTop(page, "CRIBNETWORK.IO", MARGIN + 12, 764, 6.5, bold, SURFACE);
  drawTextTop(page, "PAGE 01 / 01", PAGE_WIDTH - 92, 764, 4.8, mono, SURFACE);
  const bytes = await document.save();
  return new Blob([Uint8Array.from(bytes)], { type: "application/pdf" });
}

export async function downloadFitReport(input: FitReportInput) {
  const blob = await createFitReportPdf(input);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `crib-site-performance-${new URL(input.website).hostname.replace(/^www\./, "")}.pdf`;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
}
