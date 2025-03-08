FROM alpine:3.21.3

RUN apk add --no-cache \
  dcron=4.6-r0 \
  bash=5.2.37-r0 \
  mongodb-tools=100.9.4-r7 \
  age=1.2.1-r2

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
