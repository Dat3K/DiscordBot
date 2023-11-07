const sheet_reader = require('./sheet_reader');
const moment = require('moment-timezone');
moment.locale('vi');
const { reg_rice_embed } = require('../embeds/reg_embeds');

module.exports = async (message, channel) => {
  try {
    // Tạo một mảng để lưu ID của người dùng đã thả react
    const morningSet = new Set();
    const nightSet = new Set();

    // Lấy thời gian hiện tại và thời gian chốt đăng kí
    const timestamp = message.createdTimestamp;
    const sentDate = new Date(timestamp);
    const now = moment(sentDate).tz('Asia/Ho_Chi_Minh');
    const hour = 3;
    const minute = 0;
    const target = moment()
      .tz('Asia/Ho_Chi_Minh')
      .add(1, 'days')
      .set({ hour: hour, minute: minute });
    const targetTime = target.format('dddd, DD/MM/YYYY');
    const timeToTarget = target.diff(now);

    console.log(
      `Sẽ chốt cơm sau ${moment.duration(timeToTarget).hours()} giờ ${moment
        .duration(timeToTarget)
        .minutes()} phút`
    );

    // Thả reaction vào tin nhắn
    await message.react('⛅');
    await message.react('🌇');

    // Nhắn thời gian hiện tại
    await channel.send(
      `⬆️ *Đăng kí cơm ${now.add(1, 'days').format('dddd, DD/MM/YYYY')}* ⬆️`
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
      const embed_message = reg_rice_embed(morningSet, nightSet, targetTime);

      // Gửi embed message
      await channel.send({ embeds: [embed_message] });

      // Ghi vào sheet
      await sheet_reader.appendDataSheet(
        'DangKiCom!A:A',
        Array.from(morningSet).map((user) => [user, 'Sáng', targetTime])
      );
      await sheet_reader.appendDataSheet(
        'DangKiCom!E:E',
        Array.from(nightSet).map((user) => [user, 'Chiều', targetTime])
      );
    });
  } catch (error) {
    console.error(error);
  }
};
