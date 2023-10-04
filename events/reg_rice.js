const sheet_reader = require('./sheet_reader');
const moment = require('moment-timezone');

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
      const member = await message.guild.members.cache.get(user.id);

      if (reaction.emoji.name === '⛅') {
        morningSet.add(member.nickname || user.tag);
      }

      if (reaction.emoji.name === '🌃') {
        afternoonSet.add(member.nickname || user.tag);
      }
    });

    collector.on('remove', async (reaction, user) => {
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
      const vietnamTime = moment().tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY');

      await channel.send(
        `**Sáng:** ${morningCount} người ăn\n**Chiều:** ${afternoonCount} người ăn`
      );
      await channel.send(
        `➖\n*Danh sách người đăng kí cơm ngày ${vietnamTime}*\n➖`
      );

      await channel.send(
        `**Sáng:**\n🆗\t${morningArray.join(
          '\n🆗\t'
        )}\n➖➖➖\n**Chiều:**\n🆗\t${afternoonArray.join('\n🆗\t')}`
      );

      await sheet_reader.appendDataSheet(
        'DangKiCom',
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
