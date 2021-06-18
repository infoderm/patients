:face_with_thermometer: `patients`
[![Tests](https://img.shields.io/github/workflow/status/infoderm/patients/ci:test?event=push&label=tests)](https://github.com/infoderm/patients/actions/workflows/ci:test.yml?query=branch:main)
[![Code coverage (cov)](https://img.shields.io/codecov/c/gh/infoderm/patients/main.svg)](https://codecov.io/gh/infoderm/patients)
==

> An app to manage patient records, consultations,
> appointments, lab reports, ...

The stack (provided by  [Meteor](https://meteor.com)):
  - **Database:** [MongoDB](https://mongodb.com)
  - **Server**: [Node.js](https://nodejs.org)
  - **Client**: [React](https://reactjs.org)


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
