const Discord = require("discord.js");
const fetch = require('node-fetch');
const ms = require('ms');
const client = new Discord.Client();
module.exports.run = async (client, message, args) => {
		var yetkili = message.author;
		const süre = args[1];
		const sebep = args[2];
		const kullanıcı = message.mentions.users.first();
		const sunucuadı = "D o r a l a n d" // Bu bölüme sunucunuzun adını girin!
		const logkanal = "840344969956687942" // Bu bölüme verilen cezaların loglanacağı kanalın ID'sini girin!
		const yetkilirol = "840309730261205033" // Bu bölüme Timeout atabilecek rolün ID'sini girin!

		if (!message.member.roles.cache.has(yetkilirol)) return message.channel.send(new Discord.MessageEmbed().setDescription(`❌ • Bu komutu kullanmak için <@&${yetkilirol}> rolüne sahip olmalısın!`)).then(msg => msg.delete({timeout: 5000}));
		if(!kullanıcı) return message.channel.send(new Discord.MessageEmbed().setDescription(`❌ • Kullanıcı etiketlemelisin!`)).then(msg => msg.delete({timeout: 5000}));
		if(!süre) return message.channel.send(new Discord.MessageEmbed().setDescription(`❌ • Bir süre belirtmelisin!`).setFooter("s: Saniye\nm: Dakika\nh: Saat\nd: Gün")).then(msg => msg.delete({timeout: 5000}));
		if(!sebep) return message.channel.send(new Discord.MessageEmbed().setDescription(`❌ • Bir sebep belirtmelisin!`)).then(msg => msg.delete({timeout: 5000}));

		const milliseconds = ms(süre);
		if(!milliseconds || milliseconds < 10000 || milliseconds > 2419200000) {
			return message.channel.send(new Discord.MessageEmbed().setDescription(`❌ • \`10s - 24d\` arası bir süre girebilirsin!`).setFooter("s: Saniye\nm: Dakika\nh: Saat\nd: Gün")).then(msg => msg.delete({timeout: 5000}));
		}

		const tamSüre = new Date(Date.now() + milliseconds).toISOString();

		await fetch(`https://discord.com/api/guilds/${message.guild.id}/members/${kullanıcı.id}`, {
			method: 'PATCH',
			body: JSON.stringify({ communication_disabled_until: tamSüre }),
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bot ${client.token}`,
			},
		});
		message.channel.send(new Discord.MessageEmbed().setDescription(`❌ • ${kullanıcı} isimli kullanıcı \`${sebep}\` sebebiyle ${süre} susturuldu!`)).then(msg => msg.delete({timeout: 5000}));
		const muteembed = new Discord.MessageEmbed()
		.setThumbnail(message.author.avatarURL())
		.setColor(0x00ae86)
		.setTitle("İşlem: Timeout")
		.setTimestamp()
		.addField("**Kullanıcı:**", kullanıcı)
		.addField("**Yetkili:**", yetkili)
		.addField("**Sebep:**", sebep)
		.addField("**Süre:**", süre)
		.setFooter(`© ${sunucuadı}  Timeout Sistemi`, client.user.avatarURL())
		message.guild.channels.cache.get(logkanal).send(muteembed);
	};
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["sustur"],
  permLevel: 0
};
 
exports.help = {
  name: "mute",
  description: "Discord Timeout sistemi ile bir sunucu üyesini susturmanızı sağlar",
  usage: "(prefix)mute @kullanıcı (süre) (sebep)"
};
