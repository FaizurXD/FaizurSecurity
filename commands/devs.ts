import {
	type ChatInputCommandInteraction,
	EmbedBuilder,
	SlashCommandBuilder,
} from "discord.js";
import { buttons, emojis } from "../utils.js";

export default class {
	data = new SlashCommandBuilder()
		.setName("devs")
		.setNameLocalizations({ "es-ES": "developers" })
		.setDescription("The official bot developer")
		.setDescriptionLocalizations({
			"es-ES": "developers",
		});

	async run(interaction: ChatInputCommandInteraction) {
		const user1 = await interaction.client.users.fetch("916373880300511322");
		const user2 = await interaction.client.users.fetch("916373880300511322");

		const embed1 = new EmbedBuilder()
			.setTitle(`${emojis.pyrite} ${user1?.tag}`)
			.setThumbnail(user1?.displayAvatarURL())
			.setFields(
				{
					name: "ID",
					value: `${emojis.reply1} \`916373880300511322\` `,
				},
				{
					name: "Role",
					value: `${emojis.reply1} Lead Developer`,
				},
				{
					name: "Joined Discord",
					value: `${emojis.reply1} <t:${
						Math.floor(user1?.createdTimestamp / 1000) + 3600
					}:F>`,
				},
				{
					name: "Owner",
					value: `${emojis.reply1} **__https://discord.com/users/916373880300511322__**`,
				},
			)
			.setFooter({
				text: user1.tag,
				iconURL: user1?.displayAvatarURL(),
			})
			.setColor(0x2b2d31);

		const embed2 = new EmbedBuilder()
			.setTitle(`${emojis.pyrite} ${user2?.tag}`)
			.setThumbnail(user2?.displayAvatarURL())
			.setFields(
				{
					name: "ID",
					value: `${emojis.reply1} \`916373880300511322\` `,
				},
				{
					name: "Role",
					value: `${emojis.reply1} Developer, Designer`,
				},
				{
					name: "Joined Discord",
					value: `${emojis.reply1} <t:${
						Math.floor(user2?.createdTimestamp / 1000) + 3600
					}:F>`,
				},
				{
					name: "Github",
					value: `${emojis.reply1} **__https://discord.com/users/916373880300511322__**`,
				},
			)
			.setFooter({
				text: user2.tag,
				iconURL: user2?.displayAvatarURL(),
			})
			.setColor(0x2b2d31);

		await interaction.reply({
			embeds: [embed1, embed2],
			components: [buttons],
		});
	}
}
