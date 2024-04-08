ARG IMAGE_BASE=debian:bullseye-slim

FROM $IMAGE_BASE AS build

RUN useradd --create-home --shell /bin/bash --uid 1000 --user-group app
WORKDIR /home/app

RUN apt-get update && \
  apt-get install -y curl python python3 make g++ bzip2 ca-certificates --no-install-recommends && \
  rm -rf /var/lib/apt/lists/*

# TODO Load sources after meteor npm clean-install
COPY ./types /home/app/src/types
COPY ./imports /home/app/src/imports
COPY ./server /home/app/src/server
COPY ./client /home/app/src/client
COPY ./.meteor /home/app/src/.meteor
COPY [ \
  "./package.json", \
  "./tsconfig.json", \
  "./package-lock.json", \
  "/home/app/src/" \
]

RUN chown -R app:app /home/app/

USER app

RUN echo "export METEOR_LOCAL_RELEASE=$(sed -n 's/^METEOR@\([0-9][0-9]*.*\)$/\1/p' src/.meteor/release)" >> ./.env
RUN . ./.env; echo "export METEOR_EXECUTABLE_VERSION=${METEOR_LOCAL_RELEASE}" >> ./.env
RUN . ./.env; curl "https://install.meteor.com?release=${METEOR_EXECUTABLE_VERSION}" | sh

ENV PATH="/home/app/.meteor:${PATH}"

RUN echo "export NODE_VERSION=$(meteor node --version | tail -c +2)" >> ./.env
RUN echo "export NPM_VERSION=$(meteor npm --version)" >> ./.env

RUN find . -maxdepth 3

ENV \
  PUPPETEER_SKIP_DOWNLOAD="true"

RUN cd src && \
  meteor npm clean-install

RUN cd src && \
  meteor npm run build -- ../dist --directory --architecture os.linux.x86_64 --server-only

RUN cd dist/bundle/programs/server && \
  meteor npm install

ENV \
  ARCH="linux-x64" \
  NODE_INSTALL_PATH="/home/app/node"

RUN . ./.env; \
  mkdir -p "${NODE_INSTALL_PATH}" && \
  curl "https://static.meteor.com/dev-bundle-node-os/v${NODE_VERSION}/node-v${NODE_VERSION}-${ARCH}.tar.gz" | \
  tar -C "${NODE_INSTALL_PATH}" -xzf - "node-v${NODE_VERSION}-${ARCH}" --strip-components=1



FROM $IMAGE_BASE

RUN useradd --create-home --shell /bin/bash --uid 1000 --user-group app

COPY --from=build /home/app/dist/bundle /home/app/dist/
COPY --from=build /home/app/node/bin /home/app/node/bin/

RUN chown -R app:app /home/app/

USER app
WORKDIR /home/app

RUN ls -la dist
RUN ls -la node/bin

ENV PATH="/home/app/node/bin:${PATH}"

EXPOSE 3000

ENV \
  ROOT_URL="http://localhost" \
  PORT="3000" \
  MONGO_URL="mongodb://127.0.0.1:27017/meteor"


CMD ["node", "dist/main.js"]
