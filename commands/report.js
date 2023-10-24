const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('report')
    .setDescription('Dùng để report ẩn danh')
    .addStringOption((option) =>
      option
        .setName('content')
        .setDescription('Nhập vấn đề bạn muốn report')
        .setRequired(true)
    )
    .addAttachmentOption((option) =>
      option
        .setName('attachment')
        .setDescription('Ảnh hoặc video chứng minh')
        .setRequired(false)
    ),
  execute: async (interaction) => {
    try {
      const content = interaction.options.getString('content');
      const attachment = interaction.options.getAttachment('attachment');
      const channel = interaction.guild.channels.cache.get(
        interaction.channelId
      );
      const type = attachment?.contentType.split('/')[0];
      const message = new EmbedBuilder()
        .setAuthor({
          name: 'Một người nào đó'.toUpperCase(),
          iconURL: 'https://cdn.discordapp.com/emojis/1165366736569249832.png',
        })
        .setTitle(content)
        .setColor('#ff2626')
        .setThumbnail(
          'https://cdn.discordapp.com/emojis/1153310666023780393.png'
        )
        .setTimestamp();

      if (type === 'image') {
        message.setImage(attachment.url);
      }
      await channel.send({
        content: '<@&1162022091630059531>',
        embeds: [message],
      });
      if (type === 'video') {
        await channel.send({ files: [attachment.url] });
      }
      await interaction.reply({
        content: '*Đã gửi report*',
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
    }
  },
};
