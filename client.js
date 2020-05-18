// ShopBot > Configuration
/* ---------------------------------- */
const name = "Adafruit";
const game = "Help ➜ !help | Adafruit";
const status = "online";
const owner = "276544649148235776";

const version = "1";

const admins = [
  "276544649148235776",
  "330227457296957440",
  "340718517408104450",
  "252717193496756235"
]; // Access to Eval, and all other staff commands.
const prefix = "!";
/* ---------------------------------- */

// Define Libraries
var fs = require("fs");
var http = require("http");
var https = require("https");
var Discord = require("discord.js"),
  client = new Discord.Client();
const Enmap = require("enmap");
const express = require("express");
const app = express();
const axios = require("axios")
const urlmeta = require('url-metadata')

app.use(express.static("public"));

let tags = JSON.parse(fs.readFileSync("data/tags.json"));

setInterval(()=>{
  tags = JSON.parse(fs.readFileSync("data/tags.json"));
}, 5000)

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});

var functions = {
  argserror: a => {
    let errorEmbed = new Discord.RichEmbed();
    errorEmbed.setTitle("Whoops!");
    errorEmbed.setDescription(
      "Make sure you included all of the command arguments.\n\n**Usage:** " + a
    );
    errorEmbed.setColor("BLUE");
    return errorEmbed;
  },
  index: async (array, item) => {
    let index = array.indexOf(item);
    if (index > -1) {
      array.splice(index, 1);
    }
    console.log(array);
    return array;
  },
  oembed: (a, b) => {
    let errorEmbed = new Discord.RichEmbed();
    errorEmbed.setTitle(a);
    if (b && b !== "") {
      errorEmbed.setDescription(b);
    }
    errorEmbed.setColor(0xfffafa);
    return errorEmbed;
  },
  rembed: (a, b) => {
    let errorEmbed = new Discord.RichEmbed();
    errorEmbed.setTitle(a);
    if (b && b !== "") {
      errorEmbed.setDescription(b);
    }
    errorEmbed.setColor("RED");
    return errorEmbed;
  },
  iembed: (a, b) => {
    let errorEmbed = new Discord.RichEmbed();
    errorEmbed.setTitle(a);
    if (b && b !== "") {
      errorEmbed.setDescription(b);
    }
    errorEmbed.setColor("BLUE");
    return errorEmbed;
  },
  gembed: (a, b) => {
    let errorEmbed = new Discord.RichEmbed();
    errorEmbed.setTitle(a);
    if (b && b !== "") {
      errorEmbed.setDescription(b);
    }
    errorEmbed.setColor("GREEN");
    return errorEmbed;
  },
  emoteid: e => {
    return e.replace(/[<->]/g, "");
  },
  error: (e, message) => {
    let errorEmbed = new Discord.RichEmbed();
    errorEmbed.setAuthor("Whoops!", message.author.avatarURL);
    errorEmbed.setDescription(e);
    errorEmbed.setColor("RED");
    return errorEmbed;
  },
  permError: (e, message) => {
    let errorEmbed = new Discord.RichEmbed();
    errorEmbed.setAuthor("Whoops!", message.author.avatarURL);
    errorEmbed.setDescription(
      "You do not have the correct permissions to run this command. You need `" +
        e +
        "`."
    );
    errorEmbed.setColor("RED");
    return errorEmbed;
  },
  isNumber: n => {
    return typeof n != "boolean" && !isNaN(n);
  },
  perms: perm => {
    switch (perm) {
      case "channels":
        return "You need the MANAGE_CHANNELS perm to use this command.";
        break;
      case "server":
        return "You need the MANAGE_GUILD or ADMINISTRATOR perm to use this command.";
        break;
      case "kick":
        return "You need the KICK_MEMBERS perm to use this command.";
        break;
      case "ban":
        return "You need the BAN_MEMBERS perm to use this command.";
        break;
      case "everyone":
        return "You don't need any pemissions to use this command.";
        break;
    }
  }, // Gives out a label for the perm input
  replaceAll: (string, search, replacement) => {
    return string.replace(new RegExp(search, "g"), replacement);
  },
  checkPerm: (perm, member, id = "") => {
    if (id !== "" && !client.fetchUser(id)) return false;
    switch (perm) {
      case "":
      case "channelperms":
      case "roles":
        if (member.permissions.has("MANAGE_ROLES_OR_PERMISSIONS")) {
          return true;
        }
        break;
      case "channels":
        if (member.permissions.has("MANAGE_CHANNELS")) {
          return true;
        }
        break;
      case "webhooks":
        if (member.permissions.has("MANAGE_WEBHOOKS")) {
          return true;
        }
        break;
      case "server":
        if (
          member.permissions.has("MANAGE_GUILD") ||
          member.permissions.has("ADMINISTRATOR")
        )
          return true;
        break;
      case "admin":
        if (member.permissions.has("ADMINISTRATOR")) return true;
        break;
      case "kick":
        if (member.permissions.has("KICK_MEMBERS")) {
          return true;
        }
        break;
      case "ban":
        if (member.permissions.has("BAN_MEMBERS")) {
          return true;
        }
        break;
      case "perms":
        if (member.permissions.has("MANAGE_ROLES")) {
          return true;
        }
        break;
      case "messages":
        if (member.permissions.has("MANAGE_MESSAGES")) {
          return true;
        }
        break;
      default:
        return true;
    }
    return false;
  }, // Checks the member's permission
  cHasPerm: (perm, guild) => {
    if (perm === "ba") return true;
    return functions.checkPerm(
      perm,
      guild.members.find("id", client.user.id),
      client.user.id
    );
  }, // Checks if CLIENT has perms
  rcol: () => {
    return Math.round(Math.random() * 16777215);
  }, // Random color
  ec: string => {
    if (typeof string === "string")
      return string
        .replace(/`/g, "`" + String.fromCharCode(8203))
        .replace(/@/g, "@" + String.fromCharCode(8203));
    else return string;
  },
  mtc: ms => {
    let x = ms / 1000;
    let s = Math.floor(x % 60);
    x /= 60;
    let m = Math.floor(x % 60);
    x /= 60;
    let h = Math.floor(x % 24);
    return `${h > 0 ? h + ":" : ""}${h > 0 ? (m > 9 ? m : "0" + m) : m}:${
      s > 9 ? s : "0" + s
    }`;
  }, // Turns milliseconds into time
  mtrl: milliseconds => {
    let x = milliseconds / 1000;
    let s = Math.floor(x % 60);
    x /= 60;
    let m = Math.floor(x % 60);
    x /= 60;
    let h = Math.floor(x % 24);
    x /= 24;
    let d = Math.floor(x);
    let timeStuff = "";
    if (d > 0) {
      timeStuff += `${d} day${(d > 1 ? "s" : "") +
        (h > 0 || m > 0 || s > 0 ? " " : "")} `;
    }
    if (h > 0) {
      timeStuff += `${h} hour${(h > 1 ? "s" : "") +
        (m > 0 || s > 0 ? " " : "")}`;
    }
    if (m > 0) {
      timeStuff += `${m} minute${(m > 1 ? "s" : "") + (s > 0 ? " " : "")}`;
    }
    if (s > 0) {
      timeStuff += `${d > 0 || h > 0 || m > 0 ? "and " : ""}${s} second${
        s > 1 ? "s" : ""
      }`;
    }
    return timeStuff;
  },
  sti: string => {
    return string.replace(/[^0-9]/g, "");
  }
};

/* Bot Login */
client.login(process.env.TOKEN).catch(console.error);

client.on("ready", function(evt, callback) {
  console.log(`In ${client.guilds.size} servers`);
  client.user.setPresence({
    game: {
      type: 0,
      name: game + " | " + client.guilds.size
      //name: 'Discord API Error ➜ https://status.discordapp.com'
    },
    status: status
  });
});

client.commands = new Enmap();
client.version = version;
client.owner = owner;
client.functions = functions;
client.admins = admins;

fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/${file}`);
    let commandName = file.split(".")[0];
    client.commands.set(commandName, props);
  });
});

// On leave guild
client.on("guildDelete", guild => {
  console.log(`Left a guild called ${guild.name}.`);
});

// On new guild
client.on("guildCreate", guild => {
  console.log(`Joined a new guild called ${guild.name}.`);
});

client.on("message", async message => {
  /*
  if (message.content.toLowerCase().includes("adafruit.com/product/")) {
    let regex = /it\.com\/product\/(\d+)/;
    let regexed = message.content.match(regex)
    if (!regexed) return;
    let id = regexed[1]
    
    axios.get('https://www.adafruit.com/api/products/'+id).then(res => {
      let data = res.data
      if (data.product_id === null) return;

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
      embed.setDescription(`**Price:** ${data.product_price}\n**In Stock:** ${data.product_stock}\n**ID:** ${id}`)
      
      message.channel.send("Would you like to view product info?").then(async m => {
        let filter = (reaction, user) => user.id !== client.user.id;
        let collector = m.createReactionCollector(filter, { time: 20000 });
        
        collector.on('collect', async (r, collector) => {
          if (r.emoji.name==="✅") {
            collector.stop();
            m.delete()
            m.channel.send(embed)
          } else if (r.emoji.name==="❌") {
            collector.stop();
            m.delete()
          }
        })
        
        collector.on('end', async () => {
          m.delete()
        })
        
        await m.react("✅")
        await m.react("❌")
        
      })
    }).catch(err => {
      console.error(err)
    })
    
  }
  
  
  if (message.content.toLowerCase().includes("github.com")) {
    let regex = /github\.com\/(\S+)\/(\S+)/;
    let regexed = message.content.match(regex)
    if (!regexed) return;
    let user = regexed[1];
    let repo = regexed[2];
    
    urlmeta('https://' + regexed[0]).then(
      function (metadata) { // success handler
        let url = metadata["og:url"]
        let title = metadata["og:title"]
        let desc = metadata["og:description"]
        let img = metadata["og:image"]
        let color = metadata["theme-color"]
        
        let embed = new Discord.RichEmbed();
        embed.setTitle("GitHub: " + title)
        embed.setURL(url)
        embed.setDescription(desc)
        embed.setImage(img)
        embed.setColor("GREEN")
        console.log(color)
        console.log(metadata)
        
        message.channel.send("Would you like to view repository info?").then(async m => {
        let filter = (reaction, user) => user.id !== client.user.id;
        let collector = m.createReactionCollector(filter, { time: 20000 });
        
        collector.on('collect', async (r, collector) => {
            if (r.emoji.name==="✅") {
              collector.stop();
              m.delete()
              m.channel.send(embed)
            } else if (r.emoji.name==="❌") {
              collector.stop();
              m.delete()
            }
          })

          collector.on('end', async () => {
            m.delete()
          })

          await m.react("✅")
          await m.react("❌")

        })
      },
      function (error) { // failure handler
        console.log(error)
    })
  }
  */
  /* Eval */
  if (
    message.content.toLowerCase().startsWith("ev:") &&
    admins.includes(message.author.id)
  ) {
    let mess = message.content.slice(3).trim();
    let evalled;
    try {
      evalled = functions.ec(eval(mess));
    } catch (err) {
      evalled = `ERROR: ${functions.ec(err)}`;
    }
    let embed = new Discord.RichEmbed()
      .setColor("green")
      .setTimestamp()
      .setAuthor("Run", client.user.avatarURL)
      .setDescription(
        `**Input:** \`\`\`js\n${mess}\`\`\`**Output:** \`\`\`xl\n${evalled}\`\`\``
      )
      .setFooter(`Input length: ${mess.length}`, message.author.avatarURL);
    message.channel.send(embed);
    return;
  }

  /* Silent Eval */
  if (
    message.content.toLowerCase().startsWith("sev:") &&
    admins.includes(message.author.id)
  ) {
    let mess = message.content.slice(4).trim();
    let evalled;
    try {
      evalled = functions.ec(eval(mess));
    } catch (err) {
      evalled = `ERROR: ${functions.ec(err)}`;
    }
    message.delete().catch(console.log);
    let embed = new Discord.RichEmbed()
      .setColor(functions.rcol())
      .setTimestamp()
      .setAuthor("Run", client.user.avatarURL)
      .setDescription(
        `**Input:** \`\`\`js\n${mess}\`\`\`**Output:** \`\`\`xl\n${evalled}\`\`\``
      )
      .setFooter(`Input length: ${mess.length}`, message.author.avatarURL);
    return;
  }
  
  if (message.author.bot || message.channel.type !== "text") return;
  
  if (message.content==="<@668175642222657547>") {
    message.channel.send(functions.iembed(`👋 **I'm Shop Bot!**`,`I help users connect Adafruit to Discord!\n\n**Server Prefix:** \`${prefix}\``))
  }
  
  if (message.content.toLowerCase().indexOf(prefix) !== 0) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  if (tags[command]) {
    message.channel.send(tags[command][0])
  }
  
  client.commands.forEach(cmd=>{
    if (command===cmd.help.name || cmd.help.aliases.includes(command)) {
      cmd.run(client, message, prefix);
      console.log(`${message.author.tag} used the ${cmd.help.name} command in ${message.guild.name} (${message.guild.id})`)
    }
  })
  
});


app.get('/', (req, res) => {
  res.sendStatus(200)
})