const Discord = require("discord.js");
const axios = require("axios")

exports.run = async (client, message) => {
  let functions = client.functions;
  message.channel.send("<a:loading2:668214571005247499> **Randomizing...**")
  
  axios.get('https://www.adafruit.com/api/products').then(res => {
    let bigdata = res.data
    
    let data = bigdata[Math.floor(Math.random() * bigdata.length)];
    
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
    embed.setDescription(`**Price:** $${data.product_price} USD\n**In Stock:** ${data.product_stock}\n**ID:** ${data.product_id}`)
    
    message.channel.send(embed)
  })
  
};

exports.help = {
  name: "random",
  usage: "random",
  aliases: ["random","rando"],
  desc: "Get a random product"
};
