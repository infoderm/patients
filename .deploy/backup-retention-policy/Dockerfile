FROM alpine:latest

RUN apk add --no-cache \
  dcron \
  bash \
  python3

COPY .deploy/backup-retention-policy/script.sh /script.sh
COPY .deploy/backup-retention-policy/entrypoint.sh /entrypoint.sh
COPY .backup/keep.py /keep.py
COPY scripts/cronjob /cronjob

ENV \
  NOW="" \
  BACKUP_RETENTION_POLICY_SCHEDULE="" \
  BACKUP_RETENTION_POLICY_CMD="bash /script.sh /keep.py /backups"

CMD [ \
  "bash", \
  "/entrypoint.sh" \
]
