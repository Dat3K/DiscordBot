const moment = require('moment-timezone');
moment.locale('vi');
const { reg_late_embed } = require('../embeds/reg_embeds');

module.exports = async (message, channel) => {
  const emojiMorning = '<:sang:1159164194256592896>';
  // Tạo một mảng để lưu ID của người dùng đã thả react
  const morningSet = new Set();

  try {
    // Lấy thời gian hiện tại và thời gian chốt đăng kí
    const now = moment().tz('Asia/Ho_Chi_Minh');
    const vietnamTime = now.format('dddd, DD/MM/YYYY');
    const hour = 11;
    const minute = 0;
    const target = moment()
      .tz('Asia/Ho_Chi_Minh')
      .set({ hour: hour, minute: minute });
    const timeToTarget = target.diff(now);

    console.log(
      `Sẽ chốt trễ sáng sau ${moment
        .duration(timeToTarget)
        .hours()} giờ ${moment.duration(timeToTarget).minutes()} phút`
    );

    // Thả reaction vào tin nhắn
    await message.react(emojiMorning);

    await channel.send(
      `⬆️ *Xin trễ sáng ${vietnamTime}* ⬆️`
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
      await channel.send({
        embeds: [reg_late_embed(morningSet, 'Sáng', vietnamTime)],
      });
    });
  } catch (error) {
    console.error(error);
  }
};
