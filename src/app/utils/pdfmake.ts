type PdfMakeInstance = {
  vfs?: Record<string, string>;
  createPdf: (
    docDefinition: Record<string, unknown>,
  ) => { getBlob: (callback: (blob: Blob) => void) => void };
};

async function loadPdfMake() {
  const pdfMakeModule = await import("pdfmake/build/pdfmake");
  const pdfFontsModule = await import("pdfmake/build/vfs_fonts");

  const pdfMake = (pdfMakeModule.default || pdfMakeModule) as PdfMakeInstance;
  const pdfFonts = pdfFontsModule as {
    default?: { pdfMake?: { vfs?: Record<string, string> } };
    pdfMake?: { vfs?: Record<string, string> };
  };

  const vfs =
    pdfFonts.default?.pdfMake?.vfs || pdfFonts.pdfMake?.vfs || pdfMake.vfs;

  if (vfs) {
    pdfMake.vfs = vfs;
  }

  return pdfMake;
}

export function normalizePdfFileName(fileName?: string, fallbackName = "document") {
  const safeBaseName = String(fileName || fallbackName)
    .replace(/\.md$/i, "")
    .replace(/\.pdf$/i, "")
    .trim();

  return `${safeBaseName || fallbackName}.pdf`;
}

export async function downloadPdfDocument(
  docDefinition: Record<string, unknown>,
  fileName?: string,
  fallbackName?: string,
) {
  const pdfMake = await loadPdfMake();
  const pdfFileName = normalizePdfFileName(fileName, fallbackName);

  await new Promise<void>((resolve, reject) => {
    try {
      pdfMake.createPdf(docDefinition).getBlob((blob: Blob) => {
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = downloadUrl;
        link.download = pdfFileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(downloadUrl);
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
}
