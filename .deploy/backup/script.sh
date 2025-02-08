#!/usr/bin/env bash

set -o xtrace
set -o pipefail

if [ -z "${BACKUP_KEY}" ] ; then
   >&2 printf '%s: %s\n' "${0}" 'BACKUP_KEY not set.'
  exit 1
fi

BACKUP_DIR="${1}"
MONGO_URL="${MONGO_URL:-"${2}"}"

if [ -z "${MONGO_URL}" ] ; then
   >&2 printf '%s: %s\n' "${0}" 'MONGO_URL not set.'
  exit 1
fi

DATETIME="$(date '+%Y-%m-%d_%H:%M:%S')"
DEST="${BACKUP_DIR}/${DATETIME}"

mongodump --uri "${MONGO_URL}" --archive --gzip |
  age -r "${BACKUP_KEY}" -o "${DEST}" || exit 3

if [ "$?" -eq 0 ] ; then
  echo 'SUCCESS!!'
  exit 0
else
  echo 'FAILURE...'
  exit 1
fi
