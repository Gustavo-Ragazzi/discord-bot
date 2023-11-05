const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Checks if the bot is responding'),
  async execute (interaction) {
    await interaction.reply('To te ouvindo!')
  }
}
