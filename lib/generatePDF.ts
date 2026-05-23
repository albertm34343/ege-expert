import jsPDF from "jspdf";

interface ResultData {
  topic: string;
  sourceText: string;
  essay: string;
  analysis: string;
}

// Загружаем шрифт из public/fonts/ при первом вызове
let fontBase64: string | null = null;

async function loadFont(): Promise<string> {
  if (fontBase64) return fontBase64;

  const response = await fetch("/fonts/Roboto-Regular.ttf");
  const buffer = await response.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  fontBase64 = btoa(binary);
  return fontBase64;
}

export async function generatePDF(result: ResultData) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Подгружаем и регистрируем шрифт
  const font = await loadFont();
  doc.addFileToVFS("Roboto-Regular.ttf", font);
  doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
  doc.setFont("Roboto", "normal");

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const maxWidth = pageWidth - margin * 2;
  let y = 20;

  const addText = (text: string, fontSize: number, lineHeight = 6) => {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text || "—", maxWidth);
    lines.forEach((line: string) => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, margin, y);
      y += lineHeight;
    });
  };

  // === Заголовок ===
  doc.setFontSize(18);
  doc.text("Результат проверки сочинения ЕГЭ", margin, y);
  y += 8;

  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text(
    `Дата проверки: ${new Date().toLocaleDateString("ru-RU")} ${new Date().toLocaleTimeString("ru-RU")}`,
    margin,
    y
  );
  y += 10;
  doc.setTextColor(0);

  // Разделитель
  doc.setDrawColor(180);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // === Тема ===
  doc.setFontSize(13);
  doc.text("Тема / проблема исходного текста:", margin, y);
  y += 7;
  addText(result.topic, 11);
  y += 5;

  // === Исходный текст ===
  if (y > 260) {
    doc.addPage();
    y = 20;
  }
  doc.setFontSize(13);
  doc.text("Исходный текст из варианта ЕГЭ:", margin, y);
  y += 7;
  addText(result.sourceText, 11);
  y += 5;

  // === Сочинение ===
  if (y > 260) {
    doc.addPage();
    y = 20;
  }
  doc.setFontSize(13);
  doc.text("Текст сочинения:", margin, y);
  y += 7;
  addText(result.essay, 11);
  y += 5;

  // === Анализ ===
  if (y > 260) {
    doc.addPage();
    y = 20;
  }
  doc.setFontSize(13);
  doc.text("Анализ и рекомендации:", margin, y);
  y += 7;
  addText(result.analysis, 11);

  // === Подвал ===
  if (y > 270) {
    doc.addPage();
    y = 20;
  }
  y += 10;
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(
    "ЕГЭ-Эксперт — независимый образовательный сервис. Оценки носят рекомендательный характер.",
    margin,
    y
  );

  // === Сохраняем ===
  const date = new Date().toISOString().slice(0, 10);
  doc.save(`ЕГЭ-Эксперт_проверка_${date}.pdf`);
}