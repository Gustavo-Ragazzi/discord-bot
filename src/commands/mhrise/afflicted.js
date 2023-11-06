const { SlashCommandBuilder } = require('discord.js')
const afflictedItems = require('../../../assets/afflictedItems.json')
const afflictedAmbed = require('../../embeds/afflictedAmbed')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('afflicted')
    .setDescription('Get afflicted item info'),
  async execute (interaction) {
    const chosenItem = interaction.options.get('afflicted-item').value
    const itemDataQuery = afflictedItems.filter(item => {
      return item.difficultyLevels.some(difficulty => difficulty.item === chosenItem)
    })

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

    const item = itemData.name
    const imagePath = itemData.imagePath
    const monsters = itemData.monsters.join(', ')
    const difficultyOptions = itemData.difficultyLevels.filter(item => item.item === chosenItem)
    const chosenDifficulty = difficultyOptions[0]
    const minLevel = String(chosenDifficulty.minLevel)
    const maxLevel = String(chosenDifficulty.maxLevel)
    const threatLevel = itemData.threatLevel

    await interaction.reply({ embeds: [afflictedAmbed(item, imagePath, monsters, minLevel, maxLevel, threatLevel)] })
  }
}
