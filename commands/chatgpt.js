const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
require('dotenv').config();
const { OpenAI } = require('openai');
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

      const openai = new OpenAI({
        apiKey: process.env.CHATGPT_API,
      });
      await interaction.reply({
        content: '*Đang nghĩ vui lòng đợi...(khoảng 5 đến 10s)*',
        ephemeral: true,
      });
      const response = await openai.chat.completions.create({
        messages: [{ role: 'user', content: options.getString('question') }],
        model: 'gpt-3.5-turbo-16k',
        max_tokens: 1500,
        temperature: 1,
      });

      await interaction.followUp({
        content: `*Phản hồi từ ChatGPT:* ${response.choices[0].message.content}`,
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
    }
  },
};
