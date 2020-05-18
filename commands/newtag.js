const Discord = require("discord.js");
const fs = require("fs")

exports.run = async (client, message) => {
  let functions = client.functions
  let tags = JSON.parse(fs.readFileSync("data/tags.json"));
  if (!client.admins.includes(message.author.id) && !message.author.roles.has("327289013561982976")) return;
  let command = message.content.split(" ")[0]
  let args = message.content.substring(command.length+1)
  
  if (!args) return message.channel.send(functions.rembed("**Whoops!**","Make sure you used the command correctly. `!newtag (name) (tag)`"))
  
  let tagtitle = args.split(" ")[0]
  
  if (!tagtitle) return message.channel.send(functions.rembed("**Whoops!**","Make sure you used the command correctly. `!newtag (name) (tag)`"))
  
  let tagdesc = args.substring(tagtitle.length+1)
  
  if (!tagdesc) return message.channel.send(functions.rembed("**Whoops!**","Make sure you used the command correctly. `!newtag (name) (tag)`"))
  
  message.channel.send("<a:loading2:668214571005247499> Creating tag...")
  
  tags[tagtitle] = [tagdesc]
  fs.writeFileSync("data/tags.json", JSON.stringify(tags));
  
  message.channel.send(functions.gembed("**Tag Created**",`You can use it by running \`${tagtitle}\``))
  
};

exports.help = {
  name: "newtag",
  usage: "newtag (name) (tag)",
  aliases: [],
  desc: "Create a tag"
};
