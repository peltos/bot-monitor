const {
  Client,
  Events,
  GatewayIntentBits,
  EmbedBuilder,
} = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({
  intents: [GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences],
});

client.once(Events.ClientReady, async (client) => {
  console.log('client ready');

  const Guilds = client.guilds.cache.map((guild) => guild.id);

  console.log('-- fetching users and channels...');

  Guilds.map(async (guild) => {
    await loadMemebersAndChannels(guild);
  });

  console.log('-- got all the users and channels!');
  console.log(' ');
});

client.on('presenceUpdate', (oldPresence, newPresence) => {
  if (oldPresence) if (oldPresence.status === newPresence.status) return;

  let member = newPresence.member;

  if(!member.user.bot) return;

  let date = new Date();
  let channel = member.guild.channels.cache.get('727552720826925136');

  if (!channel) return;
  else logWithDate(checkStatusDesc(newPresence.status, member.user.username));

  const exampleEmbed = new EmbedBuilder()
    .setColor(checkStatusColor(newPresence.status))
    .setTitle(`Status ${member.user.username}`)
    .setDescription(checkStatusDesc(newPresence.status, member.user.username))
    .setThumbnail(member.displayAvatarURL())
    .setFooter({ text: date.toLocaleString('nl-NL') });

  if (checkStatusSendMessage(newPresence.status)) {
    channel.send({ embeds: [exampleEmbed] });
  }
});

async function loadMemebersAndChannels(guildId) {
  const guild = client.guilds.cache.get(guildId);

  // to load the channels and members for the presenceUpdate to work
  await guild.members.fetch();
  await guild.channels.fetch();
}

function checkStatusDesc(status, username) {
  if (status === 'online') {
    return `${username} is online!`;
  } else if (status === 'offline') {
    return `${username} is offline...`;
  } else if (status === 'idle') {
    return `${username} is idle...`;
  } else if (status === 'dnd') {
    return `${username} is on do not disturb`;
  } else {
    return `status is not what it's supposed to be...`;
  }
}

function checkStatusColor(status) {
  if (status === 'online') {
    return 0x00ff00;
  } else if (status === 'offline') {
    return 0xff0000;
  } else if (status === 'idle') {
    return 0xffff00;
  } else if (status === 'dnd') {
    return 0xff7700;
  } else {
    return 0x0099ff;
  }
}

function checkStatusSendMessage(status) {
  if (status === 'online') {
    return true;
  } else if (status === 'offline') {
    return true;
  } else if (status === 'idle') {
    return true;
  } else if (status === 'dnd') {
    return true;
  } else {
    return false;
  }
}

function logWithDate(msg) {
  let date = new Date();
  return console.log(date.toLocaleString('nl-NL') + ' > ' + msg);
}

client.login(token);
