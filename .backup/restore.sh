#!/usr/bin/env sh

set -o xtrace

if [ "$#" -ne 1 ] ; then
  >&2 echo "$0 takes exactly 1 argument."
  >&2 echo "usage: $0 <encrypted-archive-of-backup>"
fi

BACKUP="$1"
DB="patients"
SERVER='meteorapp@patients.local'
IDENTITY="${HOME}/.ssh/meteorapp"
#CRYPTO="-pbkdf2"
#KEY="file:key/${DB}"
KEYFILE="key/${DB}.txt"
DUMP="dump/${DB}"
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
load "$BACKUP" "$SERVER":"$ENCRYPTED" || exit 1
#onserver openssl enc -d $CRYPTO -in "$ENCRYPTED" -out "$ARCHIVE" -pass $KEY || exit 1
onserver age --decrypt -i "$KEYFILE" -o "$ARCHIVE" "$ENCRYPTED" || exit 1
onserver tar xzf "$ARCHIVE" || exit 1
onserver mongorestore -d "$DB" "${DUMP}/"

if [ "$?" -eq 0 ] ; then
  echo 'SUCCESS!!'
else
  echo 'FAILURE...'
fi
