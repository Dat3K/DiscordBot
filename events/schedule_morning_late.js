const { EmbedBuilder } = require('discord.js');
const schedule = require('node-schedule');
const moment = require('moment-timezone');
const rule = new schedule.RecurrenceRule();
rule.tz = 'Asia/Ho_Chi_Minh';
rule.dayOfWeek = [0, new schedule.Range(0, 6)];
rule.hour = 5;
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
        .setColor(0xfff759)
        .setTitle(
          `xin trễ sáng ${moment()
            .tz('Asia/Ho_Chi_Minh')
            .format('dddd, DD/MM/YYYY')}`.toUpperCase()
        )
        .setDescription(
          'Thả reaction bên dưới để xin trễ'
        )
        .setThumbnail(
          'https://media.giphy.com/media/1479Vz8EGUyzmAwe9L/giphy.gif'
        )
        .addFields(
          { name: '\u200B', value: '**Thả <:sang:1159164194256592896> để đăng kí trễ sáng**' },
          { name: '\u200B', value: '\t' }
        )
        .setTimestamp()
        .setFooter({
          text: 'TreSang',
          iconURL:
            'https://i.pinimg.com/564x/3e/2d/de/3e2dde0a4fe1987cf954df0760479579.jpg',
        });
      channel.send({ content: '@everyone', embeds: [embedMessage] });
    } catch (error) {
      console.error(error);
    }
  });
