const { SlashCommandBuilder } = require('discord.js')
const afflictedItems = require('../../../data/afflictedItems.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('afflicted')
    .setDescription('Get afflicted item info'),
  async execute (interaction) {
    const chosenItem = interaction.options.get('afflicted-item').value
    const itemData = afflictedItems.filter(item => item.name === chosenItem)
    console.log(itemData)

    await interaction.reply(`The item is ${chosenItem}`)
  }
}
