FROM alpine:latest

RUN apk add --no-cache \
  dcron \
  bash \
  mongodb-tools \
  age

COPY .deploy/backup/entrypoint.sh /entrypoint.sh
COPY .deploy/backup/script.sh /script.sh
COPY scripts/cronjob /cronjob

ENV \
  MONGO_URL="" \
  BACKUP_SCHEDULE="" \
  BACKUP_CMD="bash /script.sh /backups" \
  BACKUP_KEY=""

CMD [ \
  "bash", \
  "/entrypoint.sh" \
]
