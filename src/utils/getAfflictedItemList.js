const getAfflictedItemList = () => {
  const afflictedList = require('../../assets/afflictedItems.json')
  const allDifficultyItems = afflictedList.flatMap(item => item.difficultyLevels.map(level => level.item))
  const afflictedItemChoicesObject = allDifficultyItems.map(item => {
    return { name: item, value: item }
  })

  return afflictedItemChoicesObject
}

module.exports = getAfflictedItemList
