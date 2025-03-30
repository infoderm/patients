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

### :building_construction: Setup `prod`

#### Install and enable docker

    pacman -S docker
    systemctl enable --now docker

#### Create a user

    useradd -m patient
    gpasswd -a patient wheel
    gpasswd -a patient docker

#### Switch user

    su patient && cd

#### Get the sources

    git clone https://github.com/infoderm/patients && cd patients


### :whale: Deploy

#### Key environment variables

##### `IMAGE_TAG`

To deploy a published image. Each git version tag is published automatically (`v*`).
Recent commits and PRs also have published images available (`edge`, `sha-*`, `pr-*`).
The complete list of currently available tagged images can be consulted at:
  - https://github.com/infoderm/patients/pkgs/container/patient-web/versions?filters%5Bversion_type%5D=tagged

##### `MONGO_VERSION=7.0.5`

Current deployment runs an unmodified `mongo:${MONGO_VERSION}` image. The
default `MONGO_VERSION` is the recommended version with the currently checked
out sources.

The `compose.yaml` file defines:
  - a volume to persist the database,
  - a healthcheck that configures the replica set and ensures it is healthy,
  - a strict network configuration that only allows `patient-web` and
  `patient-backup` to connect,
  - logging to JSON files

##### `ROOT_URL`

The user-facing root URL of the deployed app.

For instance, without this, dynamic imports will not work.

##### `PORT=3000`

The port at which the web client is exposed. Proxy this port if you want to be
able to reach the app from another machine.

##### `HTTP_FORWARDED_COUNT`

How many proxies lie between the user and the `prod` machine. Essential to
correctly configure IP-address-based rate-limiting.

##### `METEOR_SETTINGS`

To use sane defaults `METEOR_SETTINGS="$(jq -c < .deploy/default/settings.json)"`.

A custom [`settings.json`](https://docs.meteor.com/api/meteor.html#Meteor-settings)
file can also be created and used instead.

##### `BACKUP_KEY`

The public `age` key used to encrypt the backup. This is the public key output
to `stderr` at key generation time (`age-keygen`). It is also present as a
comment in the generated private key file (the private key is only useful to
restore backups and is not needed by the backup container).

##### `BACKUP_DIR`

Where to store the backups.

##### `BACKUP_SCHEDULE`

`crond` schedule for backups.

##### `BACKUP_INTERVAL`

Expected interval in seconds between backups (add some buffer).
Derive this from backup schedule.

The backup container will be considered unhealthy if no backup happens in this
interval.

##### `BACKUP_RETENTION_POLICY_SCHEDULE`

`crond` schedule for the backup retention policy.

##### `BACKUP_RETENTION_POLICY_INTERVAL`

Expected interval in seconds between runs of the backup retention policy (add
some buffer). Derive this from backup schedule.

The backup retention policy container will be considered unhealthy if no backup
happens in this interval.


#### :wrench: Configure `prod`

##### Generate a Docker `compose` configuration from releases

We recommend you name your deployment uniquely, for instance using its domain
name:

```
DEPLOYMENT=.deploy/example.local
```

We recommend you create a directory where the deployment files will be stored:

```sh
mkdir "${DEPLOYMENT}"
```

We recommend you create a copy of the default `METEOR_SETTINGS` so that you can
tweak them if needed:

```sh
cp .deploy/default/settings.json "${DEPLOYMENT}/settings.json"
```

Here is an example deployment `compose` configuration without backups
(`IMAGE_TAG>=v2025.01.29-1`):

```sh
IMAGE_TAG=v2025.01.29-1 \
ROOT_URL=https://example.local PORT=3000 HTTP_FORWARDED_COUNT=2 \
METEOR_SETTINGS="$(jq -c < "${DEPLOYMENT}/settings.json")" \
docker compose \
  -f compose.yaml \
  -f .deploy/ghcr.io/patient-web.yaml \
  config > "${DEPLOYMENT}/compose.yaml"
```

> We recommend you save this script at `${DEPLOYMENT}/compose.sh` for
> when you wish to update your configuration.

Example with encrypted backups (`IMAGE_TAG>=v2025.02.15-1`,
[requires a key pair generated by `age-keygen`](#backup_key)):

```diff
  IMAGE_TAG=v2025.02.15-1 \
  ROOT_URL=https://example.local PORT=3000 HTTP_FORWARDED_COUNT=2 \
  METEOR_SETTINGS="$(jq -c < "${DEPLOYMENT}/settings.json")" \
+ BACKUP_KEY="<AGE-PUBLIC-KEY>" \
+ BACKUP_DIR="./${DEPLOYMENT}/backups" \
+ BACKUP_SCHEDULE="0 21 * * *" \
+ BACKUP_INTERVAL="129600" \
+ BACKUP_RETENTION_POLICY_SCHEDULE="0 18 * * 0" \
+ BACKUP_RETENTION_POLICY_INTERVAL="691200" \
  docker compose \
    -f compose.yaml \
+   -f .deploy/backup/compose.yaml \
+   -f .deploy/backup-retention-policy/compose.yaml \
    -f .deploy/ghcr.io/patient-web.yaml \
+   -f .deploy/ghcr.io/patient-backup.yaml \
+   -f .deploy/ghcr.io/patient-backup-retention-policy.yaml \
    config > "${DEPLOYMENT}/compose.yaml"
```

##### Generate a Docker `compose` configuration from sources

Just remove `IMAGE_TAG=...` and the lines that configure pulling from
`ghcr.io`:

```diff
- IMAGE_TAG=v2025.02.15-1 \
  ROOT_URL=https://example.local PORT=3000 HTTP_FORWARDED_COUNT=2 \
  METEOR_SETTINGS="$(jq -c < "${DEPLOYMENT}/settings.json")" \
  BACKUP_KEY="<AGE-PUBLIC-KEY>" \
  BACKUP_DIR="./${DEPLOYMENT}/backups" \
  BACKUP_SCHEDULE="0 21 * * *" \
  BACKUP_INTERVAL="129600" \
  BACKUP_RETENTION_POLICY_SCHEDULE="0 18 * * 0" \
  BACKUP_RETENTION_POLICY_INTERVAL="691200" \
  docker compose \
    -f compose.yaml \
    -f .deploy/backup/compose.yaml \
    -f .deploy/backup-retention-policy/compose.yaml \
-   -f .deploy/ghcr.io/patient-web.yaml \
-   -f .deploy/ghcr.io/patient-backup.yaml \
-   -f .deploy/ghcr.io/patient-backup-retention-policy.yaml \
    config > "${DEPLOYMENT}/compose.yaml"
```


#### :rocket: Upgrade `prod`

Update `${DEPLOYMENT}/compose.yaml`, then:

    docker compose -f "${DEPLOYMENT}/compose.yaml" up -d

> We recommend creating a deployment branch to keep track of the changes under
> `${DEPLOYMENT}`, to maintain an history of upgrades (don't forget to create a
> `.gitignore` to exclude the database backup files from the git history).


## :recycle: Backup & Restore

The current backup system dumps the database as an encrypted (`age`) compressed
MongoDB archive (`--archive --gzip`).

### :movie_camera: Backup

[Backups can be automated](#wrench-configure-prod), or they can be run manually:

    docker exec -i patient-patient-db-1 \
      mongodump --uri "${MONGO_URL}" --archive --gzip |
      age -r "${AGE_PUBLIC_KEY}" > "backups/$(date '+%Y-%m-%d_%H:%M:%S')"

### :film_projector: Restore

They can be restored with

    age --decrypt -i "${AGE_PRIVATE_KEY}" < backups/YYYY-MM-DD_HH:mm:ss |
      docker exec -i patient-patient-db-1 \
        mongorestore --uri "mongodb://localhost:27017" \
        --drop \
        --nsInclude 'meteor.*' \
        --nsFrom 'meteor.*' \
        --nsTo 'meteor.*' \
        --archive --gzip
