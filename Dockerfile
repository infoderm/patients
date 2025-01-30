ARG DEBIAN_VERSION=11


# NOTE Build stage

FROM debian:${DEBIAN_VERSION}-slim AS build


# NOTE Install build tools

RUN apt-get update && \
  apt-get install -y curl python python3 make g++ bzip2 ca-certificates --no-install-recommends && \
  rm -rf /var/lib/apt/lists/*


# NOTE Create $USER and its $HOME

RUN useradd --create-home --shell /bin/bash --uid 1000 --user-group build
RUN chown -R build:build /home/build/


# NOTE Switch to $USER and $HOME

USER build
WORKDIR /home/build


# NOTE Install the correct version of Meteor

COPY --chown=build:build [ \
  "./.meteor/release", \
  "/home/build/src/.meteor/" \
]

RUN echo "export METEOR_LOCAL_RELEASE=$(sed -n 's/^METEOR@\([0-9][0-9]*.*\)$/\1/p' src/.meteor/release)" >> ./.env
RUN . ./.env; echo "export METEOR_EXECUTABLE_VERSION=${METEOR_LOCAL_RELEASE}" >> ./.env
RUN . ./.env; curl "https://install.meteor.com?release=${METEOR_EXECUTABLE_VERSION}" | sh

ENV PATH="/home/build/.meteor:${PATH}"


# NOTE Install the correct version of Node

RUN echo "export NODE_VERSION=$(meteor node --version | tail -c +2)" >> ./.env
RUN echo "export NPM_VERSION=$(meteor npm --version)" >> ./.env

ENV \
  NODE_ARCH="linux-x64" \
  NODE_INSTALL_PATH="/home/build/node"

RUN . ./.env; \
  mkdir -p "${NODE_INSTALL_PATH}" && \
  curl "https://static.meteor.com/dev-bundle-node-os/v${NODE_VERSION}/node-v${NODE_VERSION}-${NODE_ARCH}.tar.gz" | \
  tar -C "${NODE_INSTALL_PATH}" -xzf - "node-v${NODE_VERSION}-${NODE_ARCH}" --strip-components=1


# NOTE Install the app's dependencies

ENV \
  PUPPETEER_SKIP_DOWNLOAD="true"

COPY --chown=build:build [ \
  "./package.json", \
  "./package-lock.json", \
  "/home/build/src/" \
]

RUN cd src && \
  meteor npm clean-install


# NOTE Build app from sources

COPY --chown=build:build ./types /home/build/src/types
COPY --chown=build:build ./imports /home/build/src/imports
COPY --chown=build:build ./server /home/build/src/server
COPY --chown=build:build ./client /home/build/src/client
COPY --chown=build:build ./.meteor /home/build/src/.meteor
COPY --chown=build:build [ \
  "./tsconfig.json", \
  "/home/build/src/" \
]

RUN cd src && \
  meteor npm run build -- ../dist --directory --architecture os.linux.x86_64 --server-only

RUN cd dist/bundle/programs/server && \
  meteor npm install


FROM gcr.io/distroless/cc-debian${DEBIAN_VERSION}:nonroot

COPY --from=build --chown=nonroot:nonroot /home/build/node/bin/node /home/nonroot/node/bin/node
COPY --from=build --chown=nonroot:nonroot /home/build/dist/bundle /home/nonroot/dist
COPY --chown=nonroot:nonroot [ \
  "./scripts/healthcheck.cjs", \
  "/home/nonroot/scripts/" \
]

ENV PATH="/home/nonroot/node/bin"

ENV \
  ROOT_URL="http://localhost" \
  PORT="3000" \
  MONGO_URL="mongodb://localhost:27017/meteor" \
  MONGO_OPLOG_URL=""

EXPOSE ${PORT}

HEALTHCHECK \
  --interval=21s \
  --timeout=3s \
  --start-period=15s \
  --start-interval=5s \
  --retries=2 \
  CMD [ \
    "node", \
    "scripts/healthcheck.cjs" \
  ]

CMD [ \
  "node", \
  "dist/main.js" \
]
