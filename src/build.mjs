// Generatore statico dell'Inventario del laboratorio. Zero dipendenze: solo Node.
import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync } from "node:fs";
import { pathToFileURL } from "node:url";

const OUT = "dist";
export const STATI = ["disponibile", "in prestito", "guasto"];

/** Ordina per codice (LAB-101, LAB-102, ...). */
export function ordina(dispositivi) {
  return [...dispositivi].sort((a, b) => a.codice.localeCompare(b.codice));
}

/** Conta quanti dispositivi ci sono in ogni stato (anche gli stati a zero). */
export function perStato(dispositivi) {
  const conto = Object.fromEntries(STATI.map((s) => [s, 0]));
  for (const d of dispositivi) conto[d.stato] = (conto[d.stato] ?? 0) + 1;
  return conto;
}

export function render(dati, versione) {
  const elenco = ordina(dati.dispositivi);
  const conto = perStato(dati.dispositivi);
  const righe = elenco
    .map(
      (d) => `      <tr class="disp">
        <td class="cod">${d.codice}</td>
        <td>${d.tipo}</td>
        <td>${d.modello}</td>
        <td class="stato-${d.stato.replace(" ", "-")}">${d.stato}</td>
        <td>${d.aggiornato}</td>
      </tr>`
    )
    .join("\n");
  return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Inventario laboratorio - ${dati.istituto}</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header>
    <h1>Inventario laboratorio</h1>
    <p class="sub">${dati.istituto} - ${dati.laboratorio}</p>
  </header>
  <main>
    <div class="riepilogo">
      <span>Disponibili: <b>${conto["disponibile"]}</b></span>
      <span>In prestito: <b>${conto["in prestito"]}</b></span>
      <span>Guasti: <b>${conto["guasto"]}</b></span>
    </div>
    <table>
      <thead><tr><th>Codice</th><th>Tipo</th><th>Modello</th><th>Stato</th><th>Aggiornato</th></tr></thead>
      <tbody>
${righe}
      </tbody>
    </table>
  </main>
  <footer>
    <p>Dispositivi censiti: ${elenco.length} - versione <code>${versione}</code></p>
  </footer>
</body>
</html>
`;
}

function main() {
  const dati = JSON.parse(readFileSync("data/dispositivi.json", "utf8"));
  // VERSIONE la imposta la pipeline (serve per il rollback: e' la versione che si
  // sta ripubblicando, non quella dell'ultimo commit su main). In locale: "locale".
  const versione = process.env.VERSIONE || process.env.GITHUB_SHA?.slice(0, 7) || "locale";
  mkdirSync(OUT, { recursive: true });
  writeFileSync(`${OUT}/index.html`, render(dati, versione));
  writeFileSync(
    `${OUT}/stato.json`,
    JSON.stringify(
      { versione, totale: dati.dispositivi.length, perStato: perStato(dati.dispositivi) },
      null,
      2
    )
  );
  if (existsSync("site/style.css")) cpSync("site/style.css", `${OUT}/style.css`);
  console.log(`OK  ${OUT}/index.html  (${dati.dispositivi.length} dispositivi, versione ${versione})`);
}

// main() parte solo se il file e' lanciato direttamente, non quando i test lo importano.
// pathToFileURL gestisce spazi nel percorso e i backslash di Windows.
const lanciatoDirettamente =
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

if (lanciatoDirettamente) main();
