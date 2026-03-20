import { downloadPdfDocument } from "./pdfmake";

const programTitle =
  "Дополнительная общеразвивающая программа физкультурно-спортивной направленности «Футбол»";

const programInfoRows = [
  ["Наименование программы", programTitle],
  ["Возраст обучающихся", "3-7 лет"],
  ["Форма обучения", "Очная"],
  ["Составители программы", "Бондаренко А.Ю. (лицензия «С»), Окунев И.Н. (лицензия «С» UEFA)"],
];

const calendarRows = [
  ["Учебный период", "36 учебных недель (сентябрь - май)"],
  ["Частота занятий", "2 раза в неделю"],
  ["Общее количество занятий", "72 занятия в год"],
  ["Контрольные занятия", "2 занятия (декабрь, май)"],
];

const sanpinRows = [
  ["3-4 года", "до 15 минут", "до 10 человек"],
  ["4-5 лет", "до 20 минут", "до 10 человек"],
  ["5-6 лет", "до 25 минут", "до 10 человек"],
  ["6-7 лет", "до 30 минут", "до 10 человек"],
];

const programSections = [
  {
    title: "ОФП",
    subtitle: "Общая физическая подготовка",
    items: ["Развитие координации", "Укрепление мышц", "Развитие выносливости"],
  },
  {
    title: "СФП",
    subtitle: "Специальная физическая подготовка",
    items: ["Футбольная ловкость", "Скоростные качества", "Работа с мячом"],
  },
  {
    title: "ТТМ",
    subtitle: "Технико-тактическое мастерство",
    items: ["Техника владения мячом", "Игровое мышление", "Взаимодействие в команде"],
  },
];

function createTwoColumnTable(rows: string[][]) {
  return {
    table: {
      widths: ["36%", "*"],
      body: rows.map(([label, value]) => [
        { text: label, style: "tableLabel" },
        { text: value, style: "tableValue" },
      ]),
    },
    layout: {
      hLineColor: () => "#d1d5db",
      vLineColor: () => "#d1d5db",
      fillColor: (rowIndex: number, columnIndex: number) =>
        columnIndex === 0 ? "#f9fafb" : rowIndex % 2 === 1 ? "#fcfcfd" : null,
      paddingLeft: () => 10,
      paddingRight: () => 10,
      paddingTop: () => 10,
      paddingBottom: () => 10,
    },
    margin: [0, 0, 0, 16],
  };
}

function createSanpinTable() {
  return {
    table: {
      headerRows: 1,
      widths: ["34%", "34%", "*"],
      body: [
        [
          { text: "Возрастная группа", style: "tableHeader" },
          { text: "Максимальная продолжительность", style: "tableHeader" },
          { text: "Наполняемость группы", style: "tableHeader" },
        ],
        ...sanpinRows.map(([age, duration, capacity]) => [
          { text: age, style: "tableValue" },
          { text: duration, style: "tableValueStrong" },
          { text: capacity, style: "tableValue" },
        ]),
      ],
    },
    layout: {
      hLineColor: () => "#d1d5db",
      vLineColor: () => "#d1d5db",
      fillColor: (rowIndex: number) => (rowIndex === 0 ? "#7c3aed" : rowIndex % 2 === 0 ? "#faf5ff" : null),
      paddingLeft: () => 10,
      paddingRight: () => 10,
      paddingTop: () => 10,
      paddingBottom: () => 10,
    },
    margin: [0, 0, 0, 16],
  };
}

function createSectionCards() {
  return {
    columns: programSections.map((section) => ({
      width: "*",
      stack: [
        { text: section.title, style: "cardTitle" },
        { text: section.subtitle, style: "cardSubtitle" },
        {
          ul: section.items.map((item) => ({
            text: item,
            style: "bulletText",
          })),
          margin: [0, 8, 0, 0],
        },
      ],
      margin: [0, 0, 0, 0],
      fillColor: "#f9fafb",
    })),
    columnGap: 12,
    margin: [0, 0, 0, 16],
  };
}

export async function downloadEducationProgramPdf() {
  const docDefinition = {
    pageSize: "A4",
    pageMargins: [40, 44, 40, 40],
    content: [
      {
        text: "Чемпион и К",
        style: "eyebrow",
      },
      {
        text: "Полная образовательная программа",
        style: "title",
      },
      {
        text: programTitle,
        style: "subtitle",
      },
      {
        text:
          "Документ содержит основные параметры программы, учебный план, санитарный регламент и ключевые разделы подготовки, размещенные в официальном разделе сайта образовательной организации.",
        style: "paragraph",
      },
      {
        text: "1. Общие сведения о программе",
        style: "section",
      },
      createTwoColumnTable(programInfoRows),
      {
        text: "2. Учебный план и календарный график",
        style: "section",
      },
      createTwoColumnTable(calendarRows),
      {
        text: "3. Регламент СанПиН 1.2.3685-21 (Таблица 6.6)",
        style: "section",
      },
      {
        text:
          "Продолжительность тренировок строго дифференцирована по возрастным группам в соответствии с санитарными нормами и правилами.",
        style: "note",
      },
      createSanpinTable(),
      {
        text:
          "Окончание занятий для всех возрастных групп строго до 19:00 в соответствии с требованиями СанПиН.",
        style: "paragraph",
      },
      {
        text: "4. Разделы программы",
        style: "section",
      },
      createSectionCards(),
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
        margin: [0, 0, 0, 8],
      },
      subtitle: {
        fontSize: 12,
        bold: true,
        color: "#7c3aed",
        margin: [0, 0, 0, 12],
      },
      section: {
        fontSize: 14,
        bold: true,
        color: "#7c3aed",
        margin: [0, 14, 0, 8],
      },
      paragraph: {
        fontSize: 11,
        color: "#374151",
        margin: [0, 0, 0, 10],
      },
      note: {
        fontSize: 10.5,
        color: "#6b7280",
        italics: true,
        margin: [0, 0, 0, 8],
      },
      tableHeader: {
        fontSize: 10.5,
        bold: true,
        color: "#ffffff",
      },
      tableLabel: {
        fontSize: 10.5,
        bold: true,
        color: "#111827",
      },
      tableValue: {
        fontSize: 10.5,
        color: "#374151",
      },
      tableValueStrong: {
        fontSize: 10.5,
        bold: true,
        color: "#7c3aed",
      },
      cardTitle: {
        fontSize: 13,
        bold: true,
        color: "#111827",
        margin: [10, 10, 10, 4],
      },
      cardSubtitle: {
        fontSize: 10,
        color: "#6b7280",
        margin: [10, 0, 10, 4],
      },
      bulletText: {
        fontSize: 10.5,
        color: "#374151",
      },
    },
    footer: (currentPage: number, pageCount: number) => ({
      columns: [
        {
          text: "ООО «Чемпион и К»",
          alignment: "left",
        },
        {
          text: `${currentPage} / ${pageCount}`,
          alignment: "right",
        },
      ],
      margin: [24, 0, 24, 16],
      fontSize: 9,
      color: "#9ca3af",
    }),
  };

  await downloadPdfDocument(
    docDefinition,
    "obrazovatelnaya-programma-chempion-i-k.pdf",
    "obrazovatelnaya-programma-chempion-i-k",
  );
}
