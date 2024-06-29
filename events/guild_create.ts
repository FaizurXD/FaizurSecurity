import { EmbedBuilder, Events, type Guild } from "discord.js";
import { buttons, emojis, setActivity } from "../utils.js";

export default class {
	name = Events.GuildCreate;

	async run(guild: Guild) {
		setActivity(guild.client);
		const embed = new EmbedBuilder()
			.setTitle(`${emojis.list} Welcome to Faizur Utils`)
			.setDescription(`${emojis.reply1} Thank you for choosing **Faizue Utils**, I will make sure to try my best to protect your server from raider's, spammer's and so much more.
        
You can invite me. Need Your servers protected? You can purchase me from faizur and  Add me to any server you think needs protection!
        `)
			.setColor(0x2b2d31);

		const owner = await guild.fetchOwner();
		await owner
			.send({
				embeds: [embed],
				components: [buttons],
			})
			.catch(() => {});
	}
}
