#!/usr/bin/env bash

set -o xtrace

NOW="${NOW:-$(date +'%Y-%m-%d_%H:%M:%S')}"

KEEP_PY="${1}"
BACKUP_DIR="${2}"

ALL="$(ls "${BACKUP_DIR}" | sort)"

KEEP="$(python3 "${KEEP_PY}" "${NOW}" <<< "${ALL}")"

DELETE="$(comm -23 <(echo "${ALL}") <(echo "${KEEP}"))"

for item in ${DELETE} ; do
  rm "${BACKUP_DIR}/${item}"
done

exit 0
