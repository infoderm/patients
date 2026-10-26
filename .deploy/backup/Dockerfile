FROM alpine:3.24.3

RUN apk add --no-cache \
  dcron=4.6-r0 \
  bash=5.3.9-r1 \
  mongodb-tools=100.14.1-r5 \
  age=1.3.2-r1

COPY .deploy/backup/entrypoint.sh /entrypoint.sh
COPY .deploy/backup/healthcheck.sh /healthcheck.sh
COPY .deploy/backup/script.sh /script.sh
COPY scripts/cronjob /cronjob
COPY scripts/cronjob-healthcheck /cronjob-healthcheck

ENV \
  MONGO_URL="" \
  BACKUP_SCHEDULE="" \
  BACKUP_INTERVAL="" \
  BACKUP_CMD="bash /script.sh /backups" \
  BACKUP_KEY=""

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
