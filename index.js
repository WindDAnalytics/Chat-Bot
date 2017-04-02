const BeamClient = require('beam-client-node');
const BeamSocket = require('beam-client-node/lib/ws');

let userInfo;

const client = new BeamClient();

// With OAuth we don't need to login, the OAuth Provider will attach
// the required information to all of our requests after this call.
client.use('oauth', {
    tokens: {
        access: 'ffHfTJZQWx1Rd0JhoAWLgTb6Ky1swTsQhCEtLTidmVp8Hz52crLlxiaEYzkemTeq',
        expires: Date.now() + (365 * 24 * 60 * 60 * 1000)
    },
});

// Get's the user we have access to with the token
client.request('GET', `users/current`)
.then(response => {
    console.log(response.body);
    // Store the logged in user's details for later refernece
    userInfo = response.body;
    // Returns a promise that resolves with our chat connection details.
    return client.chat.join(response.body.channel.id);
})
.then(response => {
    const body = response.body;
    console.log(body);
    // TODO: Connect to chat.
})
.catch(error => {
    console.log('Something went wrong:', error);
});
{ endpoints:
   [ 'wss://chat1-dal.beam.pro:443',
     'wss://chat2-dal.beam.pro:443' ],
  authkey: '1c0e251998ac7112f42c71a23d4b67b3',
  permissions:
   [ 'change_ban',
     'edit_options',
     'change_role',
     'bypass_links',
     'bypass_slowchat',
     'remove_message',
     'clear_messages',
     'timeout',
     'giveaway_start',
     'poll_vote',
     'poll_start',
     'connect',
     'chat' ] }
const BeamClient = require('beam-client-node');
const BeamSocket = require('beam-client-node/lib/ws');

let userInfo;

const client = new BeamClient();

// With OAuth we don't need to login, the OAuth Provider will attach
// the required information to all of our requests after this call.
client.use('oauth', {
    tokens: {
        access: 'ffHfTJZQWx1Rd0JhoAWLgTb6Ky1swTsQhCEtLTidmVp8Hz52crLlxiaEYzkemTeq',
        expires: Date.now() + (365 * 24 * 60 * 60 * 1000)
    },
});

// Get's the user we have access to with the token
client.request('GET', `users/current`)
.then(response => {
    console.log(response.body);
    // Store the logged in user's details for later refernece
    userInfo = response.body;
    // Returns a promise that resolves with our chat connection details.
    return client.chat.join(response.body.channel.id);
})
.then(response => {
    const body = response.body;
    console.log(body);
    return createChatSocket(userInfo.id, userInfo.channel.id, body.endpoints, body.authkey);
})
.catch(error => {
    console.log('Something went wrong:', error);
});


/**
 * Creates a beam chat socket and sets up listeners to various chat events.
 * @param {any} userId The user to authenticate as
 * @param {any} channelId The channel id to join
 * @param {any} endpoints An endpoints array from a beam.chat.join call.
 * @param {any} authkey An authentication key from a beam.chat.join call.
 * @returns {Promise.<>}
 */
function createChatSocket (userId, channelId, endpoints, authkey) {
    const socket = new BeamSocket(endpoints).boot();

    // You don't need to wait for the socket to connect before calling methods,
    // we spool them and run them when connected automatically!
    socket.auth(channelId, userId, authkey)
    .then(() => {
        console.log('You are now authenticated!');
        // Send a chat message
        return socket.call('msg', ['Hello world!']);
    })
    .catch(error => {
        console.log('Oh no! An error occurred!', error);
    });

    // Listen to chat messages, note that you will also receive your own!
    socket.on('ChatMessage', data => {
        console.log('We got a ChatMessage packet!');
        console.log(data);
        console.log(data.message); // lets take a closer look
    });

    // Listen to socket errors, you'll need to handle these!
    socket.on('error', error => {
        console.error('Socket error', error);
    });
}
const BeamClient = require('beam-client-node');
const BeamSocket = require('beam-client-node/lib/ws');

let userInfo;

const client = new BeamClient();

// With OAuth we don't need to login, the OAuth Provider will attach
// the required information to all of our requests after this call.
client.use('oauth', {
    tokens: {
        access: 'ffHfTJZQWx1Rd0JhoAWLgTb6Ky1swTsQhCEtLTidmVp8Hz52crLlxiaEYzkemTeq',
        expires: Date.now() + (365 * 24 * 60 * 60 * 1000)
    },
});

// Get's the user we have access to with the token
client.request('GET', `users/current`)
.then(response => {
    userInfo = response.body;
    return client.chat.join(response.body.channel.id);
})
.then(response => {
    const body = response.body;
    return createChatSocket(userInfo.id, userInfo.channel.id, body.endpoints, body.authkey);
})
.catch(error => {
    console.log('Something went wrong:', error);
});

/**
 * Creates a beam chat socket and sets up listeners to various chat events.
 * @param {any} userId The user to authenticate as
 * @param {any} channelId The channel id to join
 * @param {any} endpoints An endpoints array from a beam.chat.join call.
 * @param {any} authkey An authentication key from a beam.chat.join call.
 * @returns {Promise.<>}
 */
function createChatSocket (userId, channelId, endpoints, authkey) {
    // Chat connection
    const socket = new BeamSocket(endpoints).boot();

    // Greet a joined user
    socket.on('UserJoin', data => {
        socket.call('msg', [`Hi ${data.username}! I'm pingbot! Write !ping and I will pong back!`]);
    });

    // React to our !pong command
    socket.on('ChatMessage', data => {
        if (data.message.message[0].data.toLowerCase().startsWith('!ping')) {
            socket.call('msg', [`@${data.user_name} PONG!`]);
            console.log(`Ponged ${data.user_name}`);
        }
    });

    // Handle errors
    socket.on('error', error => {
        console.error('Socket error', error);
    });

    return socket.auth(channelId, userId, authkey)
    .then(() => {
        console.log('Login successful');
        return socket.call('msg', ['Hi! I\'m pingbot! Write !ping and I will pong back!']);
    });
}
