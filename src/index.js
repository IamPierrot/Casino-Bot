// require('events').EventEmitter.prototype._maxListeners = 100;
const { Client, Partials, GatewayIntentBits } = require('discord.js');
const eventHandlers = require('./handlers/eventHandler.js');
const playerHanders = require('./handlers/playerHandler.js');
global.configure = require('./config.json');
const { Player } = require('discord-player');

const client = new Client({
     intents: Object.keys(GatewayIntentBits),
     partials: Object.keys(Partials),
     disbleMentions: 'everyone',
});
const player = new Player(client, configure.opt.discordPlayer);

Promise.all([
     require('./utils/functions/clientFunctions.js')(client),
     player.extractors.loadDefault(),

     //handler the events
     eventHandlers(client),
     playerHanders(player),
])
     .then(() => client.login(configure.app.token));

process.on(`unhandledRejection`, (reason, p) => {
     console.log(reason, p)
});
process.on(`uncaughtException`, (err, origin) => {
     console.log(err, origin)
});