const SteamUser = require('steam-user');
const SteamTotp = require('steam-totp');
const SteamCommunity = require('steamcommunity');
const TradeOfferManager = require('steam-tradeoffer-manager');

const { autoGenerateSteamGuard, customGame, autoAcceptFriendRequests, inviteToGroup, groupID, welcomeMessageEnabled, minimumLevel, identitySecret, autoAcceptDonates, autoDeclineNonDonates, personaState, admin, enableCommands, gamesPlayedWhileIdle, customGamePlayedWhileIdle, autoAcceptGroupInvites, autoDeclineGroupInvites, checkForUpdates, autoDeclineFriendRequests } = require('./settings/main');
const { logOnOptions, logOnOptionsWithoutSteamGuard, highEnoughLevel, updateChecker } = require('./components/helper');
const { welcomeMessage, gotNewOffer, acceptedDonate, declinedNonDonate, availableCommands } = require('./settings/messages');

const client = new SteamUser();
const community = new SteamCommunity();
const manager = new TradeOfferManager({
  steam: client,
  community: community,
  language: 'en'
});

// Check for updates

if(checkForUpdates) {
    updateChecker();
};

// LogOn Options

if(autoGenerateSteamGuard) {
    client.logOn(logOnOptions());
} else {
    client.logOn(logOnOptionsWithoutSteamGuard());
};

// Client stuff

client.on('loggedOn', () => {
    console.log('[CONNECTING] Connecting...')
    client.setPersona(personaState);
    console.log('[CONNECTED] Connected to Steam!')
    console.log(`[LOGGED ON] Successfully logged on as ${client.vanityURL}/${client.steamID}.`)
    if(Array.isArray(gamesPlayedWhileIdle)) {
        client.gamesPlayed(gamesPlayedWhileIdle);
        console.log(`[IDLE] Property \'gamesPlayedWhileIdle\' is an array, starting idling those game: ${gamesPlayedWhileIdle}...`)
        if(typeof customGamePlayedWhileIdle === 'string') {
            console.log('[IDLE] Property \'customGamePlayedWhileIdle\' is a string, setting custom game played...')
            client.gamesPlayed(customGamePlayedWhileIdle, gamesPlayedWhileIdle);
        } else {
            console.log('[IDLE] Property \'customGamePlayedWhileIdle\' isn\'t a string, skipping...')
        }
    } else if(typeof customGamePlayedWhileIdle === 'string') {
        console.log('[IDLE] Property \'gamesPlayedWhileIdle\' isn\'t an array, skipping...')
        console.log('[IDLE] Property \'customGamePlayedWhileIdle\' is a string, setting custom game played...')
        client.gamesPlayed(customGamePlayedWhileIdle);
    } else {
        console.log('[IDLE] Property \'gamesPlayedWhileIdle\' isn\'t an array, skipping...')
        console.log('[IDLE] Property \'customGamePlayedWhileIdle\' isn\'t a string, skipping...')
    }
});

client.on('webSession', (sessionid, cookies) => {
  manager.setCookies(cookies);

  community.setCookies(cookies);
  community.startConfirmationChecker(10000, identitySecret);
});

client.once('accountLimitations', (limited, communityBanned, locked) => {
    if(limited) {
        console.error('[LIMITATIONS] Unfortunately, my account is limited.');
    } else if(communityBanned) {
        console.error('[LIMITATIONS] Unfortunately, my account is banned from the Steam community.');
    } else if(locked) {
        console.error('[LIMITATIONS] Unfortunately, my account is locked.');
    }
});

// Friendship Manager

client.on('friendRelationship', (steamID, relationship) => {
    if(autoAcceptFriendRequests) {
        if(relationship === 2) {
            client.addFriend(steamID);
            console.log(`[FRIEND] The user ${steamID.getSteamID64()} added me as a friend!`);
        } else if(relationship === 3) {
            if(welcomeMessageEnabled) {
                client.chatMessage(steamID, welcomeMessage);
                console.log(`[FRIEND] The user ${steamID.getSteamID64()} is now my friend!`);
            };
            if(inviteToGroup) {
                client.inviteToGroup(steamID, groupID);
                console.log(`[GROUP] I invited ${steamID.getSteamID64()} to our group!`);
            }
        }
    } else if(autoDeclineFriendRequests) {
        if(relationship === 2) {
            client.removeFriend(steamID);
            console.log(`[FRIEND] Declined friend request from ${steamID.getSteamID64}.`)
        }
    }

    if(relationship === 0) {
        console.log(`[FRIEND] The user ${steamID.getSteamID64()} has removed me from their friend list D:`)
    };
/*
    if(autoAcceptFriendRequests) {
        if(relationship == 2) {
            client.getPersonas([steamID], (personas) => {
                var persona = personas[steamID.getSteamID64()];
                var name = persona ? persona.player_name : (`['${steamID.getSteamID64()}']`);

                client.getSteamLevels([steamID], function(results) {
                    var level = results[steamID.getSteamID64()]

                    if(highEnoughLevel(level)) {

                        client.addFriend(steamID);

                        if(welcomeMessageEnabled) {
                            client.chatMessage(steamID, welcomeMessage);
                        }
                        if(inviteToGroup) {
                            client.inviteToGroup(steamID, groupID);
                        }
                    }
                });
            });
        }
    }
*/
});

client.on('groupRelationship', (groupSteamID, relationship) => {
    if(autoAcceptGroupInvites) {
        if(relationship === 2) {
            client.respondToGroupInvite(groupSteamID, true)
            console.log(`[GROUP INVITE] Accepted group invite to ${groupSteamID.getSteamID64()}!`)
        }
    } else if(autoDeclineGroupInvites) {
        if(relationship === 2) {
            client.respondToGroupInvite(groupSteamID, false)
            console.log(`[GROUP INVITE] Declined group invite to ${groupSteamID.getSteamID64()}!`)
        }
    }
});

// Trade Manager

manager.on('newOffer', offer => {
  if (offer.itemsToGive.length === 0) {
    if(autoAcceptDonates) {
        offer.accept((err, status) => {
            if (err) {
              console.error(err);
            } else {
                client.chatMessage(admin, acceptedDonate)
                console.log(`Donation accepted. Status: ${status}.`);
            }
        });
    } else {
        client.chatMessage(admin, gotNewOffer)
        console.log('[OFFER] Someone sent me a new trade offer!')
    }
  } else {
      if(autoDeclineNonDonates) {
        offer.decline(err => {
            if (err) {
              console.error(err);
            } else {
                client.chatMessage(admin, declinedNonDonate)
                console.log('Trade Offer declined (wanted my items).');
            }
        });
      } else {
          client.chatMessage(admin, gotNewOffer)
          console.log('[OFFER] Someone sent me a new trade offer!')
      }
  }
});

// Commands

client.on('friendMessage', function (steamID, message) {
    if(enableCommands) {
        if(message === '!help') {
            client.chatMessage(steamID, availableCommands);
        }
    }
});
