const { getHousework } = require('./sheet_reader');

//==============Hàm đăng lịch trực phòng=====================
module.exports = async (channel) => {
  try {
    const housework = await getHousework();
    await channel.send(
      `**Hôm nay ngày ${housework.time.format('DD/MM/YYYY')}**\nĐến lượt <@${
        housework.today[0]
      }> trực phòng nha')`
    );
    await channel.send(
      `\nNgày mai đến lượt <@${housework.tomorrow[0]}> trực phòng nha`
    );
    await channel.send(
      `Trực xong rồi nhớ chụp lại nha các bạn (Chika-chan wit luv 😘)`
    );
    await channel.send(`<:chika:1171364880100626503>`);
  } catch (error) {
    console.error(error);
  }
};
