const { getHousework } = require('./sheet_reader');

module.exports = async (message, channel) => {
  try {
    const housework = await getHousework();
    await channel.send(
      `**Hôm nay ngày ${housework.time.format('DD/MM/YYYY')}**\nĐến lượt <@${
        housework.today[0]
      }> trực phòng nha 🫡\nNgày mai đến lượt **${
        housework.tomorrow[1]
      }** trực phòng nha 🤧`
      );
      await channel.send(`Trực xong rồi nhớ chụp lại nha các bạn 😘`);
      await channel.send(`<:chika:1171364880100626503>`);
      await channel.send(`${housework.image}`);

  } catch (error) {
    console.error(error);
  }
};
