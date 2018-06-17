#!/usr/bin/env sh

set -o xtrace

SERVER='meteorapp@localhost'
CLOUD='db' # dropbox

cd "$(dirname "$0")"
ssh "$SERVER" mongodump --db patients || exit 1
rsync -a "$SERVER":dump/patients/ patients-backup/ || exit 1
rc copy patients-backup "$CLOUD":patients-backup/"$(date '+%Y-%m-%d_%H:%M:%S')"

if [ "$?" -eq 0 ] ; then
  echo 'SUCCESS!!'
else
  echo 'FAILURE...'
fi
