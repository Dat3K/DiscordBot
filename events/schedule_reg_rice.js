const { EmbedBuilder } = require('discord.js');
const schedule = require('node-schedule');
const moment = require('moment-timezone');
const rule = new schedule.RecurrenceRule();
rule.tz = 'Asia/Ho_Chi_Minh';
rule.dayOfWeek = [0, new schedule.Range(0, 6)];
rule.hour = 7;
rule.minute = 0;

module.exports = (channel) =>
  new schedule.scheduleJob(rule, () => {
    try {
      moment.locale('vi');
      const embedMessage = new EmbedBuilder()
        .setAuthor({
          name: 'Maid Lưu Xá 5',
          iconURL:
            'https://i.pinimg.com/564x/3e/2d/de/3e2dde0a4fe1987cf954df0760479579.jpg',
        })
        .setColor(0xff3dcb)
        .setTitle(
          `đăng kí cơm ${moment()
            .tz('Asia/Ho_Chi_Minh')
            .add(1, 'days')
            .format('dddd, DD/MM/YYYY')}`.toUpperCase()
        )
        .setDescription(
          'Thả reaction bên dưới để đăng kí cơm\nSẽ tự động chốt vào lúc 3h sáng'
        )
        .setThumbnail(
          'https://media.giphy.com/media/2voeXtCQUHS1ktx6KN/giphy.gif'
        )
        .addFields(
          { name: '\u200B', value: '**Thả ⛅ để đăng kí cơm sáng**' },
          { name: '\u200B', value: '**Thả 🌃 để đăng kí cơm chiều**' },
          { name: '\u200B', value: '\t' }
        )
        .setTimestamp()
        .setFooter({
          text: 'DangKiCom',
          iconURL:
            'https://i.pinimg.com/564x/3e/2d/de/3e2dde0a4fe1987cf954df0760479579.jpg',
        });
      channel.send({ content: '@everyone', embeds: [embedMessage] });
    } catch (error) {
      console.error(error);
    }
  });
