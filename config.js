const readlineSync = require('readline-sync');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const saltRounds = 12;

const configPath = './config.json'
const defaultVhServerPath = '/home/vhserver/vhserver';

function loadConfig() {
    if(!fs.existsSync(configPath)) {
        return {}
    }

    const configJSON = fs.readFileSync(configPath);
    
    try {
        return JSON.parse(configJSON);
    } catch (err) {
        throw new Error('Cannot parse config file')
    }
}

function saveConfig(newConfig) {
    fs.writeFileSync(configPath, JSON.stringify(newConfig, undefined, 2));
}

function changePassword() {
    const config = loadConfig();

    if (config.passwordHash !== undefined) {
        if (readlineSync.keyInYN('Do you want to change the password?') === false) {
            return
        }
    }

    const password = readlineSync.question('Enter password: ', {
        hideEchoBack: true
    });

    if (password.length === 0) {
        console.log(`Password cannot be empty. Try once again`);
    }

    const repeatPassword = readlineSync.question('Repeat password: ', {
        hideEchoBack: true
    });

    if (password !== repeatPassword) {
        console.log(`Passwords are different. Try once again`);
        return;
    }

    const passwordHash = bcrypt.hashSync(password, saltRounds)

    saveConfig({
        ...config,
        passwordHash
    })
}

function changeVhServerPath() {
    const config = loadConfig()

    if (config.vhServerPath !== undefined) {
        if (readlineSync.keyInYN('Do you want to change the server path?') === false) {
            return;
        }
    }


    const defaultInput = config.vhServerPath || defaultVhServerPath
    const newPath = readlineSync.question(`Enter path [${defaultInput}]: `, { defaultInput: config.vhServerPath || defaultVhServerPath });

    saveConfig({
        ...config,
        vhServerPath: newPath
    })
}

changePassword();
changeVhServerPath();