const { EmbedBuilder } = require('discord.js');
const { useMainPlayer, QueryType } = require('discord-player');


module.exports = {
     name: 'playlist',
     description: 'bật 1 playlist youtube',
     aliases: ['pl'],
     voiceChannel: true,
     /**
      * 
      * @param {*} client 
      * @param {import('discord.js').Message} message 
      * @param {*} args 
      * @returns 
      */
     callback: async (client, message, args) => {
          const player = useMainPlayer();

          const song = args.join(' ');
          const res = await player.search(song, {
               requestedBy: message.member,
               searchEngine: QueryType.YOUTUBE_PLAYLIST
          });
          const NoResultsEmbed = new EmbedBuilder()
               .setAuthor({ name: `Không tìm thấy playlist hoặc playlist đang ở chế độ private.... thử lại? ❌` })
               .setColor('#2f3136')

          if (!res || !res.tracks.length) return await message.reply({ embeds: [NoResultsEmbed] });

          const queue = player.nodes.create(message.guildId, { //guildQueue
               metadata: message.channel,
               spotifyBridge: configure.opt.spotifyBridge,
               volume: configure.opt.volume,
               leaveOnEmpty: configure.opt.leaveOnEmpty,
               leaveOnEmptyCooldown: configure.opt.leaveOnEmptyCooldown,
               leaveOnEnd: configure.opt.leaveOnEnd,
               leaveOnEndCooldown: configure.opt.leaveOnEndCooldown,
          });

          try {
               if (!queue.connection) await queue.connect(message.member.voice.channel);
          } catch {
               await player.queues.delete(message.guildId);

               const NoVoiceEmbed = new EmbedBuilder()
                    .setAuthor({ name: `Mình không thể kết nối được với voice channel.... thử lại ? ❌` })
                    .setColor('0xFF0000')

               return await message.reply({ embeds: [NoVoiceEmbed] });
          }
          const track = res.tracks[0]; //Track
          queue.addTrack(res.tracks);

          if (!queue.isPlaying()) {
               await queue.node.play();
          }

          const playEmbed = new EmbedBuilder()
               .setAuthor({ name: `🎧 ĐÃ THÊM VÀO HÀNG PHÁT`, iconURL: track.requestedBy.avatarURL() })
               .setColor('#4d1aff')
               .setDescription(`
               :notes:  **${track.toHyperlink()}** \n \
               \n \
               :small_blue_diamond: Được thêm vào bởi : ${track.requestedBy.toString()} 
               :small_blue_diamond: Nguồn tìm kiếm : ${track.queryType}
               `)
               .setTimestamp()
               .setFooter({ text: 'Âm nhạc đi trước - Tình yêu theo sau ❤️' })


          await message.reply({ embeds: [playEmbed] });


     }
}