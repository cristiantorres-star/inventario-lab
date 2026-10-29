#!/usr/bin/env bash
# Cerca credenziali finite per sbaglio nel repository.
# Esce con 1 se trova qualcosa: cosi il gate della pipeline blocca.
set -u
CARTELLA="${1:-.}"
TROVATI=0

cerca() {
  local etichetta="$1" schema="$2"
  local esito
  esito="$(grep -rInE "$schema" "$CARTELLA" \
            --exclude-dir=.git --exclude-dir=node_modules --exclude-dir=dist \
            --exclude=sniffa-segreti.sh 2>/dev/null || true)"
  if [ -n "$esito" ]; then
    echo "SEGRETO SOSPETTO - $etichetta"
    echo "$esito" | sed 's/^/    /'
    TROVATI=1
  fi
}

cerca "chiave di accesso AWS"      'AKIA[0-9A-Z]{16}'
cerca "token GitHub"               'gh[pousr]_[A-Za-z0-9]{20,}'
cerca "chiave privata"             'BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY'
cerca "password scritta nel file"  '(password|passwd|pwd)[[:space:]]*[:=][[:space:]]*[^[:space:]"'"'"']{6,}'

if [ "$TROVATI" -eq 0 ]; then
  echo "nessun segreto trovato in $CARTELLA"
else
  echo
  echo "Togli il segreto dal codice e mettilo nei secrets del repository."
fi
exit "$TROVATI"
