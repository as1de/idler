const { generateAuthCode } = require('steam-totp');

const { username, password, sharedSecret } = require('../settings/account')

module.exports = {
    logOn: logOn,
    logOnWithoutSteamGuard: logOnWithoutSteamGuard
}

function logOn() {
    return {
        accountName: username,
        password: password,
        twoFactorCode: generateAuthCode(sharedSecret)
    }
}

function logOnWithoutSteamGuard() {
    return {
        accountName: username,
        password: password
    }
}