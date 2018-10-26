# patients

> Patients meteor app

## development

### tools

    curl https://install.meteor.com | sh
    npm i -g npm-check-updates
    
### source

    git clone gh:dermatodoc/patients
    cd patients
    meteor npm install
    
### test server
    
    meteor run -p 12345

### dependency management

    meteor update
    ncu -a
    meteor npm install
    
## deployment

### tools

    npm i -g mup
    
### deploy

    mup deploy
