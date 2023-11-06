const { REST, Routes, ApplicationCommandOptionType } = require('discord.js')
const getAfflictedItemList = require('./utils/getAfflictedItemList')
const dotenv = require('dotenv')
dotenv.config()

const commands = [
  {
    name: 'ping',
    description: 'Checks if the bot is responding'
  },
  {
    name: 'afflicted',
    description: 'Get afflicted item info',
    options: [
      {
        name: 'afflicted-item',
        description: 'The name of the afflicted item',
        type: ApplicationCommandOptionType.String,
        choices: getAfflictedItemList(),
        required: true
      }
    ]
  }
]

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

(async () => {
  try {
    console.log('Registering slash commands globally...')

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    )

    console.log('Global slash commands were registered successfully!')
  } catch (error) {
    console.log(`There was an error: ${error}`)
  }
})()