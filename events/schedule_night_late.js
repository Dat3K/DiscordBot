const { EmbedBuilder } = require('discord.js');
const schedule = require('node-schedule');
const moment = require('moment-timezone');
const rule = new schedule.RecurrenceRule();
rule.tz = 'Asia/Ho_Chi_Minh';
rule.dayOfWeek = [0, new schedule.Range(0, 6)];
rule.hour = 11;
rule.minute = 15;

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
        .setColor(0xff00dd)
        .setTitle(
          `xin trễ tối ${moment()
            .tz('Asia/Ho_Chi_Minh')
            .format('dddd, DD/MM/YYYY')}`.toUpperCase()
        )
        .setDescription('Thả reaction bên dưới để xin trễ')
        .setThumbnail('https://eactious.sirv.com/LX5/gif/night.gif')
        .addFields({
          name: '\u200B**Thả <:toi:1159164192218157187> để đăng kí trễ tối**',
          value: '\u200B',
        })
        .setTimestamp()
        .setFooter({
          text: 'TreToi',
          iconURL:
            'https://i.pinimg.com/564x/3e/2d/de/3e2dde0a4fe1987cf954df0760479579.jpg',
        });
      channel.send({ content: '@everyone', embeds: [embedMessage] });
    } catch (error) {
      console.error(error);
    }
  });
