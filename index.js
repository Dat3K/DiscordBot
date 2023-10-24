require('dotenv').config();
const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const readyEvent = require('./events/ready');
const reg_rice = require('./events/reg_rice');
const reg_morning_late = require('./events/reg_morning_late');
const reg_night_late = require('./events/reg_night_late');
const log = require('./events/write_log');
const schedule_reg_rice = require('./events/schedule_reg_rice');
const schedule_night_late = require('./events/schedule_night_late');
const schedule_morning_late = require('./events/schedule_morning_late');
const housework = require('./events/housework');
const chiCommand = require('./commands/chi');
const nhanCommand = require('./commands/nhan');
const chatgpt = require('./commands/chatgpt');
const read_msg = require('./commands/read_msg');
const report = require('./commands/report');
let listChannel;
const listHour = {
  rice: { hour: 3, minute: 0 },
  morning_late: { hour: 11, minute: 0 },
  night_late: { hour: 18, minute: 15 },
  housework: { hour: 21, minute: 0 },
};
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
  client.user.setActivity('đuổi bắt với Mafia', {
    type: ActivityType.Competing,
  });
  client.user.setStatus('idle');
  listChannel = {
    test: client.channels.cache.get('1149187511340515399'),
    riceReg: client.channels.cache.get('1152273873086185504'),
    log: client.channels.cache.get('1156176917876183083'),
    late: client.channels.cache.get('1158435828117286962'),
    logRiceLate: client.channels.cache.get('1160646902291902645'),
    logRiceReg: client.channels.cache.get('1160646807550972065'),
    pdk: client.channels.cache.get('1149193245490954251'),
  };

  listChannel.test.send('Online!!!');
  schedule_reg_rice(listChannel.riceReg);
  schedule_night_late(listChannel.late);
  schedule_morning_late(listChannel.late);
  housework(
    listChannel.pdk,
    listHour.housework.hour,
    listHour.housework.minute
  );
});

client.on('messageCreate', async (message) => {
  if (message.embeds.length > 0) {
    if (
      message.author.id != '678344927997853742' &&
      message.author.id != '1157213890380316754'
    )
      return;

    const type = message.embeds[0].data.footer?.text;
    if (!type) return;
    console.log(type);
    if (type == 'TreSang') {
      reg_morning_late(
        message,
        listChannel.late,
        listHour.morning_late.hour,
        listHour.morning_late.minute
      );
    }

    if (type == 'TreToi') {
      reg_night_late(
        message,
        listChannel.late,
        listHour.night_late.hour,
        listHour.night_late.minute
      );
    }

    if (type == 'DangKiCom') {
      reg_rice(
        message,
        listChannel.riceReg,
        listHour.rice.hour,
        listHour.rice.minute
      );
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

  if (commandName === 'chatgpt') {
    await chatgpt.execute(interaction);
  }

  if (commandName === 'read_msg') {
    await read_msg.execute(interaction, listHour);
  }

  if (commandName === 'report') {
    await report.execute(interaction);
  }
});

// Log in to Discord with your client's token
client.login(process.env.BOT_TOKEN);
