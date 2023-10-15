const { EmbedBuilder } = require('discord.js');
const userModel = require('../../database/models/user.js');
const balanceModel = require('../../database/models/balanceModel');

/**
 * 
 * @param {import('discord.js').Client} client 
 */

module.exports = (client) => {
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
               else if (data.money >= soTien) data.money -= soTien;
               await data.save();

          } catch (err) {
               console.log("Lỗi trừ tiền: ", err);
          }
     }
}