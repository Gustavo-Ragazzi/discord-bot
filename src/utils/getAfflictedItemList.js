const getAfflictedItemList = () => {
  const afflictedList = require('../../data/afflictedItems.json')
  const afflictedItemNameList = afflictedList.map(item => item.name)
  const afflictedItemChoicesObject = afflictedItemNameList.map(item => {
    return { name: item, value: item }
  })

  return afflictedItemChoicesObject
}

module.exports = getAfflictedItemList
