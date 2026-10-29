# Inventario laboratorio ITS — repository di partenza (prova di recupero)

Questo repository **funziona già**: si installa, passa i test e costruisce il sito.
Quello che manca è l'**automazione**. La costruisci tu durante la prova.

## Prova che funziona (fallo per primo, 2 minuti)

```bash
npm ci                                        # installa esattamente le dipendenze del lockfile (zero dipendenze esterne)
npm test                                      # 5 test, devono passare tutti
npm run build                                 # genera dist/index.html + dist/style.css + dist/stato.json
node script/valida-dati.mjs data/dispositivi.json   # "dati validi: 6 dispositivi"
```

Apri `dist/index.html` nel browser: vedi l'inventario con 6 dispositivi e il riepilogo per stato.
Se qualcosa non funziona **dillo subito al docente**: non è parte della prova.

## Cosa c'è dentro

| Percorso | A cosa serve |
|---|---|
| `data/dispositivi.json` | i dati: codice, tipo, modello, stato, data di aggiornamento |
| `src/build.mjs` | il generatore: legge il JSON e scrive `dist/` |
| `test/inventario.test.mjs` | 5 test sul contenuto e sulla pagina generata |
| `site/style.css` | il foglio di stile, copiato in `dist/` dalla build |
| `script/sniffa-segreti.sh` | cerca credenziali finite nel repo; esce con 1 se ne trova |
| `script/valida-dati.mjs` | controlla le regole dell'inventario; esce con 1 se una è violata |
| `.github/workflows/ci.yml` | **da completare** — i gate sulla pull request |
| `.github/workflows/release.yml` | **da completare** — pubblicazione, approvazione, rollback |

Stati ammessi per un dispositivo: `disponibile`, `in prestito`, `guasto`.
Codici nel formato `LAB-` seguito da 3 cifre. Date nel formato `AAAA-MM-GG`.

## Come si lavora

I due workflow sono **incompleti**: cerca i commenti `# TODO n` (sono 10).
Ogni TODO corrisponde a una voce della griglia di valutazione, quindi vale punti da solo:
anche se non li finisci tutti, quelli fatti valgono.

Consiglio: **un TODO alla volta**, commit, e guarda la tab *Actions*.
Un job rosso ti dice la riga esatta. Non completare tutto e poi sperare.

## Regole

- Repository **pubblico** (senza, gli *environment* con approvazione non si possono creare).
- Puoi consultare i tuoi appunti, il deck delle lezioni e la documentazione ufficiale di GitHub.
- Non copiare workflow da repository di altri: i nomi di questa prova sono diversi
  (artefatto, input, environment, cartelle) e un copia-incolla non funziona.
