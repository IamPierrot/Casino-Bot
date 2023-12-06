const voiceLevelModel = require('../../database/models/voiceLvModel');
const extraChannelModel = require('../../database/models/extraChannels');
const Roles = require('../../database/data/roles.json');
const { EmbedBuilder } = require('discord.js')

/**
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').VoiceState} oldState 
 */

const delay = 1000;
module.exports = async (client, oldState, newState) => {
     try {
          if (newState.member.user.bot) return;

          const userId = newState.member.id;
          const guildID = newState.guild.id;

          
          if (newState.channel) {
               
               if (!(await voiceLevelModel.findOne({ userId: userId, guildId: guildID }))) new voiceLevelModel({ userId: userId, guildId: guildID }).save();
               
               const timeInterVal = setInterval(async () => await addLevel(userId), delay);
               client.timeStampUser.set(userId, timeInterVal);
          }
          
          const addLevel = async (userId) => {
               const xpDefault = configure.levelSystems.xp;
               const userVoiceData = await voiceLevelModel.findOne({ userId: userId, guildId: guildID });
               // const lvl = userVoiceData.level;
               
               const Time = delay;
               const exp = Time / 100 / 60;
               const generatedXp = Math.floor(Math.random() * xpDefault);
               const generatedXp2 = Math.floor(Math.random() * configure.levelSystems.extraXP);
               
               const extraChannelData = await extraChannelModel.findOne({ guildId: guildID });
               if (extraChannelData && extraChannelData.voiceChannelId.includes(oldState.channel?.id)) {
                    userVoiceData.xp += Math.round(generatedXp2 * exp);
                    await userVoiceData.save();
               } else {
                    userVoiceData.xp += Math.round(generatedXp * exp);
                    await userVoiceData.save();
               }

               // if (lvl % 5 === 0) {
               //      if (oldState.member.roles.cache.get(Roles.voiceRoles[lvl]) && !Roles.voiceRoles[lvl]) return;
               //      oldState.member.roles.add(Roles.voiceRoles[lvl]);
               // }

               let nextXP = userVoiceData.level * 2 * 250;
               userVoiceData.nextLevel = nextXP;
               while (userVoiceData.xp >= nextXP) {
                    userVoiceData.xp = userVoiceData.xp - nextXP;
                    userVoiceData.level++;

                    nextXP = userVoiceData.level * 2 * 250;
                    userVoiceData.nextLevel = nextXP;
                    await userVoiceData.save();

                    const channel = client.guilds.cache.get("1068154011313774592").channels.cache.get("1130071882402631781");

                    const levelEmbeds = new EmbedBuilder()
                         .setColor("Random")
                         .setDescription(`**Chúc mừng** <@${userId}>! Bạn đẵ lên **Cấp ${userVoiceData.level}** \n Tặng bạn quả role vjp pro`)
                         .setTimestamp()
                    await channel.send({ embeds: [levelEmbeds] });
               }
               userVoiceData.totalTime += delay;
               await userVoiceData.save();
          }



          if (oldState.channel?.id && !newState.channel?.id) {
               clearInterval(client.timeStampUser.get(userId));
               client.timeStampUser.delete(userId);
          }
     } catch (error) {
          console.log("There was an error in voice Xp: ", error);
          return;
     }
}

