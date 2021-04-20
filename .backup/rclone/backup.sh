#!/usr/bin/env bash

set -o xtrace

DB="patients"
SERVER='meteorapp@patients.local'
CLOUD='db' # dropbox
IDENTITY="$HOME/.ssh/meteorapp"
KEYFILE="key/${DB}.txt"
PUBKEY="$(grep 'public key' "$KEYFILE" | cut -d' ' -f4)"
BACKUP="backup/${DB}"
ENCRYPTED="${DB}.gz.age"

function onserver {
  ssh -i "$IDENTITY" "$SERVER" "$@"
}

function load {
  rsync -e "ssh -i $IDENTITY" -a "$@"
}

cd "$(dirname "$0")"
onserver rm -f "$ENCRYPTED" || exit 1
onserver "docker exec mongodb mongodump --db '$DB' --archive --gzip | age -r '$PUBKEY' -o '$ENCRYPTED'" || exit 3
load "$SERVER":"$ENCRYPTED" "$ENCRYPTED" || exit 1
rc copy "$ENCRYPTED" "$CLOUD":"$BACKUP"/"$(date '+%Y-%m-%d_%H:%M:%S')"

if [ "$?" -eq 0 ] ; then
  echo 'SUCCESS!!'
else
  echo 'FAILURE...'
fi
