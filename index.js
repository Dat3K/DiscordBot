require("dotenv").config();
const readyEvent = require("./events/ready");
const reg_rice = require("./events/reg_rice");
const log = require("./events/write_log");
const reg_morning_late = require("./events/reg_morning_late");
const reg_night_late = require("./events/reg_night_late");
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
    log: client.channels.cache.get("1156176917876183083"),
  };
  listChannel.test.send("Online!!!")
});

client.on("messageCreate", async (message) => {
  if (message.embeds.length > 0) {
    const type = message.embeds[0].data.footer.text;

    if (type == "TreSang") {
      reg_morning_late(message, listChannel.test);
    }
    
    if (type == "TreToi") {
      reg_night_late(message, listChannel.test);
    }

    if (type == "DangKiCom") {
      console.log("okeee");
      reg_rice(message, listChannel.riceReg);
    }
  }
});

client.on("messageReactionAdd", async (reaction, user) => {
  log("messageReactionAdd", listChannel.test, listChannel.log, reaction, user);
});

client.on("messageReactionRemove", async (reaction, user) => {
  log(
    "messageReactionRemove",
    listChannel.test,
    listChannel.log,
    reaction,
    user
  );
});
// Log in to Discord with your client's token
client.login(process.env.BOT_TOKEN);
module.exports = client;
