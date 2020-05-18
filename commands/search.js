const Discord = require("discord.js");
const axios = require("axios")

exports.run = async (client, message) => {
  let functions = client.functions;
  let command = message.content.split(" ")[0]
  let args = message.content.substring(command.length+1)
  if (!args) return message.channel.send(functions.rembed("**Invalid Search**","Make sure you included something to search!"))
  message.channel.send("<a:loading2:668214571005247499> **Searching...**")
  
  axios.get('https://www.adafruit.com/api/products/').then(async res => {
    let bigdata = res.data;
    let count = 0;
    await bigdata.forEach(async i => {
      let productname = await i.product_name
      if (productname.toLowerCase().includes(args.toLowerCase())) {
        count++
        if (count>1) return;
        let data = i
        let embed = new Discord.RichEmbed();
        if (data.product_stock<1) {
          embed.setTitle("Out Of Stock: " + data.product_name);
          embed.setColor("RED")
        } else {
          embed.setTitle(data.product_name)
          embed.setColor("GREEN")
        }
        embed.setURL(data.product_url)
        embed.setImage(data.product_image)
        embed.setDescription(`**Price:** $${data.product_price} USD\n**In Stock:** ${data.product_stock}\n**ID:** ${data.product_id}\n**[More Results](https://www.adafruit.com/?q=${args})**`)
        embed.setFooter("Search Beta")

        message.channel.send(embed)
      }
    })
    if (count<1) {
      message.channel.send("<:warning:579387552453099561> No results found!")
    } else {
      message.channel.send("Showing 1/" + count + " results.")
    }
    
    /*let data = res.data
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
    
    message.channel.send(embed)*/
  })
  
};

exports.help = {
  name: "search",
  usage: "search (name)",
  aliases: [],
  desc: "Search for a product"
};
