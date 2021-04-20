#!/usr/bin/env bash

set -o xtrace
set -o pipefail

DB="patients"
KEYFILE="key/${DB}.txt"
PUBKEY="$(grep 'public key' "$KEYFILE" | cut -d' ' -f4)"
BACKUP="backup/${DB}"
ENCRYPTED="${DB}.gz.age"

cd "$HOME" || exit 1
rm -f "$ENCRYPTED" || exit 2
docker exec mongodb mongodump --db "$DB" --archive --gzip |
  age -r "$PUBKEY" -o "$ENCRYPTED" || exit 3
cp -l "$ENCRYPTED" "$BACKUP"/"$(date '+%Y-%m-%d_%H:%M:%S')"

if [ "$?" -eq 0 ] ; then
  echo 'SUCCESS!!'
else
  echo 'FAILURE...'
fi
