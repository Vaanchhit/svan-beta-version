export type FeedRecord = Record<string, string>;

export function parseDelimitedFeed(text: string): FeedRecord[] {
  const delimiter = detectDelimiter(text);
  const rows = parseRows(text, delimiter).filter((row) =>
    row.some((cell) => cell.trim())
  );
  const [headerRow, ...dataRows] = rows;

  if (!headerRow) return [];

  const headers = headerRow.map((header) => normalizeHeader(header));

  return dataRows.map((row) =>
    headers.reduce<FeedRecord>((record, header, index) => {
      if (header) record[header] = row[index]?.trim() ?? "";
      return record;
    }, {})
  );
}

function detectDelimiter(text: string) {
  const firstLine = text.split(/\r?\n/, 1)[0] ?? "";
  const tabs = (firstLine.match(/\t/g) ?? []).length;
  const commas = (firstLine.match(/,/g) ?? []).length;

  return tabs > commas ? "\t" : ",";
}

function parseRows(text: string, delimiter: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"') {
      if (quoted && next === '"') {
        cell += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
      continue;
    }

    if (!quoted && char === delimiter) {
      row.push(cell);
      cell = "";
      continue;
    }

    if (!quoted && (char === "\n" || char === "\r")) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
      continue;
    }

    cell += char;
  }

  row.push(cell);
  rows.push(row);

  return rows;
}

function normalizeHeader(header: string) {
  return header
    .trim()
    .toLowerCase()
    .replace(/^\uFEFF/, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}
