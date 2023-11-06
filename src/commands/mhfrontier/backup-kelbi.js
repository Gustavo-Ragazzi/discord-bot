const { SlashCommandBuilder } = require('discord.js')
const { exec } = require('child_process')
const fs = require('fs')
const AdmZip = require('adm-zip')
const backupFileName = `kelbi_${new Date().toISOString().slice(0, 10)}.sql`

module.exports = {
  data: new SlashCommandBuilder()
    .setName('backup-kelbi')
    .setDescription('Send a backup of the kelbi database'),
  async execute (interaction) {
    await interaction.deferReply({ ephemeral: true })

    const tableBlackList = ['quests', 'questlist']
    const tabelasExcluidasArgs = tableBlackList.map(tabela => `-T${tabela}`).join(' ')
    const zipFileName = backupFileName.replace('.sql', '') + '.zip'
    const cmd = `pg_dump -h ${process.env.DB_HOST} -U ${process.env.DB_USER} -d ${process.env.DB_DATABASE} ${tabelasExcluidasArgs} -f ${backupFileName}`

    try {
      exec(cmd, (error) => {
        if (!error) {
          const zip = new AdmZip()
          zip.addLocalFile(backupFileName)
          zip.writeZip(zipFileName)

          interaction.editReply({
            content: 'Backup was done successfully!',
            files: [zipFileName]
          })

          setTimeout(() => {
            if (backupFileName) {
              fs.unlinkSync(backupFileName)
            }
            if (zipFileName) {
              fs.unlinkSync(zipFileName)
            }
          }, 20000)
        } else {
          interaction.editReply('Fail to get backup!')
        }
      })
    } catch (error) {
      interaction.editReply('Unexpected error trying to get backup!')
    }
  }
}
