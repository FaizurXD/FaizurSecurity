import { SlashCommandBuilder } from 'discord.js';
import { ClientCommand } from '../index';

export default class TicketSystemCommand implements ClientCommand {
    data: SlashCommandBuilder = new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Initiate a support ticket (owner only)');

    async run(interaction: any): Promise<void> {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return await interaction.reply({
                content: 'You do not have permission to use this command.',
                ephemeral: true
            });
        }

        await interaction.reply({
            content: 'Please set the ticket channel where tickets will be created:',
            ephemeral: true,
            components: [{
                type: 'ACTION_ROW',
                components: [{
                    type: 'SELECT_CHANNEL',
                    customId: 'ticket_channel',
                    placeholder: 'Select a channel'
                }]
            }]
        });
    }
}
