const { EmbedBuilder } = require('discord.js')

const afflictedAmbed = (item, imagePath, monsters, minLevel, maxLevel, threatLevel) => {
  const lowLevelIcon = ':arrow_down:'
  const highLevelIcon = ':arrow_up: '
  const starIcon = '★'

  return new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle(item)
    .setImage(imagePath)
    .addFields(
      { name: 'Min Level', value: `${lowLevelIcon} **${minLevel}**`, inline: true },
      { name: 'Max Level ', value: `${highLevelIcon} **${maxLevel}**`, inline: true },
      { name: '\n', value: '\n' },
      { name: `**A${threatLevel}${starIcon}** | Monsters`, value: monsters }
    )
    .setTimestamp()
}

module.exports = afflictedAmbed
