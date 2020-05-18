const Discord = require("discord.js");
const fs = require("fs");

exports.run = async (client, message) => {
  let functions = client.functions;
  let command = message.content.split(" ")[0];
  let args = message.content.substring(command.length + 1).toLowerCase();
  let embed = new Discord.RichEmbed();
  
  let commands = "";
  client.commands.forEach(i=>{
    commands += `▸ !${i.help.usage} - ${i.help.desc}\n`
  })
  
  embed.setTitle("<:adabot:342384086473637891> **Adafruit Commands**");
  embed.setDescription(`➜ **Commands**\n${commands}`)
  embed.setColor("BLUE")
  message.channel.send(embed)
};

exports.help = {
  name: "help",
  usage: "help",
  aliases: ["commands","commandlist"],
  desc: "Command list"
};
