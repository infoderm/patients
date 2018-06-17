#!/usr/bin/env sh

set -o xtrace

SERVER='meteorapp@localhost'

cd "$(dirname "$0")"
rsync -a patients-backup/ "$SERVER":dump/patients/ || exit 1
ssh "$SERVER" mongorestore -d patients dump/patients/

if [ "$?" -eq 0 ] ; then
  echo 'SUCCESS!!'
else
  echo 'FAILURE...'
fi
