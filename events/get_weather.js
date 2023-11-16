const { weather_embed, rain_embed } = require('../embeds/weather_embed');

module.exports = async (channel) => {
  try {
    channel.send({ embeds: [await weather_embed(), await rain_embed()] });
  } catch (error) {
    console.error(error);
  }
};
