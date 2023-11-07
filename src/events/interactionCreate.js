const { Events } = require('discord.js')

module.exports = {
  name: Events.InteractionCreate,
  async execute (interaction) {
    if (!interaction.isChatInputCommand()) return

    const command = interaction.client.commands.get(interaction.commandName)

    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found.`)
      return
    }

    try {
      console.log(`[${interaction.commandName.toUpperCase()}] User: ${interaction.user.username} Guild: ${interaction.guild.name}`)
      await command.execute(interaction)
    } catch (error) {
      console.error(`Error executing ${interaction.commandName}`)
      console.error(error)
    }
  }
}
