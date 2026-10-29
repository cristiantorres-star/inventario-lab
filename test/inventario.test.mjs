import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { ordina, perStato, render } from "../src/build.mjs";

const dati = JSON.parse(readFileSync("data/dispositivi.json", "utf8"));

test("ogni dispositivo ha i campi obbligatori", () => {
  for (const d of dati.dispositivi) {
    for (const campo of ["codice", "tipo", "modello", "stato", "aggiornato"]) {
      assert.ok(d[campo] !== undefined, `manca ${campo} in ${d.codice}`);
    }
  }
});

test("i codici dei dispositivi sono unici", () => {
  const codici = dati.dispositivi.map((d) => d.codice);
  assert.equal(new Set(codici).size, codici.length);
});

test("ordina mette i codici in ordine crescente", () => {
  const codici = ordina(dati.dispositivi).map((d) => d.codice);
  assert.deepEqual(codici, [...codici].sort());
});

test("perStato conta tutti i dispositivi", () => {
  const somma = Object.values(perStato(dati.dispositivi)).reduce((a, b) => a + b, 0);
  assert.equal(somma, dati.dispositivi.length);
});

test("la pagina generata contiene una riga per ogni dispositivo", () => {
  const html = render(dati, "test");
  for (const d of dati.dispositivi) assert.ok(html.includes(d.codice), `manca ${d.codice}`);
});
