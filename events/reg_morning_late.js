const moment = require('moment-timezone');
const vietnamTime = moment().tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY');

module.exports = async (message, channel) => {
  const emojiMorning = '<:sang:1159164194256592896>';
  // Tạo một mảng để lưu ID của người dùng đã thả react
  const morningSet = new Set();

  try {
    await message.react(emojiMorning);
    const collector = message.createReactionCollector({
      time: 6 * 60 * 60 * 1000, // Từ 5h sáng đến 11 => 6h
      dispose: true, // Bao gồm cả khi người dùng bỏ react
    });

    collector.on('collect', async (reaction, user) => {
      const member = await message.guild.members.cache.get(user.id);

      if (reaction.emoji.name === 'sang') {
        morningSet.add(member.nickname);
      }
    });

    collector.on('remove', async (reaction, user) => {
      const member = await message.guild.members.cache.get(user.id);

      if (reaction.emoji.name === 'sang') {
        morningSet.delete(member.nickname);
      }
    });

    collector.on('end', async () => {
      const morningCount = morningSet.size;
      let morningArray = Array.from(morningSet);

      await channel.send(
        `**Danh sách người đăng kí trễ sáng ngày ${vietnamTime}:**
      *Số lượng: ${morningCount}*\n➖➖➖➖➖\n🆗\t${morningArray.join(
          '\n🆗\t'
        )}`
      );
      await channel.send(
        `*Bếp sau khi viết lên bảng thì hãy chụp và gửi lên đây 📸*`
      );
    });
  } catch (error) {
    console.error(error);
  }
};
