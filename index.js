const SteamUser = require('steam-user');
const SteamCommunity = require('steamcommunity');
const TradeOfferManager = require('steam-tradeoffer-manager');
const { Log } = require('azul-tools');
const { EOL } = require('os');

const { sharedSecret, status, gamesPlayedWhileIdle, customGamePlayedWhileIdle, behaviour, identitySecret } = require('./settings/account');
const { logOn, logOnWithoutSteamGuard } = require('./lib/helper');
const { welcomeMessage } = require('./settings/messages');
const { groupID } = require('./settings/global');
const { checkForUpdates } = require('./lib/updateChecker');

const client = new SteamUser();
const community = new SteamCommunity();
const manager = new TradeOfferManager({
  steam: client,
  community: community,
  language: 'en'
});

module.exports = {
    client: client,
    community: community,
    manager: manager
}

checkForUpdates();

if(typeof sharedSecret === 'string') {
    client.logOn(logOn());
} else {
    client.logOn(logOnWithoutSteamGuard());
}

client.once('accountLimitations', (limited, communityBanned, locked) => {
    if(limited) {
        Log.Warn('This account is limited, farming is unavailable until the restriction is removed!');
        client.logOff();
    } else if(communityBanned) {
        Log.Warn('This account is banned from the Steam Community!');
        client.logOff();
    } else if(locked) {
        Log.Warn('This account is locked, farming and idling are unavailable until the restriction is removed!');
        client.logOff();
    }
});

client.on('loggedOn', () => {
    Log('Connecting...');
    client.setPersona(status);
    Log('Connected to Steam!');
    Log(`Successfully logged on as ${client.steamID}/${client.vanityURL}`);
    if(Array.isArray(gamesPlayedWhileIdle)) {
        client.gamesPlayed(gamesPlayedWhileIdle);
        if(typeof customGamePlayedWhileIdle === 'string') {
            client.gamesPlayed(customGamePlayedWhileIdle, gamesPlayedWhileIdle);
        }
    } else if(typeof customGamePlayedWhileIdle === 'string') {
        client.gamesPlayed(customGamePlayedWhileIdle);
    }
});

client.on('webSession', (sessionid, cookies) => {
  manager.setCookies(cookies);

  community.setCookies(cookies);
  community.startConfirmationChecker(10000, identitySecret);
});

client.on('friendRelationship', (steamID, relationship) => {
    if(behaviour.includes('acceptFriendRequests')) {
        if(relationship === 2) {
            client.addFriend(steamID);
        } else if(relationship === 3) {
            if(behaviour.includes('sendWelcomeMessage')) {
                client.chatMessage(welcomeMessage);
            }
            if(behaviour.includes('inviteFriendsToGroup')) {
                client.inviteToGroup(steamID, groupID);
            }
        }
    } else if(behaviour.includes('rejectFriendRequests')) {
        if(relationship === 2) {
            client.removeFriend(steamID);
        }
    }
});

client.on('groupRelationship', (groupSteamID, relationship) => {
    if(relationship === 2) {
        if(behaviour.includes('acceptGroupInvites')) {
            client.respondToGroupInvite(groupSteamID, true);
        } else if(behaviour.includes('rejectGroupInvites')) {
            client.respondToGroupInvite(groupSteamID, false);
        }
    }
});

require('./lib/chatHandler');