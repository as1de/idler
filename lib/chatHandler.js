const { storeChatData } = require('azul-tools');

const { client } = require('../index');
const { proof } = require('./functions/commands');

client.on('friendMessage', async (senderID, message) => {
    storeChatData(senderID, message);

    message = message.toLowerCase();

    if(message.indexOf('[tradeoffer sender=') > -1) return;

    const command = str => message.indexOf(str.toLowerCase()) > -1;

    // Commands
    if(command('!dev') || command('!proof') || command('!developer')) return proof(senderID);
});