const moment = require('moment-timezone');
const vietnamTime = moment().tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY');

module.exports = async (message, channel, hours, minutes) => {
  const emojiAfternoon = '<:toi:1159164192218157187>';
  // Tạo một mảng để lưu ID của người dùng đã thả react
  const afternoonSet = new Set();

  try {
    // Thả reaction vào tin nhắn
    await message.react(emojiAfternoon);

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
      `Sẽ chốt trễ tối sau ${moment.duration(timeToTarget).hours()} giờ ${moment
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

      if (reaction.emoji.name === 'toi') {
        afternoonSet.add(member.nickname);
      }
    });

    collector.on('remove', async (reaction, user) => {
      if (user.bot) return;
      const member = await message.guild.members.cache.get(user.id);

      if (reaction.emoji.name === 'toi') {
        afternoonSet.delete(member.nickname);
      }
    });

    collector.on('end', async () => {
      const afternoonCount = afternoonSet.size;
      let afternoonArray = Array.from(afternoonSet);

      await channel.send(
        `**Danh sách người đăng kí trễ tối ngày ${vietnamTime}:**
      *Số lượng: ${afternoonCount}*\n➖➖➖➖➖\n🆗\t${afternoonArray.join(
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
