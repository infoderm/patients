:face_with_thermometer: `patients`
[![Build](https://img.shields.io/travis/infoderm/patients/main.svg)](https://travis-ci.org/infoderm/patients/branches)
[![Code coverage (cov)](https://img.shields.io/codecov/c/gh/infoderm/patients/main.svg)](https://codecov.io/gh/infoderm/patients)
==

> An app to manage patient records, consultations,
> appointments, lab reports, ...

The stack (provided by  [meteor](https://meteor.com)):
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

    npm run install-hooks

## :microscope: Tests

### Watch tests

> You can set host and port via the `$HOST` and `$PORT` environment variables (default `127.0.0.1:12348`).

    npm run test

### Run once

> You can set host and port via the `$HOST` and `$PORT` environment variables (default `127.0.0.1:12348`).

    npm run test -- --once

### Emulate CI tests (Travis)
> :warning: We recommend using the `chromium` executable of your distribution. Installation of the
puppeteer `chromium` executable can be avoided by placing the line
`puppeteer_skip_chromium_download=true` in your `~/.npmrc`. If you wish to use
the `chromium` executable that comes with `puppeteer` remove the assignment of the variable
`PUPPETEER_EXECUTABLE_PATH`.

    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium npm run travis

## :alembic: Run `dev` server

> You can set host and port via the `$HOST` and `$PORT` environment variables (default `127.0.0.1:12345`).

    npm run dev

## :elephant: Run bundle visualizer

> You can set host and port via the `$HOST` and `$PORT` environment variables (default `127.0.0.1:12345`).

    npm run bundle-visualizer

## :gift: Dependency management

    npm run upgrade

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

    npm run setup-deploy

### :rocket: Deploy from `dev` on `prod`

#### Deploy the current state of `dev`

    npm run build-and-upload

#### Deploy the last commit

    npm run deploy

#### Deploy a specific tag

    TAG=vYYYY.MM.DD npm run deploy

## :recycle: Backup & Restore

Need `rsync` on both machines.
Need `tar`, `openssl`, `mongodump`, `mongorestore`,
and the encryption key at `key/patients` on the production machine.

> The executables `mongodump` and `mongorestore` can be found at `community/mongodb-tools` on Arch Linux.

### :movie_camera: Backup

    sh .backup-fs/backup.sh

### :film_projector: Restore

    sh .backup/restore.sh
