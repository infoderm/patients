# patients

> Patients meteor app

## Development

### tools

    curl https://install.meteor.com | sh
    npm i -g npm-check-updates
    
### source

    git clone gh:dermatodoc/patients
    cd patients
    meteor npm ci
    
### test server
    
    meteor run -p 12345

### dependency management

    meteor update
    ncu -u
    meteor npm ci
    
## Deployment (first time)

### On the development machine (1)

#### Create ssh keys

    ssh-keygen -m PEM -t rsa -b 4096 -a 100 -f .ssh/meteorapp

### On the production machine

#### Install and enable docker

    pacman -S docker
    systemctl enable --now docker

#### Create a user

    useradd -m meteorapp
    gpasswd -a meteorapp wheel
    gpasswd -a meteorapp docker

#### Copy public key

Append it to `/home/meteorapp/.ssh/authorized_keys`.
Remember: `chmod .ssh 700` and `chmod .ssh/authorized_keys 640`.


### On the development machine (2)

#### Install meteor-up (first time)

    npm i -g mup

#### setup (first time)

    mup setup
    
#### deploy

    mup deploy

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
