const { SlashCommandBuilder } = require('discord.js')
const afflictedItems = require('../../../assets/afflictedItems.json')
const afflictedAmbed = require('../../embeds/afflictedAmbed')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('afflicted')
    .setDescription('Get afflicted item info'),
  async execute (interaction) {
    const chosenItem = interaction.options.get('afflicted-item').value
    const itemDataQuery = afflictedItems.filter(item => String(item.id) === String(chosenItem))

    if (itemDataQuery.length > 1) {
      console.log('Error! Duplicate data')
      await interaction.reply('Error! Duplicate data')
      return
    }

    if (itemDataQuery.length === 0) {
      console.log('Error! No data found!')
      await interaction.reply('Error! No data found')
      return
    }

    const itemData = itemDataQuery[0]

    await interaction.reply({ embeds: [afflictedAmbed(itemData)] })
  }
}
