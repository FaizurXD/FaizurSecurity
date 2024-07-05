import { ClientEvent } from '../index';
import { SelectMenuInteraction } from 'discord.js';

export default class TicketSystemEvent implements ClientEvent {
    name = 'interactionCreate';

    async run(interaction: SelectMenuInteraction): Promise<void> {
        if (!interaction.isSelectMenu()) return;

        if (interaction.customId === 'ticket_channel') {
            const ticketChannel = interaction.options.getChannel('ticket_channel');

            if (!ticketChannel || ticketChannel.type !== 'GUILD_TEXT') {
                await interaction.reply({
                    content: 'Please select a valid text channel.',
                    ephemeral: true
                });
                return;
            }

            // You can save `ticketChannel` to your database or configuration file
            // Here, we'll assume saving it to a variable for demo purposes
            const ticketChannelId = ticketChannel.id;
            
            // Send a message with select menu for ticket reasons
            await interaction.guild?.channels.cache.get(ticketChannelId)?.send({
                content: 'Please select a reason for your ticket:',
                components: [{
                    type: 'ACTION_ROW',
                    components: [{
                        type: 'SELECT',
                        customId: 'ticket_reason',
                        placeholder: 'Select a reason',
                        options: [
                            {
                                label: 'Technical Support',
                                value: 'tech_support'
                            },
                            {
                                label: 'Account Assistance',
                                value: 'account_help'
                            },
                            {
                                label: 'Report Abuse',
                                value: 'report_abuse'
                            }
                            // Add more options as needed
                        ]
                    }]
                }]
            });
            
            await interaction.reply({
                content: `Ticket channel set to <#${ticketChannelId}>. Now users can create tickets.`,
                ephemeral: true
            });
        }
    }
}
