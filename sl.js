const SteamUser = require('steam-user');
const { Log } = require('azul-tools');

const { sharedSecret, status, gamesPlayedWhileIdle, customGamePlayedWhileIdle, behaviour } = require('./settings/account');
const { logOn, logOnWithoutSteamGuard } = require('./lib/helper');
const { welcomeMessage } = require('./settings/messages');
const { groupID } = require('./settings/global');
const { checkForUpdates } = require('./lib/updateChecker')

checkForUpdates();

const client = new SteamUser();

if (typeof sharedSecret === 'string') {
    client.logOn(logOn);
} else {
    client.logOn(logOnWithoutSteamGuard);
};

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
    }
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