:face_with_thermometer: `patients`
[![Build](https://img.shields.io/github/actions/workflow/status/infoderm/patients/ci:build.yml?branch=main&event=push&label=build)](https://github.com/infoderm/patients/actions/workflows/ci:build.yml?query=branch:main)
[![Tests](https://img.shields.io/github/actions/workflow/status/infoderm/patients/ci:test.yml?branch=main&event=push&label=tests)](https://github.com/infoderm/patients/actions/workflows/ci:test.yml?query=branch:main)
[![Types](https://img.shields.io/github/actions/workflow/status/infoderm/patients/ci:type-check.yml?branch=main&event=push&label=types)](https://github.com/infoderm/patients/actions/workflows/ci:type-check.yml?query=branch:main)
[![Lint](https://img.shields.io/github/actions/workflow/status/infoderm/patients/ci:lint.yml?branch=main&event=push&label=lint)](https://github.com/infoderm/patients/actions/workflows/ci:lint.yml?query=branch:main)
[![Code coverage (cov)](https://img.shields.io/codecov/c/gh/infoderm/patients/main.svg)](https://codecov.io/gh/infoderm/patients)
==

> An app to manage patient records, consultations,
> appointments, lab reports, ...

The stack (provided by  [Meteor](https://meteor.com)):
  - **Database:** [MongoDB](https://mongodb.com)
  - **Server**: [Node.js](https://nodejs.org)
  - **Client**: [React](https://reactjs.org)

The tests are declared via [Mocha](https://github.com/mochajs/mocha) thanks to
[`meteor-testing:mocha`](https://packosphere.com/meteortesting/mocha).

> :bulb: We would replace Mocha by [AVA](https://github.com/avajs/ava) or
> [Jest](https://github.com/facebook/jest) here and now if only there was a
> Meteor package for that.

User Interface tests are facilitated by
[`@testing-library/react`](https://github.com/testing-library/react-testing-library),
[`@testing-library/dom`](https://github.com/testing-library/dom-testing-library),
and
[`@testing-library/user-event`](https://github.com/testing-library/user-event).

> :warning: Code coverage is currently both incomplete and broken most probably
> due to a TypeScript/Istanbul incompatibility.

In what follows, `dev` refers to the development machine, and `prod` refers to
the production machine.


## :woman_technologist: Setup `dev`

### :comet: Install Meteor

    curl https://install.meteor.com | sh

### :scroll: Get source

    git clone gh:infoderm/patients
    cd patients

### :package: Install dependencies

    meteor npm ci

### :fishing_pole_and_fish: Install pre-commit hook (`.husky/pre-commit`)

This will run the [linter](#shirt-linter) and the [type
checker](#ballot_box_with_check-type-checker) on staged
files before each commit.

    meteor npm run install-hooks

## :shirt: Linter

To lint source files we use [`xo`](https://github.com/xojs/xo) with
configuration inside `package.json`. You can run the linter with

    meteor npm run lint

You can attempt to autofix some errors with

    meteor npm run lint-and-fix

## :ballot_box_with_check: Type checker

The entire code base is checked for type errors with `tsc`, the
[TypeScript](https://www.typescriptlang.org) compiler. You can run the type
checker with

    meteor npm run tsc

To run it in watch mode during development use

    meteor npm run tsc:watch

## :microscope: Tests

### Watch tests

> You can set host and port via the `$HOST` and `$PORT` environment variables (default `localhost:12348`).

    meteor npm run test

To run client tests non-interactively you can use

> NB: this uses `PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium`

    meteor npm run test:dev:non-interactive

### Run once

> You can set host and port via the `$HOST` and `$PORT` environment variables (default `localhost:12348`).

    meteor npm run test -- --once

### Emulate CI tests (GitHub Actions)
> :warning: We recommend using the `chromium` executable of your distribution. Installation of the
puppeteer `chromium` executable can be avoided by placing the line
`puppeteer_skip_chromium_download=true` in your `~/.npmrc`. If you wish to use
the `chromium` executable that comes with `puppeteer` remove the assignment of the variable
`PUPPETEER_EXECUTABLE_PATH`.

    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium meteor npm run ci:test

## :alembic: Run `dev` server

> You can set host and port via the `$HOST` and `$PORT` environment variables (default `localhost:12345`).

    meteor npm run dev

## :elephant: Run bundle visualizer

> You can set host and port via the `$HOST` and `$PORT` environment variables (default `localhost:12345`).

    meteor npm run bundle-visualizer

## :gift: Dependency management

    meteor npm run upgrade

Some dependencies need manual upgrade. Their versions depends on the used
Meteor version. Hereunder are the information links for the latest stable
release of Meteor:

  - [`@types/meteor`](https://www.npmjs.com/package/@types/meteor)
  - [`@types/node`](https://github.com/meteor/meteor/blob/master/scripts/build-dev-bundle-common.sh)
  - [`@types/mocha`](https://github.com/Meteor-Community-Packages/meteor-mocha-core/blob/master/package.js) and [`meteortesting:mocha-core`](https://github.com/Meteor-Community-Packages/meteor-mocha/blob/master/package/package.js)
  - [`typescript`](https://github.com/meteor/meteor/blob/master/npm-packages/meteor-babel/package.json)

NB: `@types/mongodb` does not need explicit pinning because it is a dependency
of `@types/meteor.`

Direct ESM dependencies cannot be added and CJS dependencies cannot be upgraded
to ESM. See [the relevant discussion](https://github.com/meteor/meteor/discussions/11727).

## :woman_health_worker: Production

### :wrench: Setup

#### `dev` Create ssh keys on the development machine

    ssh-keygen -m PEM -t rsa -b 4096 -a 100 -f .ssh/meteorapp

#### `prod` On the production machine

##### Install and enable docker

    pacman -S docker
    systemctl enable --now docker

##### Create a user

    useradd -m meteorapp
    gpasswd -a meteorapp wheel
    gpasswd -a meteorapp docker

##### Copy `dev` public key on `prod`

Append it to `/home/meteorapp/.ssh/authorized_keys`.
Remember: `chmod .ssh 700` and `chmod .ssh/authorized_keys 640`.

#### `dev` On the development machine
Install dependencies, custom certificates, and MongoDB on server:

    meteor npm run setup-deploy

### :rocket: Deploy from `dev` on `prod`

#### Deploy the current state of `dev`

    meteor npm run build-and-upload

#### Deploy the last commit

    meteor npm run deploy

#### Deploy a specific tag

    TAG=vYYYY.MM.DD meteor npm run deploy

#### Generate a Docker `compose` configuration

:construction: This is work in progress. :construction:

Without backup:

    IMAGE_TAG=v2025.01.29-1 \
    ROOT_URL=https://example.local PORT=3000 HTTP_FORWARDED_COUNT=2 \
    METEOR_SETTINGS="$(jq -c < .deploy/ghcr.io/settings.json)" \
    docker compose \
      -f compose.yaml \
      -f .deploy/ghcr.io/patient-web.yaml \
      config

With backup:

    IMAGE_TAG=v2025.01.29-1 \
    ROOT_URL=https://example.local PORT=3000 HTTP_FORWARDED_COUNT=2 \
    METEOR_SETTINGS="$(jq -c < .deploy/ghcr.io/settings.json)" \
    BACKUP_KEY="<AGE-PUBLIC-KEY>" \
    BACKUP_DIR="$HOME/backup/patients" \
    BACKUP_SCHEDULE="0 21 * * *" \
    BACKUP_INTERVAL="129600" \
    BACKUP_RETENTION_POLICY_SCHEDULE="0 18 * * 0" \
    BACKUP_RETENTION_POLICY_INTERVAL="691200" \
    docker compose \
      -f compose.yaml \
      -f .deploy/backup/compose.yaml \
      -f .deploy/backup-retention-policy/compose.yaml \
      -f .deploy/ghcr.io/patient-web.yaml \
      -f .deploy/ghcr.io/patient-backup.yaml \
      -f .deploy/ghcr.io/patient-backup-retention-policy.yaml \
      config

## :recycle: Backup & Restore

The current backup system requires `age` and the encryption/decryption key at
`~/key/patients` on the production machine. It saves the database as an
encrypted (`age`) compressed MongoDB archive (`--archive --gzip`).

### :movie_camera: Backup

    sh .backup/fs/backup.sh

### :film_projector: Restore

    sh .backup/restore.sh

### :scroll: Changelog

#### Now

The backup system uses encrypted (`age`) compressed MongoDB archives
(`--archive --gzip`). They can be restored with

    age --decrypt -i "$KEYFILE" < 'patients.gz.age' |
      mongorestore --drop --nsInclude 'patients.*' --archive --gzip

#### Until 2021-04-20

The backup system uses encrypted gzipped TAR archives. They can be processed by
first decrypting with `age` to obtain a `.gz` file, then decompressing and
unarchiving with `tar xzf` to obtain a `dump` directory, and finally using
`mongorestore --drop --db patients` to restore the database.
