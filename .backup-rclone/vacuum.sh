#!/usr/bin/env bash

set -o xtrace

CLOUD='db' # dropbox

cd "$(dirname "$0")"
LIST="$(sh list.sh)"
KEEP="$(python3 keep.py <<< "$LIST")"

DELETE="$(comm -23 <(echo "$LIST") <(echo "$KEEP"))"

for dir in $DELETE ; do
  rc purge "$CLOUD":patients-backup/"$dir"
done
