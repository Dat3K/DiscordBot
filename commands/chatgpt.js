const { SlashCommandBuilder } = require('@discordjs/builders');
require('dotenv').config();
const axios = require('axios');
const url = 'https://api.openai.com/v1/completions';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('chatgpt')
    .setDescription(
      'Nếu các ngươi thành tâm muốn biết, thì chúng tôi sẵn sàng trả lời'
    )
    .addStringOption((option) =>
      option
        .setName('question')
        .setDescription('Nhập câu hỏi')
        .setRequired(true)
    ),
  execute: async (interaction) => {
    try {
      const { options } = interaction;
      const response = await axios.post(
        url,
        {
          prompt: options.getString('question'),
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.CHATGPT_API}`,
          },
        }
      );
      if (response.status === 200) {
        // API trả về thành công
        await interaction.reply({
          content: response.data.choices[0].text,
          ephemeral: false,
        });
      } else if (response.status === 429) {
        // Bị giới hạn rate
        await interaction.reply({
          content: '*Server bị giới hạn, hãy thử lại sau!*',
          ephemeral: true,
        });
      } else if (response.status >= 500) {
        // Lỗi server
        await interaction.reply({
          content: '*Server bị lỗi, hãy thử lại!*',
          ephemeral: true,
        });
      } else {
        // Các lỗi 400 khác
        await interaction.reply({
          content: `Mã lỗi: ${response.status}`,
          ephemeral: true,
        });
      }
    } catch (error) {
      console.error(error);
    }
  },
};
