const { Log } = require('azul-tools');
const { default:fetch } = require('node-fetch');

const { updateBranch } = require('../settings/global');
const { version } = require('../package.json')

module.exports = {
    checkForUpdates: checkForUpdates
}

function checkForUpdates() {
    fetch(`https://raw.githubusercontent.com/as1de/sl-idler/${updateBranch}/package.json`, {
        method: 'GET'
    })
    .then(res => res.json())
    .then(json => {
        if(json.version != version) {
            Log(`New update available! Local version: ${version}, remote version: ${json.version}.`)
        } else if(json.version === version) {
            Log(`You're already running the latest version!`)
        } else {
            Log.Error('Unable to check for new updates!')
        }
    })
}