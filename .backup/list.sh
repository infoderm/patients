#!/usr/bin/env sh

CLOUD='db' # dropbox

rc ls "$CLOUD":patients-backup | cut -d' ' -f3 | cut -d'/' -f1 | sort
