if (process.env.NODE_ENV == "development"){
	module.exports = require('./main.dev.js');
	return;
}

module.exports = {
    username: '',
    password: '',
    identitySecret: '',
    sharedSecret: '',
    autoGenerateSteamGuard: true,

    admin: '76561199022601743',

    inviteToGroup: true,
    groupID: '103582791469175643',

    customGamePlayedWhileIdle: null, // null = disabled
    gamesPlayedWhileIdle: [730, 440, 570], // null = disabled

    // Farming
    customGamePlayedWhileFarming: null,
    autoSteamSaleEvent: true,

    welcomeMessageEnabled: true,

    autoAcceptGroupInvites: true,
    autoDeclineGroupInvites: false,

    autoAcceptFriendRequests: true,
    autoDeclineFriendRequests: false,
    minimumLevel: 0, // 0 = disabled

    personaState: 1,
    /*
    0 - Offline,
    1 - Online,
    2 - Busy,
    3 - Away,
    4 - Snooze,
    5 - Looking to Trade,
    6 - Looking to Play,
    7 - Invisible.
    */

    acceptGifts: true,
    autoAcceptDonates: true,
    autoDeclineNonDonates: false,

    enableCommands: false,

    checkForUpdates: true
}
