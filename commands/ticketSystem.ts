import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction, GuildMember, PermissionsBitField } from 'discord.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ticketSetupCommand = new SlashCommandBuilder()
    .setName('ticket-setup')
    .setDescription('Setup ticket system for the server')
    .addStringOption(option => option.setName('category')
        .setDescription('Category for ticket channels')
        .setRequired(true))
    .addRoleOption(option => option.setName('staffrole')
        .setDescription('Role with staff permissions for tickets')
        .setRequired(true))
    .addChannelOption(option => option.setName('logchannel')
        .setDescription('Channel for logging ticket events')
        .setRequired(true))
    .addChannelOption(option => option.setName('ticketchannel')
        .setDescription('Channel for ticket creation messages')
        .setRequired(true))
    .addStringOption(option => option.setName('reasons')
        .setDescription('Comma-separated list of reasons for ticket creation')
        .setRequired(true));

class TicketSetupCommand {
    data = ticketSetupCommand;

    async run(interaction: ChatInputCommandInteraction) {
        const guildId = interaction.guildId!;
        const category = interaction.options.getString('category')!;
        const staffRole = interaction.options.getRole('staffrole')!;
        const logChannel = interaction.options.getChannel('logchannel')!;
        const ticketChannel = interaction.options.getChannel('ticketchannel')!;
        const reasons = interaction.options.getString('reasons')!.split(',');

        if (!interaction.memberPermissions?.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply('You do not have permission to use this command.');
        }

        // Save the setup data in Prisma
        try {
            await prisma.guild.upsert({
                where: { guild: guildId },
                update: {
                    ticketCategory: category,
                    staffRoles: { set: [staffRole.id] },
                    ticketLogChannel: logChannel.id,
                    ticketChannel: ticketChannel.id,
                    ticketReasons: { set: reasons },
                },
                create: {
                    guild: guildId,
                    ticketCategory: category,
                    staffRoles: [staffRole.id],
                    ticketLogChannel: logChannel.id,
                    ticketChannel: ticketChannel.id,
                    ticketReasons: reasons,
                },
            });
            return interaction.reply(`Ticket system setup completed:
            - Category: ${category}
            - Staff Role: ${staffRole.name}
            - Log Channel: ${logChannel}
            - Ticket Channel: ${ticketChannel}
            - Reasons: ${reasons.join(', ')}`);
        } catch (error) {
            console.error(error);
            return interaction.reply('There was an error setting up the ticket system.');
        }
    }
}

export default TicketSetupCommand;
