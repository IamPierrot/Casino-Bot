const voiceLevelModel = require('../../database/models/voiceLvModel');
const voiceTimeModel = require('../../database/models/voiceTimeModel');
const extraChannelModel = require('../../database/models/extraChannels');
const Roles = require('../../database/data/roles.json');

/**
 * @param {import('discord.js').Client} client 
 */

const schemas = {
     timer: voiceTimeModel,
     user: voiceLevelModel
}
module.exports = async (client, oldState, newState) => {
     try {
          if (newState.member.user.bot) return;

          const userId = newState.member.id;
          const guildID = newState.guild.id;

          let userData = await schemas.user.findOne({ userId: userId, guildId: guildID });
          let extraChannelData = await extraChannelModel.findOne({ guildId: guildID });

          if (newState.channel) {

               new schemas.timer({
                    userId: userId,
                    guildId: guildID,
                    Start: Date.now()
               }).save();

               if (!userData) {
                    userData = new schemas.user({
                         userId: userId,
                         guildId: guildID,
                    }).save();
               }
          }

          if (oldState.channel?.id && !newState.channel?.id) {

               let timerData = await schemas.timer.findOne({ userId: userId, guildId: guildID })
               if (!timerData) return;

               const Time = Date.now() - timerData.Start;
               timerData.deleteOne();

               let exp = Time / 1000 / 60;
               const lvl = userData.level;

               let getXpDefault = configure.levelSystems.xp;

               const generatedXp = Math.floor(Math.random() * getXpDefault);
               const generatedXp2 = Math.floor(Math.random() * configure.levelSystems.extraXP);


               if (extraChannelData && extraChannelData.voiceChannelId.includes(oldState.channel?.id)) {
                    userData.xp += Math.round(generatedXp2 * exp);
               } else {
                    userData.xp += Math.round(generatedXp * exp);
               }

               if (lvl % 5 === 0) {
                    if (oldState.member.roles.cache.get(Roles.voiceRoles[lvl]) && !Roles.voiceRoles[lvl]) return;
                    oldState.member.roles.add(Roles.voiceRoles[lvl]);
               }

               let nextXP = userData.level * 2 * 250;
               userData.nextLevel = nextXP;
               while (userData.xp >= nextXP) {
                    userData.xp = userData.xp - nextXP;
                    userData.level++;
                    nextXP = userData.level * 2 * 250;
                    userData.nextLevel = nextXP;
               }
               userData.totalTime += Time;

               await userData.save();
          }
     } catch (error) {
          console.log("There was an error in voice Xp: ", error);
          return;
     }


}