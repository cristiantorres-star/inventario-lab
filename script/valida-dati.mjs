// Gate sui DATI: controlla le regole dell'inventario prima che arrivino in pagina.
// Uso:   node script/valida-dati.mjs data/dispositivi.json
// Esce con 1 se trova anche un solo errore: cosi' il gate della pipeline blocca.
import { readFileSync } from "node:fs";

const file = process.argv[2] ?? "data/dispositivi.json";
const STATI = ["disponibile", "in prestito", "guasto"];
const errori = [];

let dati;
try {
  dati = JSON.parse(readFileSync(file, "utf8"));
} catch (e) {
  console.error(`ERRORE - ${file} non si legge o non e' JSON valido: ${e.message}`);
  process.exit(1);
}

const visti = new Set();
for (const d of dati.dispositivi ?? []) {
  const chi = d.codice ?? "(senza codice)";
  if (!/^LAB-\d{3}$/.test(d.codice ?? "")) errori.push(`${chi}: il codice deve essere LAB- seguito da 3 cifre`);
  if (visti.has(d.codice)) errori.push(`${chi}: codice duplicato`);
  visti.add(d.codice);
  if (!STATI.includes(d.stato)) errori.push(`${chi}: stato "${d.stato}" non ammesso (ammessi: ${STATI.join(", ")})`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d.aggiornato ?? "")) errori.push(`${chi}: data "aggiornato" non nel formato AAAA-MM-GG`);
}
if (!Array.isArray(dati.dispositivi) || dati.dispositivi.length === 0) errori.push("nessun dispositivo nel file");

if (errori.length) {
  console.error(`DATI NON VALIDI - ${errori.length} errore/i in ${file}:`);
  for (const e of errori) console.error("    " + e);
  process.exit(1);
}
console.log(`dati validi: ${dati.dispositivi.length} dispositivi, nessun errore in ${file}`);
