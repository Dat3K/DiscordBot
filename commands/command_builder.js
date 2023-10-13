const { REST, Routes } = require('discord.js');
const chiCommand = require('./chi');
const nhanCommand = require('./nhan');
const chatgptCommand = require('./chatgpt');
const read_msg = require('./read_msg');
require('dotenv').config();

const commands = [
  chiCommand.data.toJSON(), // Chuyển đổi SplashCommandBuilder thành dạng JSON
  nhanCommand.data.toJSON(),
  chatgptCommand.data.toJSON(),
  read_msg.data.toJSON(),
];

const rest = new REST().setToken(process.env.BOT_TOKEN);

(async () => {
  try {
    console.log('Bắt đầu đăng ký lệnh.');

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      {
        body: commands,
      }
    );
    console.log('Đã đăng ký lệnh thành công!');
  } catch (error) {
    console.error(error);
  }
})();
