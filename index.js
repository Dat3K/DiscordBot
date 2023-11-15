require('dotenv').config();
const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const reg_rice = require('./events/reg_rice');
const reg_morning_late = require('./events/reg_morning_late');
const reg_night_late = require('./events/reg_night_late');
const log = require('./events/write_log');
const test = require('./events/test');
const housework = require('./events/housework');
const chiCommand = require('./commands/chi');
const nhanCommand = require('./commands/nhan');
const read_msg = require('./commands/read_msg');
const report = require('./commands/report');
const api = require('./api/api');
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

client.once('ready', async () => {
  listChannel = {
    test: client.channels.cache.get('1149187511340515399'),
    riceReg: client.channels.cache.get('1152273873086185504'),
    log: client.channels.cache.get('1156176917876183083'),
    late: client.channels.cache.get('1158435828117286962'),
    logRiceLate: client.channels.cache.get('1160646902291902645'),
    logRiceReg: client.channels.cache.get('1160646807550972065'),
    pdk: client.channels.cache.get('1149193245490954251'),
  };

  // Hiển thị thông tin user
  console.log(`Ready! Logged in as ${client.user.tag}`);
  client.user.setActivity('hội trưởng rap 💀', {
    type: ActivityType.Listening,
  });
  client.user.setStatus('idle');
  listChannel.test.send('Online!!!');
});

client.on('messageCreate', async (message) => {
  if (
    message.author == '678344927997853742' ||
    message.author == '423874227507167233'
  ) {
    const content = message.content;
    if (content.includes('TreSang')) {
      await reg_morning_late(message, listChannel.late);
    }

    if (content.includes('TreToi')) {
      await reg_night_late(message, listChannel.late);
    }

    if (content.includes('DangKiCom')) {
      await reg_rice(message, listChannel.riceReg);
    }

    if (content.includes('TrucPhong')) {
      await housework(listChannel.pdk);
    }

    if (content.includes('Test')) {
      await test(message, listChannel.test);
    }
  }
});

client.on('messageReactionAdd', async (reaction, user) => {
  if (reaction.message.embeds.length === 0) return;
  if (reaction.message.channel.id == listChannel.riceReg)
    log('messageReactionAdd', listChannel.logRiceReg, reaction, user);
  if (reaction.message.channel.id == listChannel.late)
    log('messageReactionAdd', listChannel.logRiceLate, reaction, user);
});

client.on('messageReactionRemove', async (reaction, user) => {
  if (reaction.message.embeds.length === 0) return;
  if (reaction.message.channel.id == listChannel.riceReg)
    log('messageReactionRemove', listChannel.logRiceReg, reaction, user);
  if (reaction.message.channel.id == listChannel.late)
    log('messageReactionRemove', listChannel.logRiceLate, reaction, user);
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

  if (commandName === 'read_msg') {
    await read_msg.execute(interaction);
  }

  if (commandName === 'report') {
    await report.execute(interaction);
  }
});

// Log in to Discord with your client's token
client.login(process.env.BOT_TOKEN);

// API
api();