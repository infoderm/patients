#!/usr/bin/env sh

set -o xtrace

SERVER='meteorapp@localhost'
IDENTITY="$HOME/.ssh/meteorapp"
CRYPTO="-pbkdf2"

function onserver {
  ssh -i "$IDENTITY" "$SERVER" "$@"
}

cd "$(dirname "$0")"
onserver rm -rf dump/patients patients.gz patients.gz.enc || exit 1
rsync -e "ssh -i $IDENTITY" -a patients-backup.gz.enc "$SERVER":patients.gz.enc || exit 1
onserver openssl enc -d $CRYPTO -in patients.gz.enc -out patients.gz -pass file:key/patients || exit 1
onserver tar xzf patients.gz || exit 1
onserver mongorestore -d patients dump/patients/

if [ "$?" -eq 0 ] ; then
  echo 'SUCCESS!!'
else
  echo 'FAILURE...'
fi
