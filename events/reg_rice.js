const sheet_reader = require('./sheet_reader');
const moment = require('moment-timezone');
moment.locale('vi');
const { reg_rice_embed } = require('../embeds/reg_embeds');

module.exports = async (message, channel, hours, minutes) => {
  // Tạo một mảng để lưu ID của người dùng đã thả react
  const morningSet = new Set();
  const nightSet = new Set();

  try {
    // Thả reaction vào tin nhắn
    await message.react('⛅');
    await message.react('🌇');

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
      `Sẽ chốt cơm sau ${moment.duration(timeToTarget).hours()} giờ ${moment
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

      if (reaction.emoji.name === '⛅') {
        morningSet.add(member.nickname || user.tag);
      }

      if (reaction.emoji.name === '🌇') {
        nightSet.add(member.nickname || user.tag);
      }
    });

    collector.on('remove', async (reaction, user) => {
      if (user.bot) return;
      const member = await message.guild.members.cache.get(user.id);

      if (reaction.emoji.name === '⛅') {
        morningSet.delete(member.nickname || user.tag);
      }

      if (reaction.emoji.name === '🌇') {
        nightSet.delete(member.nickname || user.tag);
      }
    });

    collector.on('end', async () => {
      const vietnamTime = moment()
        .tz('Asia/Ho_Chi_Minh')
        .format('dddd, DD/MM/YYYY');
      const embed_message = reg_rice_embed(morningSet, nightSet, vietnamTime);

      // Gửi embed message
      await channel.send({ embeds: [embed_message] });

      // Ghi vào sheet
      await sheet_reader.appendDataSheet(
        'DangKiCom!A:A',
        Array.from(morningSet).map((user) => [user, 'Sáng', vietnamTime])
      );
      await sheet_reader.appendDataSheet(
        'DangKiCom!E:E',
        Array.from(nightSet).map((user) => [user, 'Chiều', vietnamTime])
      );
    });
  } catch (error) {
    console.error(error);
  }
};
