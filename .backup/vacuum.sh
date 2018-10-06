#!/usr/bin/env bash

CLOUD='db' # dropbox

cd "$(dirname "$0")"
LIST="$(sh list.sh)"
KEEP="$(python3 keep.py <<< "$LIST")"

echo "Backup list:"
echo "$LIST"
echo "Keeping:"
echo "$KEEP"

DELETE="$(comm -23 <(echo "$LIST") <(echo "$KEEP"))"

for dir in $DELETE ; do
  echo "Deleting $dir"
  echo rc purge "$CLOUD":patients-backup/"$dir"
done
