const { getHousework } = require('./sheet_reader');

module.exports = async (message, channel) => {
  try {
    channel.send(`\`\`\`diff\nhello\n\`\`\``);
  } catch (error) {
    console.error(error);
  }
};
