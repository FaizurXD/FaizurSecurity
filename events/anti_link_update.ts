import type { Message, TextChannel } from "discord.js";
import { Events } from "discord.js";
import { prisma } from "../database.js";
import { logBuilder } from "../utils.js";

export default class {
	name = Events.MessageUpdate;

	async run(_: Message, message: Message) {
		if (!message.inGuild()) return;
		const guild = await prisma.guild.findUnique({
			where: { guild: message.guildId },
			select: { logs: true, antiLinks: true },
		});
		if (!guild?.antiLinks) return;
		if (
			message.content.includes("discord.gg/") ||
			message.content.includes("dc.gg/") ||
			message.content.includes("dsc.gg/") ||
			message.content.includes("discord.com/invite/")
		) {
			await message.delete();
			const logs = message.guild?.channels.cache.get(
				guild?.logs ?? "",
			) as TextChannel;
			await logs?.send(
				logBuilder({
					// biome-ignore lint/style/noNonNullAssertion: Member will always be defined.
					member: message.member!,
					reason: "Self promote is not allowed in this server!",
				}),
			);
		}
	}
}
