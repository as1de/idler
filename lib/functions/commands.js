const { EOL } = require('os');
const { sendMessage } = require('../userHandler');

module.exports = {
    proof: proof
}

async function proof(senderID) {
    let response = 'SL Idler.'
    response += `${EOL} • SL Idler was created by as1de`
    response += `${EOL} • as1de's Steam: https://steamcommunity.com/profiles/76561199022601743`
    sendMessage(senderID, response);
}