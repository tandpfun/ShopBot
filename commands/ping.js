const Discord = require("discord.js");
//const functions = require('functions.json')

exports.run = async (client, message) => {
  let embed = new Discord.RichEmbed()
    .setTitle("<a:loadingg:594656471934042167> **Pinging...**")
    .setColor("BLUE");
  let time = Date.now();
  let msg = await message.channel.send(embed);
  let now = Date.now();
  embed.setTitle("<a:acheck:587844986868072458> **Pong!**");
  embed.setDescription(
    `**Ping:** ${now - time}ms\n**Latency:** ${Math.floor(client.ping)}ms`
  );
  await msg.edit(embed);
};

exports.help = {
  name: "ping",
  usage: "ping",
  aliases: ["latency", "speed"],
  desc: "Response time"
};
