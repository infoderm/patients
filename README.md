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


## Development

### tools

    curl https://install.meteor.com | sh

### source

    git clone gh:infoderm/patients
    cd patients
    meteor npm ci

### :fish: Install pre-commit hook (`.husky/pre-commit`)

    npm run install-hooks

### tests

#### Watch tests

    npm run test

#### Run once

    npm run test -- --once

#### Emulate CI tests (Travis)
We recommend using the chromium of your distribution. Installation of the
custom chromium can be avoided by placing the line
`puppeteer_skip_chromium_download=true` in your `~/.npmrc`. If you wish to use
the chromium that comes with `puppeteer` remove the assignment of the variable
`PUPPETEER_EXECUTABLE_PATH`.

    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium npm run travis

### dev server

    npm run dev

### Bundle visualizer

    npm run bundle-visualizer

### dependency management

## :gift: Dependency management

    npm run upgrade

In this section, `dev` refers to the development machine, and `prod` refers to
the production machine.

### Setup

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

### Deploy (on the development machine)

#### Deploy the current state

This is if you want to deploy from your development machine (current state).

    npm run build-and-upload

#### Deploy the last commit

    npm run deploy

#### Deploy a specific tag

    TAG=vYYYY.MM.DD npm run deploy

## Backup & Restore

Need `rsync` on both machines.
Need `tar`, `openssl`, `mongodump`, `mongorestore`,
and the encryption key at `key/patients` on the production machine.

The executables `mongodump` and `mongorestore` can be found at `aur/mongodb-tools-bin` on Arch.

### backup

Need `mongodump` on production machine and `rclone` on development machine.

    sh .backup/backup.sh

### restore

Need `mongorestore` on production machine.

    sh .backup/restore.sh
