const { EmbedBuilder } = require('discord.js');
const chatLevelModel = require('../../database/models/chatLvModel');
const Roles = require('../../database/data/roles.json');
const extraChannelModel = require('../../database/models/extraChannels');

const talkedRecently = new Map();
module.exports = async (client, message ) => {
     try {
          if (message.author.bot || !message.guild || message.content.toLowerCase().startsWith(prefix.toLowerCase())) return;
          let chatData = await chatLevelModel.findOne({ guildId: message.guildId, userId: message.author.id });
          let extraChannelData = await extraChannelModel.findOne({ guildId: message.guildId });
          
          if (chatData) {
               const lvl = toString(chatData.level);

               let getXpDefault = configure.levelSystems.xp;
               let getCooldownfromDB = configure.levelSystems.cooldown;

               const generatedXp = Math.floor(Math.random() * getXpDefault);
               const generatedXp2 = Math.floor(Math.random() * configure.levelSystems.extraXP);
             

               const messageContents = message.content.split(" ");
               if (talkedRecently.get(message.author.id) || messageContents.length < 2) {
                    return;
               } else {
                    if (extraChannelData && extraChannelData.chatChannelId?.includes(message.channel.id)) {
                         chatData.xp += generatedXp2;
                    } else {
                         chatData.xp += generatedXp;
                    }
                    chatData.totalText += messageContents.length;

                    let nextXP = chatData.level * 2 * 250;
                    
                    while (chatData.xp >= nextXP) {
                         
                         chatData.xp = chatData.xp - nextXP;
                         chatData.level++;
                         nextXP = chatData.level * 2 *250;
                         chatData.nextLevel = nextXP;

                         const levelEmbeds = new EmbedBuilder()
                              .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                              .setColor("Random")
                              .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                              .setDescription(`**Chúc mừng** ${message.author}! Bạn đẵ lên **Cấp ${chatData.level}** \n Tặng bạn quả role vjp pro`)
                              .setTimestamp()

                         await message.channel.send({ embeds: [levelEmbeds] });
                    }

                    talkedRecently.set(message.author.id, Date.now() + getCooldownfromDB);
                    setTimeout(() => talkedRecently.delete(message.author.id, Date.now() + getCooldownfromDB), getCooldownfromDB)
                    await chatData.save();
               }
               if (lvl % 5 === 0) {
                    if (message.member.roles.cache.get(Roles.ChatRoles[lvl]) && Roles.ChatRoles[lvl]) return;
                    await message.member.roles.add(Roles.ChatRoles[lvl]);
               }

          } else {
               chatData = new chatLevelModel({ guildId: message.guild.id, userId: message.author.id })
               await chatData.save();
               return;
          }
          await chatData.save();

     } catch (error) {
          console.log("There was an error in handler XP: ", error);
     }
}