const Discord = require('discord.js');
const db = require('quick.db');

module.exports = {
	name: "bot-add",
	run: async(client, message, args) => {
      const embed = new Discord.MessageEmbed()
     .setColor("BLUE")
     .setAuthor(message.author.username, message.author.avatarURL({dynamic: true}))
	 .setTimestamp()
     .setFooter(client.user.username, client.user.avatarURL())
	 

	  if(message.channel.id !== client.settings.addChannel) return message.channel.send(embed.setDescription(`Bu Komutu Sadece <#${client.settings.addChannel}> Kanalında Kullanabilirsin!`)).then(msg => msg.delete({timeout:3000})); 
	  
	  let botID = args[0];
      const embed2 = new Discord.MessageEmbed()
     .setColor("BLUE")
      .setDescription("Please Enter the ID of the Bot You Want to Add.")
     .setAuthor(message.author.username, message.author.avatarURL({dynamic: true}))
	 .setTimestamp()
     .setFooter(client.user.username, client.user.avatarURL())
	 
      if(!botID || isNaN(botID)) return message.channel.send(embed2).then(msg => msg.delete({timeout:3000}));
	  let discordBot = null;
      try {
		  discordBot = await client.users.fetch(botID);
	  }	catch {
          return message.channel.send(embed.setDescription("I couldn't find such a bot in the Discord API.")).then(msg => msg.delete({timeout:3000}));
	  }		

	  if(!discordBot.bot) return message.channel.send(embed.setDescription("Please Enter Bot ID, Do Not Enter User ID!")).then(msg => msg.delete({timeout:3000}));
	  let bot =  db.fetch(`serverData.${message.guild.id}.botsData.${botID}`);
	  
 
	  if(bot) {
		let member = await client.users.fetch(bot.owner);
        return message.channel.send(`<a:light_yildiz:929797548435206185>  **${discordBot.username}** Adlı Bot Sisteme **${member.username}** Tarafından Eklenmiş Durum; **${bot.status}**`).then(msg => msg.delete({timeout:3000})); 
	 }
	
	  db.add(`serverData.${message.guild.id}.waitSize`, 1)
	  db.set(`serverData.${message.guild.id}.botsData.${botID}.owner`,  message.author.id)
	  db.set(`serverData.${message.guild.id}.botsData.${botID}.status`, "Beklemede")
	  
      let sira = db.fetch(`serverData.${message.guild.id}.waitSize`) || 0;
	   
message.guild.channels.cache.get(client.settings.logChannel).send(`${message.author}`).then(m => {
    embed
    .setDescription(`Sisteme Bir Bot Eklendi, Bu Bot ile Sırada Toplam **${sira}** Bot Mevcut!`)
    .addField("**Ekleyen Hakkında**",`${message.author} (**${message.author.tag}**)`)
    .addField("**Bot Hakkında**", `\`${discordBot.tag}\`(**${discordBot.id}**)`)
    
    m.channel.send(embed)
  	message.author.send(embed .setDescription("When your bot is approved, a message will be sent in DM."))

})
        message.react(client.settings.emoji)
    
    
	  let obj = await db.get(`serverData.${message.guild.id}.botsData`) || {}
	  let veri = Object.keys(obj).map(botID => {
		return {
		  ID: botID,
		  durum: obj[botID].status
		};
	  }).filter(data => data.durum == "Beklemede")
	  if(veri.length <= 0) return message.guild.channels.cache.get(client.settings.botChannel).send(embed.setDescription("Şuan Beklemede Olan Bot Bulunmuyor")) 
 return message.guild.channels.cache.get(client.settings.botChannel).send("<@&929787176458276935>",embed.setDescription(
	  `Sistem Şuan Toplam **${veri.length}** Bot Onay Beklemede! \n\n`+
	  veri.map(data => `!bot-onayla (**${data.ID}**) | [Botu Ekle (0)](https://discord.com/oauth2/authorize?client_id=${data.ID}&scope=bot&permissions=0) `).join("\n"))
	  )
  }
}
