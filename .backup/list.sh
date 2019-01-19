#!/usr/bin/env sh

CLOUD='db' # dropbox

rc lsf "$CLOUD":patients-backup | cut -d'/' -f1 | sort
