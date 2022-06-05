

const Discord = require('discord.js');

const fs = require('fs');
const client = new Discord.Client({ ws: { intents: Discord.Intents.ALL }, disableMentions: 'everyone'});
const client1 = new Discord.Client({ ws: { intents: Discord.Intents.ALL }, disableMentions: 'everyone'});
const matthe = require('discord-buttons')
matthe(client)
const db = require('quick.db');


client.commands = new Map();
 
 fs.readdir('./commands', (err, files) => {
   files.forEach(file => {
	 if(file.endsWith(".js")){
	  var command = require(`./commands/${file}`);
	  console.log(command.name)
	   client.commands.set(command.name, command)
	 }
   })	
   console.log("Komutlar Yüklendi.")   
 })

client.settings = {
    prefix: "!",
    token: "TOKEN KOY",
    addChannel: "929787202278424616",
    logChannel :"929787204916633600",
    botChannel :"929787205394792491",
    modRole: "929787176458276935",	
    processChannel: "929787205394792491",
    emoji: "☑️",
    devRole: "929787181957021696"
 }
 
client.on('ready', () => {
	client.user.setStatus('dnd');
  client.channels.cache.get("930147396522999839").join()
   client.user.setStatus("dnd")
    client.user.setActivity(`!bot-ekle id`, {type: "PLAYING"},);
    console.log("Başarılı Bir Şekilde Aktif Oldum.")
})

client.on('message', async message => {
	if(message.author.bot || !message.guild) return;
	let prefix = client.settings.prefix;
    if(message.channel.id == (client.settings.addChannel || null)) message.delete({timeout: 3000})
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(1).trim().split(/ /g)
	var argCommand = args.shift().toLowerCase()

    const command = client.commands.get(argCommand);

    if(command){
      if(!client.settings.addChannel || !client.settings.logChannel || !client.settings.modRole || !client.settings.processChannel || !client.settings.emoji || !client.settings.devRole){
		return message.channel.send(`Bot Kullanabilmek Tüm Ayarlar Yapılması Gerekli.`)
	  }
	  command.run(client, message, args)
	}
})

client.on('guildMemberRemove', async member => {
	member.guild.members.cache.filter(s => db.fetch(`serverData.${member.guild.id}.botsData.${s.id}`)).forEach(x => {
      let bot = db.fetch(`serverData.${member.guild.id}.botsData.${x.id}`);
	  if(bot){
	  if(bot.owner == member.id){
             member.guild.members.ban(x, {reason: "Sahibi Sunucudan Ayrıldı."})
	     db.set(`serverData.${member.guild.id}.botsData.${x.id}.status`, "Reddedildi")
	     db.set(`serverData.${member.guild.id}.botsData.${x.id}.redReason`, "Sahibi Sunucudan Ayrıldı.")
	  }
    }
  })
})

client.on("guildMemberAdd", member => {
  if (member.user.bot) {
  member.roles.add("929787185866104873") 
  } else {
  member.roles.add("929787182867157052") 
  };
  }); 


 


client.on("guildMemberAdd", message => {
client.channels.cache.get("930117572135903242").setName(`︱${message.guild.memberCount} Kişiyiz!`);
});

client.on("guildMemberRemove", message => {  
client.channels.cache.get("930117572135903242").setName(`︱${message.guild.memberCount} Kişiyiz!`);
});


client.login(client.settings.token)
 