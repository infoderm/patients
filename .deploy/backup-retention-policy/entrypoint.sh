#!/usr/bin/env bash

export CRONJOB_SCHEDULE="${BACKUP_RETENTION_POLICY_SCHEDULE}"

exec bash /cronjob "bash /script.sh /keep.py /backups"
