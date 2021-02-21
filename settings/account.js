module.exports = {
    username: '',
    password: '',
    identitySecret: '',
    sharedSecret: '', // When there is no sharedSecret on this field, Steam will ask you for Steam Guard Code
    
    behaviour: ['none'],
    /*
    none - None of those
    inviteFriendsToGroup - When a new friend is added, we will automatically invite him to our group
    acceptFriendRequests - Accept all incoming friend requests
    sendWelcomeMessage - When a new friend is added, we will send a lovely welcome message
    acceptGroupInvites - Accept all group invites
    acceptDonations - Accept all trade offers that doesn't want our items
    rejectFriendRequests - Automatically reject all incoming friend requests
    rejectGroupInvites - Automatically reject all group invites
    rejectInvalidTrades - Automatically reject all trade offers that are not donates
    */

    status: 3,
    /*
    0 - Offline
    1 - Online,
    2 - Busy
    3 - Away
    4 - Snooze
    5 - Looking to Trade
    6 - Looking to Play
    7 - Invisible
    */

    gamesPlayedWhileIdle: null,
    customGamePlayedWhileIdle: null
}