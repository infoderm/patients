#!/usr/bin/env sh

set -o xtrace

DB="patients"
CRYPTO="-pbkdf2"
KEY="file:key/${DB}"
DUMP="dump/${DB}"
BACKUP="backup/${DB}"
ARCHIVE="${DB}.gz"
ENCRYPTED="${DB}.gz.enc"

cd "$HOME"
rm -rf "$DUMP" "$ARCHIVE" "$ENCRYPTED" || exit 1
mongodump --db "$DB" || exit 1
tar czf "$ARCHIVE" "$DUMP" || exit 1
openssl enc $CRYPTO -in "$ARCHIVE" -out "$ENCRYPTED" -pass $KEY || exit 1
cp "$ENCRYPTED" "$BACKUP"/"$(date '+%Y-%m-%d_%H:%M:%S')"

if [ "$?" -eq 0 ] ; then
  echo 'SUCCESS!!'
else
  echo 'FAILURE...'
fi
