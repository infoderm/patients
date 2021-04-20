#!/usr/bin/env bash

set -o xtrace

SCRIPTS="${HOME}/.backup"
DB="patients"
BACKUP="${HOME}/backup/${DB}"

LIST="$(sh "${SCRIPTS}/list.sh")"
KEEP="$(python3 "${SCRIPTS}/keep.py" <<< "$LIST")"

DELETE="$(comm -23 <(echo "$LIST") <(echo "$KEEP"))"

for dir in $DELETE ; do
  trash-put "${BACKUP}/${dir}"
done

trash-empty 30
