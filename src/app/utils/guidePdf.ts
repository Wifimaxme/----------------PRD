import { downloadPdfDocument, normalizePdfFileName } from "./pdfmake";

function buildPdfContent(markdown: string) {
  const lines = markdown.split(/\r?\n/);
  const content: Array<Record<string, unknown>> = [];
  let bulletBuffer: string[] = [];

  const flushBulletBuffer = () => {
    if (bulletBuffer.length === 0) {
      return;
    }

    content.push({
      ul: bulletBuffer.map((item) => ({
        text: item,
        style: "bulletText",
      })),
      margin: [0, 0, 0, 10],
    });
    bulletBuffer = [];
  };

  lines.forEach((rawLine) => {
    const line = rawLine.trim();

    if (!line) {
      flushBulletBuffer();
      return;
    }

    if (line.startsWith("- ")) {
      bulletBuffer.push(line.slice(2).trim());
      return;
    }

    flushBulletBuffer();

    if (line.startsWith("# ")) {
      content.push({
        text: line.slice(2).trim(),
        style: "title",
      });
      return;
    }

    if (line.startsWith("## ")) {
      content.push({
        text: line.slice(3).trim(),
        style: "section",
      });
      return;
    }

    if (/^\d+\.\s+/.test(line)) {
      content.push({
        text: line.replace(/^\d+\.\s+/, "").trim(),
        style: "section",
      });
      return;
    }

    content.push({
      text: line,
      style: "paragraph",
    });
  });

  flushBulletBuffer();

  return content;
}

export async function downloadGuidePdf(markdown: string, fileName?: string) {
  const docDefinition = {
    pageSize: "A4",
    pageMargins: [40, 44, 40, 40],
    content: [
      {
        text: "Чемпион и К",
        style: "eyebrow",
      },
      ...buildPdfContent(markdown),
    ],
    defaultStyle: {
      fontSize: 11,
      lineHeight: 1.35,
      color: "#374151",
    },
    styles: {
      eyebrow: {
        fontSize: 9,
        bold: true,
        color: "#7c3aed",
        margin: [0, 0, 0, 10],
      },
      title: {
        fontSize: 20,
        bold: true,
        color: "#111827",
        margin: [0, 0, 0, 14],
      },
      section: {
        fontSize: 14,
        bold: true,
        color: "#7c3aed",
        margin: [0, 10, 0, 8],
      },
      paragraph: {
        fontSize: 11,
        color: "#374151",
        margin: [0, 0, 0, 8],
      },
      bulletText: {
        fontSize: 11,
        color: "#374151",
      },
    },
    footer: (currentPage: number, pageCount: number) => ({
      text: `${currentPage} / ${pageCount}`,
      alignment: "right",
      margin: [0, 0, 24, 16],
      fontSize: 9,
      color: "#9ca3af",
    }),
  };

  await downloadPdfDocument(
    docDefinition,
    normalizePdfFileName(fileName, "guide-adaptation"),
    "guide-adaptation",
  );
}
