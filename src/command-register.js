require('dotenv').config()
const { REST, Routes, ApplicationCommandOptionType } = require('discord.js')
const getAfflictedItemList = require('./utils/getAfflictedItemList')

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
    description: 'Send a backup of the kelbi database'
  }
]

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

(async () => {
  try {
    console.log('Registering slash commands...')

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    )

    console.log('Slash commands were registered successfully!')
  } catch (error) {
    console.log(`There was an error: ${error}`)
  }
})()
