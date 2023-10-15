const path = require('path');
const { readdirSync } = require('fs');

/**
 * 
 * @param {import('discord-player').Player} player 
 * @returns 
 */


module.exports = (player) => {
     try {
          const PlayerEvents = readdirSync(path.join(__dirname, '..', 'events', 'Player')).filter(file => file.endsWith('.js'));

          for (const file of PlayerEvents) {
               delete require.cache[require.resolve(`../events/Player/${file}`)];
               const PlayerEvent = require(`../events/Player/${file}`);
               player.events.on(file.split('.')[0], PlayerEvent.bind(null));
          }
     } catch (error) {
          console.log('There was an error in player event: ', error);
     }
  
}