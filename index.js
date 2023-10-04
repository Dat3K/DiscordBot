require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const readyEvent = require('./events/ready');
const reg_rice = require('./events/reg_rice');
const reg_morning_late = require('./events/reg_morning_late');
const reg_night_late = require('./events/reg_night_late');
const log = require('./events/write_log');
const chiCommand = require('./commands/chi');
const nhanCommand = require('./commands/nhan');
const chatgpt = require('./commands/chatgpt');
const schedule_reg_rice = require('./events/schedule_reg_rice');
const schedule_night_late = require('./events/schedule_night_late');
const schedule_morning_late = require('./events/schedule_morning_late');
let listChannel;

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
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.DirectMessageReactions,
  ],
});

client.once(readyEvent.name, () => {
  readyEvent.execute(client);
  listChannel = {
    test: client.channels.cache.get('1149187511340515399'),
    riceReg: client.channels.cache.get('1152273873086185504'),
    log: client.channels.cache.get('1156176917876183083'),
    late: client.channels.cache.get('1158435828117286962'),
  };
  listChannel.test.send('Online!!!');
  schedule_reg_rice(listChannel.riceReg);
  schedule_night_late(listChannel.late);
  schedule_morning_late(listChannel.late);
});

client.on('messageCreate', async (message) => {
  if (message.embeds.length > 0) {
    if (
      message.author.id != '678344927997853742' &&
      message.author.id != '1157213890380316754'
    )
      return;
    const type = message.embeds[0].data.footer.text;
    console.log(type);
    if (type == 'TreSang') {
      reg_morning_late(message, listChannel.late);
    }

    if (type == 'TreToi') {
      reg_night_late(message, listChannel.late);
    }

    if (type == 'DangKiCom') {
      reg_rice(message, listChannel.riceReg);
    }
  }
});

client.on('messageReactionAdd', async (reaction, user) => {
  log(
    'messageReactionAdd',
    listChannel.riceReg,
    listChannel.log,
    reaction,
    user
  );
});

client.on('messageReactionRemove', async (reaction, user) => {
  log(
    'messageReactionRemove',
    listChannel.riceReg,
    listChannel.log,
    reaction,
    user
  );
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'chi') {
    await chiCommand.execute(interaction);
  }

  if (commandName === 'nhan') {
    await nhanCommand.execute(interaction);
  }

  if (commandName === 'chatgpt') {
    await chatgpt.execute(interaction);
  }
});
// Log in to Discord with your client's token
client.login(process.env.BOT_TOKEN);
