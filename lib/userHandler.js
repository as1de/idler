const { EOL } = require('os');
const { Log } = require('azul-tools');

const { client } = require('../index');

module.exports = {
    sendMessage: sendMessage
}

async function sendMessage(steamID, message) {
    message = message.length > 25 ? (EOL + message) : message;
    try {
        const response = await client.chatMessage(steamID, message.replace(/({EOL})/g, EOL));
        return response;
    } catch(error) {
        Log.Error(error);
    }
}