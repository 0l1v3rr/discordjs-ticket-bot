const Discord = require("discord.js");
const bot = new Discord.Client({ partials: ["MESSAGE", "USER", "REACTION"]});

bot.on("ready", async => {
    console.log('The bot is active.');
    bot.user.setActivity('!createticket', {type: 'LISTENING'});
});

bot.on('messageReactionAdd', async (reaction, user) => {
    if (!reaction.message.guild) return;
    if (user.bot) return;

    let ticketembed = new Discord.MessageEmbed()
    .setColor("#55ff55")
    .setTitle("Ticket")
    .setDescription(`Hey ${user}, thanks for opening a ticket. We'll be with you shortly.\nTo close this ticket react with 🔒`)

    //   The message id goes here.  ⬇️   (!createticket)
    if (reaction.message.id === 'message-id' && reaction.emoji.name === '🎫') {
        reaction.users.remove(user);
        let exch = bot.channels.cache.some(channel => channel.name === `ticket-${user.username.toLowerCase()}`);
        if (exch) {
            let embed = new Discord.MessageEmbed()
            .setColor("#ff5555")
            .setDescription(`You already have a ticket!`);
            user.send(embed);
            return;
        }
        reaction.message.guild.channels.create(`ticket-${user.username}`, {
            type: "text",
            permissionOverwrites: [
                {
                    id: reaction.message.guild.roles.everyone,
                    deny: ["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"],
                },
                {
                    id: user.id,
                    allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
                }
            ],
        }).then((channel) => {
            const categoryId = "category-id"; //The ticket-channels category goes here.
            channel.setParent(categoryId);
            channel.send(`<@${user.id}>`);
            channel.send(ticketembed).then((msg) => {
                msg.react("🔒");
            })
        });
    }
    

    if (reaction.message.channel.name.includes("ticket-") || reaction.emoji.name === "🔒") {
        reaction.message.channel.delete();
    }
});

bot.on('message', async message => {
    if (message.author.bot || message.channel.type === 'dm') return;
    let prefix = '!';
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0].toLowerCase();
    let args = messageArray.slice(1);

    if (cmd === `${prefix}createticket`) {
        message.delete();
        const embed = new Discord.MessageEmbed()
        .setColor('#02c4ff')
        .setTitle('Ticket')
        .setDescription('To open a ticket react with 🎫');
        message.channel.send(embed).then(message => {
            message.react('🎫');
        });
    }
});

bot.login('TOKEN');  //Your token goes here.