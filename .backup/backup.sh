#!/usr/bin/env sh

set -o xtrace

SERVER='meteorapp@localhost'
CLOUD='db' # dropbox
IDENTITY="$HOME/.ssh/meteorapp"
CRYPTO="-pbkdf2"

cd "$(dirname "$0")"
ssh -i "$IDENTITY" "$SERVER" rm -rf dump/patients patients.gz patients.gz.enc || exit 1
ssh "$SERVER" mongodump --db patients || exit 1
ssh "$SERVER" tar czf patients.gz dump/patients || exit 1
ssh "$SERVER" openssl enc $CRYPTO -in patients.gz -out patients.gz.enc -pass file:key/patients || exit 1
rsync -a "$SERVER":patients.gz.enc patients-backup.gz.enc || exit 1
rc copy patients-backup.gz.enc "$CLOUD":patients-backup/"$(date '+%Y-%m-%d_%H:%M:%S')"

if [ "$?" -eq 0 ] ; then
  echo 'SUCCESS!!'
else
  echo 'FAILURE...'
fi
