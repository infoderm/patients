#!/usr/bin/env bash

set -o xtrace

if [ "$#" -ne 1 ] ; then
  >&2 echo "$0 takes exactly 1 argument."
  >&2 echo "usage: $0 <Encrypted MongoDB archive>"
fi

ENCRYPTED="$1"
DB="patients"
SERVER='meteorapp@patients.local'
IDENTITY="${HOME}/.ssh/meteorapp"
KEYFILE="key/${DB}.txt"

ssh -i "$IDENTITY" "$SERVER" < "$ENCRYPTED" \
"age --decrypt -i '$KEYFILE' | docker exec -i mongodb mongorestore --drop --nsInclude '${DB}.*' --archive --gzip"

if [ "$?" -eq 0 ] ; then
  echo 'SUCCESS!!'
else
  echo 'FAILURE...'
fi
