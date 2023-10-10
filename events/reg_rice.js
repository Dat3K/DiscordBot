const sheet_reader = require('./sheet_reader');
const moment = require('moment-timezone');
moment.locale('vi');
const { EmbedBuilder } = require('discord.js');

module.exports = async (message, channel) => {
  // Tạo một mảng để lưu ID của người dùng đã thả react
  const morningSet = new Set();
  const afternoonSet = new Set();

  try {
    await message.react('⛅');
    await message.react('🌃');

    const collector = message.createReactionCollector({
      time: 20 * 60 * 60 * 1000, // Thời gian đếm, ở đây là 7h <=> 3h sang
      dispose: true, // Bao gồm cả khi người dùng bỏ react
    });

    collector.on('collect', async (reaction, user) => {
      if (user.bot) return;
      const member = await message.guild.members.cache.get(user.id);

      if (reaction.emoji.name === '⛅') {
        morningSet.add(member.nickname || user.tag);
      }

      if (reaction.emoji.name === '🌃') {
        afternoonSet.add(member.nickname || user.tag);
      }
    });

    collector.on('remove', async (reaction, user) => {
      if (user.bot) return;
      const member = await message.guild.members.cache.get(user.id);

      if (reaction.emoji.name === '⛅') {
        morningSet.delete(member.nickname || user.tag);
      }

      if (reaction.emoji.name === '🌃') {
        afternoonSet.delete(member.nickname || user.tag);
      }
    });

    collector.on('end', async () => {
      const morningCount = morningSet.size;
      const afternoonCount = afternoonSet.size;
      let morningArray = Array.from(morningSet);
      let afternoonArray = Array.from(afternoonSet);
      const vietnamTime = moment()
        .tz('Asia/Ho_Chi_Minh')
        .format('dddd, DD/MM/YYYY');

      const setMessage = new EmbedBuilder()
        .setAuthor({
          name: 'Maid Lưu Xá 5',
          iconURL:
            'https://i.pinimg.com/564x/3e/2d/de/3e2dde0a4fe1987cf954df0760479579.jpg',
        })
        .setColor(0xfe0000)
        .setTitle(`Chốt đăng kí cơm ${vietnamTime}`.toUpperCase())
        .setThumbnail(
          'https://media.giphy.com/media/OZyUhzVIMeBLpjbRGn/giphy.gif'
        )
        .addFields(
          {
            name: 'Tổng:',
            value: `Sáng: ${morningCount} \nChiều: ${afternoonCount}`,
          },
          {
            name: 'Sáng',
            value: `🆗\t${morningArray.join('\n🆗\t')}`,
            inline: true,
          },
          {
            name: 'Chiều',
            value: `🆗\t${afternoonArray.join('\n🆗\t')}`,
            inline: true,
          }
        )
        .setTimestamp()
        .setFooter({
          text: 'ChotCom',
          iconURL:
            'https://i.pinimg.com/564x/3e/2d/de/3e2dde0a4fe1987cf954df0760479579.jpg',
        });

      await channel.send({
        content: `➖\n*Danh sách người đăng kí cơm ngày ${vietnamTime}*\n➖`,
        embeds: [setMessage],
      });
      await sheet_reader.appendDataSheet(
        'DangKiCom!A:A',
        morningArray.map((user) => [user, 'Sáng', vietnamTime])
      );
      await sheet_reader.appendDataSheet(
        'DangKiCom!E:E',
        afternoonArray.map((user) => [user, 'Chiều', vietnamTime])
      );
    });
  } catch (error) {
    console.error(error);
  }
};
