#!/usr/bin/env bash

set -o xtrace

SCRIPTS="${HOME}/.backup"
CLOUD='db' # dropbox
BACKUP="${CLOUD}:${DB}-backup"

LIST="$(sh "${SCRIPTS}/list.sh")"
KEEP="$(python3 "${SCRIPTS}/keep.py" <<< "$LIST")"

DELETE="$(comm -23 <(echo "$LIST") <(echo "$KEEP"))"

for dir in $DELETE ; do
  rc purge "${BACKUP}/${dir}"
done
