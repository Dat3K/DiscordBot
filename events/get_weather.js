const weatherEmbed = require('../embeds/weather_embed');
module.exports = async (channel) => {
    try {
        channel.send({ embeds: [await weatherEmbed()] });
    } catch (error) {
      console.error(error);
    }
  };