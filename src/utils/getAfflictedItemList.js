const getAfflictedItemList = () => {
  const afflictedList = require('../../assets/afflictedItems.json')

  const afflictedStringArray = afflictedList.map(item => {
    return { name: item.name, value: String(item.id) }
  })

  return afflictedStringArray
}

module.exports = getAfflictedItemList
