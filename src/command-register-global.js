const { REST, Routes, ApplicationCommandOptionType } = require('discord.js')
const getAfflictedItemList = require('./utils/getAfflictedItemList')
require('dotenv').config()

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
  },
  {
    name: 'backup-kelbi',
    description: 'Send a backup of the kelbi database',
    options: [
      {
        name: 'login',
        description: 'Your ingame login',
        type: ApplicationCommandOptionType.String,
        required: true
      },
      {
        name: 'password',
        description: 'Your ingame password',
        type: ApplicationCommandOptionType.String,
        required: true
      },
      {
        name: 'blacklist',
        description: 'Should you backup quests and questlists?',
        type: ApplicationCommandOptionType.Boolean,
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
