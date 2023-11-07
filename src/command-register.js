require('dotenv').config()
const { REST, Routes, ApplicationCommandOptionType } = require('discord.js')
// const getAfflictedItemList = require('./utils/getAfflictedItemList')

const commands = [
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
