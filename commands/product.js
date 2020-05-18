const Discord = require("discord.js");
const axios = require("axios")

exports.run = async (client, message) => {
  let functions = client.functions;
  let command = message.content.split(" ")[0]
  let args = message.content.substring(command.length+1)
  
  if (!functions.isNumber(args)) return message.channel.send(functions.rembed("**Invalid Product**","We couldn't find that! Make sure you specified a valid product id and try again."))
  
  axios.get('https://www.adafruit.com/api/products/'+args).then(res => {
    let data = res.data
    if (data.product_id === null) return message.channel.send(functions.rembed("**Invalid Product**","We couldn't find that! Make sure you specified a valid product id and try again."))
    
    let embed = new Discord.RichEmbed();
    if (data.product_stock<1) {
      embed.setTitle("Out Of Stock: " + data.product_name)
      embed.setColor("RED")
    } else {
      embed.setTitle(data.product_name)
      embed.setColor("GREEN")
    }
    embed.setURL(data.product_url)
    embed.setImage(data.product_image)
    embed.setDescription(`**Price:** ${data.product_price}\n**In Stock:** ${data.product_stock}\n**ID:** ${args}`)
    
    message.channel.send(embed)
  }).catch(err => {
    message.channel.send(functions.rembed("**Invalid Product**","We couldn't find that! Make sure you specified a valid product id and try again."))
  })
  
};

exports.help = {
  name: "product",
  usage: "product (id)",
  aliases: ["p","pid"],
  desc: "Get a product"
};
