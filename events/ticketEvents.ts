import { Interaction, TextChannel, MessageEmbed, MessageActionRow, MessageSelectMenu } from 'discord.js';
import { PermissionsBitField } from 'discord.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class TicketEvents {
    name = 'interactionCreate';

    async run(interaction: Interaction) {
        if (interaction.isCommand()) {
            if (interaction.commandName === 'ticket-setup') {
                const command = new (await import('../commands/ticketSystem')).default();
                await command.run(interaction as ChatInputCommandInteraction);
            }
        } else if (interaction.isSelectMenu()) {
            const guild = interaction.guild;
            const member = interaction.member;

            const guildConfig = await prisma.guild.findUnique({
                where: { guild: guild?.id },
            });

            if (!guildConfig) {
                return interaction.reply('The ticket system is not properly configured.');
            }

            const category = guild?.channels.cache.find(c => c.name === guildConfig.ticketCategory && c.type === 'GUILD_CATEGORY');
            const staffRoles = guildConfig.staffRoles.map(roleId => guild?.roles.cache.get(roleId));
            const logChannel = guild?.channels.cache.get(guildConfig.ticketLogChannel) as TextChannel;

            if (!category || !staffRoles.length || !logChannel) {
                return interaction.reply('The ticket system is not properly configured.');
            }

            const ticketChannel = await guild?.channels.create({
                name: `ticket-${interaction.user?.username}`,
                type: 'GUILD_TEXT',
                parent: category.id,
                permissionOverwrites: [
                    {
                        id: guild.id,
                        deny: [PermissionsBitField.Flags.ViewChannel],
                    },
                    {
                        id: member.id!,
                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                    },
                    ...staffRoles.map(role => ({
                        id: role?.id!,
                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                    })),
                ],
            });

            const embed = new MessageEmbed()
                .setTitle('Ticket Created')
                .setDescription(`Your ticket has been created: ${ticketChannel}`)
                .setColor('GREEN');

            await logChannel.send(`Ticket created by ${interaction.user?.tag}: ${ticketChannel}`);
            await interaction.reply({ content: `@${interaction.user?.username}, your ticket has been created: ${ticketChannel}`, ephemeral: true });
        } else if (interaction.isButton()) {
            if (interaction.customId === 'close_ticket') {
                const ticketChannel = interaction.channel as TextChannel;
                const guild = interaction.guild;
                const member = interaction.member;

                const guildConfig = await prisma.guild.findUnique({
                    where: { guild: guild?.id },
                });

                if (!guildConfig) {
                    return interaction.reply('The ticket system is not properly configured.');
                }

                const logChannel = guild?.channels.cache.get(guildConfig.ticketLogChannel) as TextChannel;

                if (!ticketChannel || !logChannel) {
                    return interaction.reply('The ticket system is not properly configured.');
                }

                await ticketChannel.permissionOverwrites.edit(guild.id, { ViewChannel: false });
                await ticketChannel.permissionOverwrites.edit(member?.id!, { ViewChannel: false });

                const embed = new MessageEmbed()
                    .setTitle('Ticket Closed')
                    .setDescription(`This ticket has been closed by ${interaction.user?.tag}.`)
                    .setColor('RED');

                await logChannel.send(`Ticket closed by ${interaction.user?.tag}: ${ticketChannel.name}`);
                await interaction.reply({ embeds: [embed], ephemeral: true });
            }
        }
    }
}

export default TicketEvents;
