const { admins } = require('../settings/global');
const { EOL } = require('os');

module.exports = {
  sendMessage: sendMessage,
  sendAdminMessage: sendAdminMessage
}

async function sendMessage(steamid, message) {
    message = message.length > 25 ? (EOL + message) : message;
    try {
        const response = await client.chatMessage(steamid, message.replace(/({EOL})/g, EOL));
        return response;
    } catch (error) {
      console.error(error)
    }
}

async function sendAdminMessage(message) {
  for(let u in admins) {
    const admin = admins[u];
    await sendMessage(admin, message)
  }
}