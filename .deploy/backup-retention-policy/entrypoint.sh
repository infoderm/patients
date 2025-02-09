#!/usr/bin/env bash

export CRONJOB_SCHEDULE="${BACKUP_RETENTION_POLICY_SCHEDULE}"

exec bash /cronjob "${BACKUP_RETENTION_POLICY_CMD}"
