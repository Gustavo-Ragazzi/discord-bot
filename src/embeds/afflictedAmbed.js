const { EmbedBuilder } = require('discord.js')

const afflictedAmbed = (itemData) => {
  const starIcon = '★'

  return new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle(`A${itemData.threatLevel}${starIcon} | ${itemData.difficultyLevels[0].item} Family`)
    .addFields(
      { name: itemData.difficultyLevels[0].item, value: `Min: ${itemData.difficultyLevels[0].minLevel} | Max: ${itemData.difficultyLevels[0].maxLevel}`, inline: true },
      { name: itemData.difficultyLevels[1].item, value: `Min: ${itemData.difficultyLevels[1].minLevel} | Max: ${itemData.difficultyLevels[1].maxLevel}`, inline: true },
      { name: itemData.difficultyLevels[2].item, value: `Min: ${itemData.difficultyLevels[2].minLevel} | Max: ${itemData.difficultyLevels[2].maxLevel}`, inline: true }
    )
    .setImage(itemData.imagePath)
    .setFooter({ text: itemData.monsters.join(', ') })
}

module.exports = afflictedAmbed
