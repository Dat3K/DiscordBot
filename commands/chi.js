const { SlashCommandBuilder } = require('@discordjs/builders');
const sheet_reader = require('../events/sheet_reader');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('chi')
    .setDescription('Ghi món cần chi')
    .addStringOption((option) =>
      option.setName('name').setDescription('Món cần chi').setRequired(true)
    )
    .addStringOption((option) =>
      option.setName('price').setDescription('Số tiền').setRequired(true)
    ),
  execute: async (interaction) => {
    try {
      const { options } = interaction;
      const name = options.getString('name');
      const price = options.getString('price');
      const sheetID = '1os4G_kZkDYtRiTn4Era4p7xEHEV29FkY4haos6RTWxM';
      await sheet_reader.appendDataSheet(
        'spend',
        [
          [
            name,
            price,
            require('moment-timezone')()
              .tz('Asia/Ho_Chi_Minh')
              .format('dddd, HH:mm DD/MM/YYYY'),
          ],
        ],
        sheetID
      );
      await interaction.reply({
        content: `Đang ghi lại món cần chi **${name}**`,
        ephemeral: true,
      });
      await interaction.followUp({
        content: `*Đã thêm* **${name}** *với giá* **${price}**`,
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
    }
  },
};
