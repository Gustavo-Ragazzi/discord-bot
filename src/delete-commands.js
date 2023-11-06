const { REST, Routes } = require('discord.js')
const dotenv = require('dotenv')
dotenv.config()

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN)

// Get id on the guild and change bellow
const commandId = '1170942483035869277';

(async () => {
  await rest.delete(Routes.applicationGuildCommand(process.env.CLIENT_ID, process.env.GUILD_ID, commandId))
    .then(() => console.log('Successfully deleted guild command'))
    .catch((error) => console.error(error))
})()
