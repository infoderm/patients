ARG DEBIAN_VERSION=11
ARG PORT=3000


# NOTE Build stage

FROM docker.io/debian:${DEBIAN_VERSION}-slim AS build

# SEE: https://github.com/hadolint/hadolint/wiki/DL4006.
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

# NOTE Install build tools

RUN apt-get update && apt-get install -y --no-install-recommends \
  curl=7.74.0-1.3+deb11u15 \
  python3=3.9.2-3 \
  make=4.3-4.1 \
  g++=4:10.2.1-1 \
  bzip2=1.0.8-4 \
  ca-certificates=20210119 \
  && rm -rf /var/lib/apt/lists/*


# NOTE Create $USER and its $HOME

RUN \
  useradd --create-home --shell /bin/bash --uid 1000 --user-group build && \
  chown -R build:build /home/build/


# NOTE Switch to $USER and $HOME

USER build
WORKDIR /home/build


# NOTE Install the correct version of Meteor

COPY --chown=build:build [ \
  "./.meteor/release", \
  "/home/build/src/.meteor/" \
]

RUN echo "export METEOR_LOCAL_RELEASE=$(sed -n 's/^METEOR@\([0-9][0-9]*.*\)$/\1/p' src/.meteor/release)" >> ./.env

# hadolint ignore=SC1091
RUN . ./.env; echo "export METEOR_EXECUTABLE_VERSION=${METEOR_LOCAL_RELEASE}" >> ./.env

# hadolint ignore=SC1091
RUN . ./.env; curl "https://install.meteor.com?release=${METEOR_EXECUTABLE_VERSION}" | sh

ENV PATH="/home/build/.meteor:${PATH}"


# NOTE Install the correct version of Node

RUN echo "export NODE_VERSION=$(meteor node --version | tail -c +2)" >> ./.env
RUN echo "export NPM_VERSION=$(meteor npm --version)" >> ./.env

ENV \
  NODE_ARCH="linux-x64" \
  NODE_INSTALL_PATH="/home/build/node"

# hadolint ignore=SC1091
RUN . ./.env; \
  mkdir -p "${NODE_INSTALL_PATH}" && \
  curl "https://static.meteor.com/dev-bundle-node-os/v${NODE_VERSION}/node-v${NODE_VERSION}-${NODE_ARCH}.tar.gz" | \
  tar -C "${NODE_INSTALL_PATH}" -xzf - "node-v${NODE_VERSION}-${NODE_ARCH}" --strip-components=1


# NOTE Install the app's dependencies

ENV \
  PUPPETEER_SKIP_DOWNLOAD="true"

WORKDIR /home/build/src

COPY --chown=build:build [ \
  "./package.json", \
  "./package-lock.json", \
  "./" \
]

RUN meteor npm clean-install


# NOTE Build app from sources

COPY --chown=build:build ./types types
COPY --chown=build:build ./imports imports
COPY --chown=build:build ./server server
COPY --chown=build:build ./client client
COPY --chown=build:build ./.meteor .meteor
COPY --chown=build:build ./packages/typescript-babel packages/typescript-babel
COPY --chown=build:build [ \
  "./tsconfig.json", \
  "./" \
]

RUN meteor npm run build -- ../dist --directory --architecture os.linux.x86_64 --server-only

WORKDIR /home/build/dist/bundle/programs/server

RUN meteor npm install

# NOTE: Check we have all required libraries for `node-canvas`.
# hadolint ignore=SC2015
RUN output="$(ldd npm/node_modules/canvas/build/Release/canvas.node 2>&1)" \
  || { printf '%s\n' "${output}" >&2; exit 1; } \
  && printf '%s\n' "${output}" | grep "=> not found" && exit 1 || true


FROM gcr.io/distroless/cc-debian${DEBIAN_VERSION}:nonroot AS main

# NOTE: Required by `node-canvas`.
COPY --from=build /usr/lib/x86_64-linux-gnu/libuuid.so.1 /usr/lib/x86_64-linux-gnu/libuuid.so.1

COPY --from=build --chown=nonroot:nonroot /home/build/node/bin/node /home/nonroot/node/bin/node
COPY --from=build --chown=nonroot:nonroot /home/build/dist/bundle /home/nonroot/dist
COPY --chown=nonroot:nonroot [ \
  "./scripts/healthcheck.cjs", \
  "/home/nonroot/scripts/" \
]

ENV PATH="/home/nonroot/node/bin"

ENV \
  ROOT_URL="http://localhost" \
  PORT="${PORT}" \
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


FROM main AS debug

COPY --from=build --chown=nonroot:nonroot /bin/sh /home/nonroot/node/bin/sh
COPY --from=build --chown=nonroot:nonroot /usr/bin/ldd /home/nonroot/ldd


FROM main
