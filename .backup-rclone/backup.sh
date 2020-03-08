#!/usr/bin/env sh

set -o xtrace

DB="patients"
SERVER='meteorapp@dermatodoc.local'
CLOUD='db' # dropbox
IDENTITY="$HOME/.ssh/meteorapp"
#CRYPTO="-pbkdf2"
#KEY="file:key/patients"
KEYFILE="key/${DB}.txt"
PUBKEY="$(grep 'public key' "$KEYFILE" | cut -d' ' -f4)"
DUMP="dump/${DB}"
BACKUP="backup/${DB}"
ARCHIVE="${DB}.gz"
#ENCRYPTED="${DB}.gz.enc"
ENCRYPTED="${DB}.gz.age"

function onserver {
  ssh -i "$IDENTITY" "$SERVER" "$@"
}

function load {
  rsync -e "ssh -i $IDENTITY" -a "$@"
}

cd "$(dirname "$0")"
onserver rm -rf "$DUMP" "$ARCHIVE" "$ENCRYPTED" || exit 1
onserver mongodump --db "$DB" || exit 1
onserver tar czf "$ARCHIVE" "$DUMP" || exit 1
#onserver openssl enc $CRYPTO -in patients.gz -out patients.gz.enc -pass $KEY || exit 1
onserver age -r "$PUBKEY" -o "$ENCRYPTED" "$ARCHIVE" || exit 1
load "$SERVER":"$ENCRYPTED" "$ENCRYPTED" || exit 1
rc copy "$ENCRYPTED" "$CLOUD":"$BACKUP"/"$(date '+%Y-%m-%d_%H:%M:%S')"

if [ "$?" -eq 0 ] ; then
  echo 'SUCCESS!!'
else
  echo 'FAILURE...'
fi
