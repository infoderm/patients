ARG IMAGE_BASE=debian:bullseye-slim


# NOTE Build stage

FROM $IMAGE_BASE AS build


# NOTE Install build tools

RUN apt-get update && \
  apt-get install -y curl python python3 make g++ bzip2 ca-certificates --no-install-recommends && \
  rm -rf /var/lib/apt/lists/*


# NOTE Create $USER and its $HOME

RUN useradd --create-home --shell /bin/bash --uid 1000 --user-group app
RUN chown -R app:app /home/app/


# NOTE Switch to $USER and $HOME

USER app
WORKDIR /home/app


# NOTE Install the correct version of Meteor

COPY --chown=app:app [ \
  "./.meteor/release", \
  "/home/app/src/.meteor/" \
]

RUN echo "export METEOR_LOCAL_RELEASE=$(sed -n 's/^METEOR@\([0-9][0-9]*.*\)$/\1/p' src/.meteor/release)" >> ./.env
RUN . ./.env; echo "export METEOR_EXECUTABLE_VERSION=${METEOR_LOCAL_RELEASE}" >> ./.env
RUN . ./.env; curl "https://install.meteor.com?release=${METEOR_EXECUTABLE_VERSION}" | sh

ENV PATH="/home/app/.meteor:${PATH}"


# NOTE Install the correct version of Node

RUN echo "export NODE_VERSION=$(meteor node --version | tail -c +2)" >> ./.env
RUN echo "export NPM_VERSION=$(meteor npm --version)" >> ./.env

ENV \
  NODE_ARCH="linux-x64" \
  NODE_INSTALL_PATH="/home/app/node"

RUN . ./.env; \
  mkdir -p "${NODE_INSTALL_PATH}" && \
  curl "https://static.meteor.com/dev-bundle-node-os/v${NODE_VERSION}/node-v${NODE_VERSION}-${NODE_ARCH}.tar.gz" | \
  tar -C "${NODE_INSTALL_PATH}" -xzf - "node-v${NODE_VERSION}-${NODE_ARCH}" --strip-components=1


# NOTE Install the app's dependencies

ENV \
  PUPPETEER_SKIP_DOWNLOAD="true"

COPY --chown=app:app [ \
  "./package.json", \
  "./package-lock.json", \
  "/home/app/src/" \
]

RUN cd src && \
  meteor npm clean-install


# NOTE Build app from sources

COPY --chown=app:app ./types /home/app/src/types
COPY --chown=app:app ./imports /home/app/src/imports
COPY --chown=app:app ./server /home/app/src/server
COPY --chown=app:app ./client /home/app/src/client
COPY --chown=app:app ./.meteor /home/app/src/.meteor
COPY --chown=app:app [ \
  "./tsconfig.json", \
  "/home/app/src/" \
]

RUN cd src && \
  meteor npm run build -- ../dist --directory --architecture os.linux.x86_64 --server-only

RUN cd dist/bundle/programs/server && \
  meteor npm install


# NOTE Final log step

RUN find . -maxdepth 3


FROM gcr.io/distroless/cc-debian11

COPY --from=build /etc/passwd /etc/passwd
COPY --from=build --chown=app:app /home/app/dist/bundle /home/app/dist/
COPY --from=build --chown=app:app /home/app/node/bin /home/app/node/bin/

USER app
WORKDIR /home/app

ENV PATH="/home/app/node/bin"

EXPOSE 3000

ENV \
  ROOT_URL="http://localhost" \
  PORT="3000" \
  MONGO_URL="mongodb://127.0.0.1:27017/meteor"


CMD [ \
  "node", \
  "dist/main.js" \
]
