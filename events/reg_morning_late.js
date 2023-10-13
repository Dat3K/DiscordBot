const moment = require('moment-timezone');
const vietnamTime = moment().tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY');

module.exports = async (message, channel, hours, minutes) => {
  const emojiMorning = '<:sang:1159164194256592896>';
  // Tạo một mảng để lưu ID của người dùng đã thả react
  const morningSet = new Set();

  try {
    // Thả reaction vào tin nhắn
    await message.react(emojiMorning);

    // Lấy thời gian hiện tại và thời gian chốt đăng kí
    const now = moment().tz('Asia/Ho_Chi_Minh');
    const target = moment()
      .tz('Asia/Ho_Chi_Minh')
      .set({ hour: hours, minute: minutes });
    if (now.hour() >= hours && now.minute() >= minutes) {
      target.add(1, 'days');
    }
    const timeToTarget = target.diff(now);
    console.log(
      `Sẽ chốt trễ sáng sau ${moment.duration(timeToTarget).hours()} giờ ${moment
        .duration(timeToTarget)
        .minutes()} phút`
    );

    // Đặt thời gian chốt đăng kí
    const collector = message.createReactionCollector({
      time: timeToTarget,
      dispose: true, // Bao gồm cả khi người dùng bỏ react
    });

    collector.on('collect', async (reaction, user) => {
      if (user.bot) return;
      const member = await message.guild.members.cache.get(user.id);

      if (reaction.emoji.name === 'sang') {
        morningSet.add(member.nickname);
      }
    });

    collector.on('remove', async (reaction, user) => {
      if (user.bot) return;
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
