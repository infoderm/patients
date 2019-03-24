#!/usr/bin/env sh

set -o xtrace

SERVER='meteorapp@dermatodoc.be'
CLOUD='db' # dropbox
IDENTITY="$HOME/.ssh/meteorapp"
CRYPTO="-pbkdf2"
KEY="file:key/patients"

function onserver {
  ssh -i "$IDENTITY" "$SERVER" "$@"
}

function load {
  rsync -e "ssh -i $IDENTITY" -a "$@"
}

cd "$(dirname "$0")"
onserver rm -rf dump/patients patients.gz patients.gz.enc || exit 1
onserver mongodump --db patients || exit 1
onserver tar czf patients.gz dump/patients || exit 1
onserver openssl enc $CRYPTO -in patients.gz -out patients.gz.enc -pass $KEY || exit 1
load "$SERVER":patients.gz.enc patients-backup.gz.enc || exit 1
rc copy patients-backup.gz.enc "$CLOUD":patients-backup/"$(date '+%Y-%m-%d_%H:%M:%S')"

if [ "$?" -eq 0 ] ; then
  echo 'SUCCESS!!'
else
  echo 'FAILURE...'
fi
