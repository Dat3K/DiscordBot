const moment = require('moment-timezone');
moment.locale('vi');
const { reg_late_embed } = require('../embeds/reg_embeds');

module.exports = async (message, channel) => {
  const emojiAfternoon = '<:toi:1159164192218157187>';
  // Tạo một mảng để lưu ID của người dùng đã thả react
  const afternoonSet = new Set();

  try {
    // Thả reaction vào tin nhắn
    await message.react(emojiAfternoon);

    // Lấy thời gian hiện tại và thời gian chốt đăng kí
    const now = moment().tz('Asia/Ho_Chi_Minh');
    const vietnamTime = now.format('dddd, DD/MM/YYYY');
    const hour = 6;
    const minutes = 15;
    const target = moment()
      .tz('Asia/Ho_Chi_Minh')
      .set({ hour: hour, minute: minutes });
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
      await channel.send({
        embeds: [reg_late_embed(afternoonSet, 'Chiều', vietnamTime)],
      });
    });
  } catch (error) {
    console.error(error);
  }
};
