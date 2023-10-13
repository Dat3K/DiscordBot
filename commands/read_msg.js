const { SlashCommandBuilder } = require('@discordjs/builders');
const moment = require('moment-timezone');
moment.locale('vi');
const { reg_rice_embed, reg_late_embed } = require('../embeds/reg_embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('read_msg')
    .setDescription('Đọc lại tin nhắn và chốt cơm')
    .addStringOption((option) =>
      option
        .setName('message_id')
        .setDescription('Nhập ID tin nhắn')
        .setRequired(true)
    ),
  execute: async (interaction, listHour) => {
    try {
      const { options } = interaction;
      const message_id = options.getString('message_id');
      const message = await interaction.channel.messages.fetch(message_id);
      if (message.embeds.length === 0) {
        await interaction.reply({
          content: `Tin nhắn không phải là embed`,
          ephemeral: true,
        });
        return;
      }

      const now = moment().tz('Asia/Ho_Chi_Minh');

      const embedText = message.embeds[0].data.footer.text;
      console.log(`Footer: ${embedText}`);

      // Đọc lại tin nhắn và chốt cơm
      if (embedText == 'DangKiCom') {
        await message.react('⛅');
        await message.react('🌇');
        const targetTime = moment().tz('Asia/Ho_Chi_Minh').set({
          hour: listHour.rice.hour,
          minute: listHour.rice.minute,
        });
        if (
          now.hour() >= listHour.rice.hour &&
          now.minute() >= listHour.rice.minute
        ) {
          targetTime.add(1, 'days');
        }
        const timeToTarget = targetTime.diff(now);
        const timeToTargetMoment = moment.duration(timeToTarget);

        // Chốt đăng kí cơm
        setTimeout(async () => {
          const usersMorning = new Set();
          const usersNight = new Set();
          const messageAfter = await interaction.channel.messages.fetch(
            message_id
          );
          const morningSetReaction = messageAfter.reactions.cache.get('⛅');
          const nightSetReaction = messageAfter.reactions.cache.get('🌇');
          const morningSet = await morningSetReaction.users.fetch();
          const nightSet = await nightSetReaction.users.fetch();

          const vietnamTime = moment()
            .tz('Asia/Ho_Chi_Minh')
            .format('dddd, DD/MM/YYYY');
          morningSet.forEach((user) => {
            if (!user.bot) {
              const userNickName = interaction.guild.members.cache.get(
                user.id
              ).nickname;
              usersMorning.add(userNickName);
            }
          });
          nightSet.forEach((user) => {
            if (!user.bot) {
              const userNickName = interaction.guild.members.cache.get(
                user.id
              ).nickname;
              usersNight.add(userNickName);
            }
          });
          await interaction.channel.send({
            embeds: [reg_rice_embed(usersMorning, usersNight, vietnamTime)],
          });
          await sheet_reader.appendDataSheet(
            'DangKiCom!A:A',
            Array.from(usersMorning).map((user) => [user, 'Sáng', vietnamTime])
          );
          await sheet_reader.appendDataSheet(
            'DangKiCom!E:E',
            Array.from(usersNight).map((user) => [user, 'Chiều', vietnamTime])
          );
        }, timeToTarget);
        console.log(
          `Sẽ chốt đăng kí cơm sau ${timeToTargetMoment.hours()} giờ ${timeToTargetMoment.minutes()} phút`
        );
        interaction.reply({
          content: `Đã đọc lại tin nhắn và chốt đăng kí cơm`,
          ephemeral: true,
        });
      } // Đăng kí cơm

      // Đọc lại tin nhắn và chốt trễ
      if (embedText == 'TreSang' || embedText == 'TreToi') {
        let hour;
        let minute;
        let emoji;
        let emojiID;

        if (embedText == 'TreSang') {
          hour = listHour.morning_late.hour;
          minute = listHour.morning_late.minute;
          emoji = '<:sang:1159164194256592896>';
          emojiID = '1159164194256592896';
        }
        if (embedText == 'TreToi') {
          hour = listHour.night_late.hour;
          minute = listHour.night_late.minute;
          emoji = '<:toi:1159164192218157187>';
          emojiID = '1159164192218157187';
        }
        await message.react(emoji);
        const targetTime = moment().tz('Asia/Ho_Chi_Minh').set({
          hour: hour,
          minute: minute,
        });
        if (now.hour() >= hour && now.minute() >= minute) {
          targetTime.add(1, 'days');
        }
        const timeToTarget = targetTime.diff(now);
        const timeToTargetMoment = moment.duration(timeToTarget);

        // Chốt danh sách trễ sáng
        setTimeout(async () => {
          const vietnamTime = moment()
            .tz('Asia/Ho_Chi_Minh')
            .format('dddd, DD/MM/YYYY');
          const usersLate = new Set();
          const messageAfter = await interaction.channel.messages.fetch(
            message_id
          );
          const lateSetReaction = messageAfter.reactions.cache.get(emojiID);
          const lateSet = await lateSetReaction.users.fetch();

          lateSet.forEach((user) => {
            if (!user.bot) {
              const userNickName = interaction.guild.members.cache.get(
                user.id
              ).nickname;
              usersLate.add(userNickName);
            }
          });
          await interaction.channel.send({
            embeds: [
              embedText == 'TreSang'
                ? reg_late_embed(usersLate, 'Sáng', vietnamTime)
                : reg_late_embed(usersLate, 'Chiều', vietnamTime),
            ],
          });
        }, 3000);
        console.log(
          `Sẽ chốt danh sách trễ sau ${timeToTargetMoment.hours()} giờ ${timeToTargetMoment.minutes()} phút`
        );
        interaction.reply({
          content: `Đã đọc lại tin nhắn và chốt danh sách trễ`,
          ephemeral: true,
        });
      } // Đọc lại tin nhắn và chốt trễ
    } catch (error) {
      console.error(error);
    }
  },
};
