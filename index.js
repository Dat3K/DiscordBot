require("dotenv").config();
const readyEvent = require("./events/ready");
const reg_rice = require("./events/reg_rice");
const { Client, GatewayIntentBits } = require("discord.js");
// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.DirectMessages,
  ],
});
let listChannel;

client.once(readyEvent.name, () => {
  readyEvent.execute(client);
  listChannel = {
    test: client.channels.cache.get("1149187511340515399"),
    riceReg: client.channels.cache.get("1152273873086185504"),
  };
  reg_rice(listChannel.riceReg);
});

client.on("messageCreate", async (message) => {
  if (message.embeds.length > 0) {
    const type = message.embeds[0].data.footer.text;
    if (type == "DangKiCom") {
      console.log("okeee");
      await message.react("⛅");
      await message.react("🌃");
      const collector = message.createReactionCollector({
        time: 8 * 60 * 60 * 1000, // Thời gian đếm, ở đây là 8h <=> 3h sang
        dispose: true, // Bao gồm cả khi người dùng bỏ react
      });

      // Tạo một mảng để lưu ID của người dùng đã thả react
      const morningSet = new Set();
      const afternoonSet = new Set();

      collector.on("collect", (reaction, user) => {
        if (reaction.emoji.name === "⛅") {
          morningSet.add(user.id);
        }

        if (reaction.emoji.name === "🌃") {
          afternoonSet.add(user.id);
        }
      });

      collector.on("remove", (reaction, user) => {
        if (reaction.emoji.name === "⛅") {
          morningSet.delete(user.id);
        }

        if (reaction.emoji.name === "🌃") {
          afternoonSet.delete(user.id);
        }
      });

      collector.on("end", async () => {
        const morningCount = morningSet.size;
        const afternoonCount = afternoonSet.size;
        await listChannel.riceReg.send(
          `**Sáng:** ${morningCount} người ăn\n**Chiều:** ${afternoonCount} người ăn`
        );
        await listChannel.riceReg.send(`➖\n*Danh sách người đăng kí cơm\n➖`);
        let userText;
        morningSet.forEach((element) => {
          const user = message.guild.members.cache.get(element);
          userText += `🆗\t${user.nickname || `<@${element}>`}\n`;
        });
        await listChannel.riceReg.send(userText || "none");
      });
    }
  }
});

// Log in to Discord with your client's token
client.login(process.env.BOT_TOKEN);
module.exports = client;
