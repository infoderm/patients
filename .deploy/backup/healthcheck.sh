#!/usr/bin/env bash

export CRONJOB_SCHEDULE="${BACKUP_SCHEDULE}"
export CRONJOB_INTERVAL="${BACKUP_INTERVAL}"

exec bash /cronjob-healthcheck "${BACKUP_CMD}" '+ exit 0'
