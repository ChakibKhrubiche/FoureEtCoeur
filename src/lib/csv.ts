/** Échappe une valeur pour le format CSV (RFC 4180). */
function escapeCell(value: unknown): string {
  const s = value == null ? "" : String(value);
  if (/[",\n;]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

/** Construit une chaîne CSV à partir d'en-têtes et de lignes. */
export function toCsv(headers: string[], rows: unknown[][]): string {
  const lines = [headers.map(escapeCell).join(";")];
  for (const row of rows) {
    lines.push(row.map(escapeCell).join(";"));
  }
  // BOM pour qu'Excel reconnaisse l'UTF-8.
  return "﻿" + lines.join("\r\n");
}

/** Réponse HTTP de téléchargement CSV. */
export function csvResponse(filename: string, csv: string): Response {
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
