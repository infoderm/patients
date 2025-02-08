#!/usr/bin/env bash

export CRONJOB_SCHEDULE="${BACKUP_SCHEDULE}"

exec bash /cronjob "${BACKUP_CMD}"
