const Discord = require("discord.js");
const fs = require("fs")

exports.run = async (client, message) => {
  let functions = client.functions
  let tags = JSON.parse(fs.readFileSync("data/tags.json"));
  if (!client.admins.includes(message.author.id) && !message.author.roles.has("327289013561982976")) return;
  let command = message.content.split(" ")[0]
  let args = message.content.substring(command.length+1)
  
  if (!args) return message.channel.send(functions.rembed("**Whoops!**","Make sure you used the command correctly. `!deltag (name)`"))
  
  let tagtitle = args.split(" ")[0]
  
  if (!tagtitle) return message.channel.send(functions.rembed("**Whoops!**","Make sure you used the command correctly. `!deltag (name)`"))
  
  if (!tags[tagtitle]) return message.channel.send(functions.rembed("**Whoops!**","I couldn't find that tag."))
  
  message.channel.send("<a:loading2:668214571005247499> Deleting tag...")
  
  delete tags[tagtitle]
  fs.writeFileSync("data/tags.json", JSON.stringify(tags));
  
  message.channel.send(functions.gembed("**Tag Removed!**"))
  
};

exports.help = {
  name: "deletetag",
  usage: "deletetag (name)",
  aliases: ["deltag"],
  desc: "Delete a tag"
};
