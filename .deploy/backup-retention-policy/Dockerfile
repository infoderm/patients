FROM alpine:3.21.3

RUN apk add --no-cache \
  dcron \
  bash \
  python3

COPY .deploy/backup-retention-policy/script.sh /script.sh
COPY .deploy/backup-retention-policy/entrypoint.sh /entrypoint.sh
COPY .deploy/backup-retention-policy/healthcheck.sh /healthcheck.sh
COPY .backup/keep.py /keep.py
COPY scripts/cronjob /cronjob
COPY scripts/cronjob-healthcheck /cronjob-healthcheck

ENV \
  NOW="" \
  BACKUP_RETENTION_POLICY_SCHEDULE="" \
  BACKUP_RETENTION_POLICY_INTERVAL="" \
  BACKUP_RETENTION_POLICY_CMD="bash /script.sh /keep.py /backups"

HEALTHCHECK \
  --interval=1h \
  --timeout=3s \
  --start-period=15s \
  --start-interval=5s \
  --retries=2 \
  CMD [ \
    "bash", \
    "/healthcheck.sh" \
  ]

CMD [ \
  "bash", \
  "/entrypoint.sh" \
]
