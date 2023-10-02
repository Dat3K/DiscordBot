const { SlashCommandBuilder } = require('@discordjs/builders');
const sheet_reader = require('../events/sheet_reader');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('nhan')
    .setDescription('Ghi lại tiền nhận được')
    .addStringOption((option) =>
      option.setName('from').setDescription('Nguồn tiền').setRequired(true)
    )
    .addStringOption((option) =>
      option.setName('money').setDescription('Số tiền').setRequired(true)
    ),
  execute: async (interaction) => {
    try {
      const { options } = interaction;
      const from = options.getString('from');
      const money = options.getString('money');
      const sheetID = '1os4G_kZkDYtRiTn4Era4p7xEHEV29FkY4haos6RTWxM';

      await sheet_reader.appendDataSheet(
        'earn',
        [
          [
            from,
            money,
            require('moment-timezone')()
              .tz('Asia/Ho_Chi_Minh')
              .format('dddd, HH:mm DD/MM/YYYY'),
          ],
        ],
        sheetID
      );

      await interaction.reply({
        content: `*Đã nhận* **${money}** *từ* **${from}**`,
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
    }
  },
};
