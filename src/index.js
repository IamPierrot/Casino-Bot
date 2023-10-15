// require('events').EventEmitter.prototype._maxListeners = 100;
const { Client, Partials, IntentsBitField } = require('discord.js');
const eventHandlers = require('./handlers/eventHandler.js');
const playerHanders = require('./handlers/playerHandler.js');
global.configure = require('./config.json');
const { Player } = require('discord-player');

const client = new Client({
     intents: [
          IntentsBitField.Flags.GuildMembers,
          IntentsBitField.Flags.GuildMessages,
          IntentsBitField.Flags.MessageContent,
          IntentsBitField.Flags.Guilds,
          IntentsBitField.Flags.GuildVoiceStates,
          IntentsBitField.Flags.GuildModeration,
     ],
     partials: [
          Partials.Channel,
          Partials.Message,
          Partials.User,
          Partials.GuildMember
     ],
     disbleMentions: 'everyone',
});
const player = new Player(client, configure.opt.discordPlayer);

Promise.all([
     require('./utils/functions/clientFunctions.js')(client),
     player.extractors.loadDefault(),
     eventHandlers(client),//handler the events
     playerHanders(player),
])
     .then(() => client.login(configure.app.token))