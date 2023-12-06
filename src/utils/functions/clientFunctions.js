const { EmbedBuilder, Collection } = require('discord.js');
const balanceModel = require('../../database/models/balanceModel');
const getAllFile = require('../getAllFiles.js');
const getLocalCommand = require('../getLocalCommands.js');
const getTextCommand = require('../getTextCommands.js');
const prefixModel = require('../../database/models/prefixModel.js');
// const djRoleModel = require('../../database/models/dJRoleModel.js');

/**
 * 
 * @param {import('discord.js').Client} client 
 */

module.exports = (client) => {
     client.components = new Collection();
     client.timeStampUser = new Collection();
     ////////////////////////// check Id yêu cầu nhạc

     client.checkIdRequest = (track, userId) => {
          if (track.requestedBy.id !== userId) {
               return new EmbedBuilder()
                    .setAuthor({ name: `❌ Có lỗi khi yêu cầu dừng/bỏ qua bài hát` })
                    .setDescription(`Bài hát này là yêu cầu của : ${track.requestedBy.toString()}`)
          } else {
               return false;
          }
     }

     ///////////////////////// Freefire

     client.getFiles = (directory, foldersOnly) => getAllFile(directory, foldersOnly);
     client.getPrefixCommands = (exeption) => getTextCommand(exeption);
     client.getSlashCommands = (exeption) => getLocalCommand(exeption);
     client.getPrefix = async (guildId) => {
          const prefixData = await prefixModel.findOne({ guildId: guildId });
          if (!prefixData) return null;
          return prefixData;
     }
     // client.checkDjRole = async (userId, guildId) => {
     //      const dJRoleData = await djRoleModel.findOne({ userId: userId, guildId: guildId });
     //      if (!dJRoleData) return false;
     //      return true;
     // }

     //////////////////////// Balance
     client.xemTien = (userId) => new Promise(async ful => {
          const data = await balanceModel.findOne({ userId: userId });
          if (!data) return ful(0);
          ful(data.money);
     });

     client.addTien = async (userId, soTien) => {
          try {
               let data = await balanceModel.findOne({ userId: userId });
               if (!data) data = new balanceModel({
                    userId: userId,
                    money: soTien
               })
               else data.money += soTien;
               await data.save();
          } catch (err) {
               console.log("Lỗi add tiền: ", err);
          }
     }

     client.truTien = async (userId, soTien) => {
          try {
               let data = await balanceModel.findOne({ userId: userId });
               if (!data) data = new balanceModel({
                    userId: userId,
               });
               if (data.money >= soTien) data.money -= soTien;
               await data.save();

          } catch (err) {
               console.log("Lỗi trừ tiền: ", err);
          }
     }
}