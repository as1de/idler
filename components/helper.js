const { version } = require('../package.json');
const { default: fetch } = require('node-fetch');
const SteamTotp = require('steam-totp');

const { username, password, sharedSecret, minimumLevel } = require('../settings/main');
const messages = require('../settings/messages');

module.exports = {
    logOnOptions: logOnOptions,
    logOnOptionsWithoutSteamGuard: logOnOptionsWithoutSteamGuard,
    highEnoughLevel, highEnoughLevel,
    updateChecker: updateChecker
}

function logOnOptions() {
	return {
        accountName: username,
        password: password,
        twoFactorCode: SteamTotp.generateAuthCode(sharedSecret)
	}
}

function logOnOptionsWithoutSteamGuard() {
    return {
        accountName: username,
        password: password
    }
}

function highEnoughLevel(level) {
    level >= minimumLevel
}

function updateChecker() {
    fetch('https://raw.githubusercontent.com/as1de/SteamBot-Version/master/package.json', {
        method: 'GET'
    })
    .then(res => res.json())
    .then(json => {
        if(json.version != version) {
            console.info(`[UPDATE] New update available! Current version: v${version}, newest version: v${json.version}.`)
        } else if(json.version === version) {
            console.log(`[UPDATE] You're already running the latest version!`)
        } else {
            console.error('[UPDATE] Unable to check for new updates!')
        }
    })
}
