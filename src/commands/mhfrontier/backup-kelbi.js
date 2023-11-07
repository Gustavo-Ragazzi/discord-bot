const { SlashCommandBuilder } = require('discord.js')
const { exec } = require('child_process')
const AdmZip = require('adm-zip')
const fs = require('fs')
const email = require('../../utils/backupKelbiEmail')
const pool = require('../../utils/dbConnection')
const bcrypt = require('bcryptjs')
const backupFileName = `kelbi_${new Date().toISOString().slice(0, 10)}.sql`

module.exports = {
  data: new SlashCommandBuilder()
    .setName('backup-kelbi')
    .setDescription('Send a backup of the kelbi database'),
  async execute (interaction) {
    const loginInput = interaction.options.get('login').value
    const passwordInput = interaction.options.get('password').value
    const blacklistInput = interaction.options.get('blacklist').value

    await interaction.deferReply({ ephemeral: true })

    const tableBlackList = ['quests', 'questlist']
    const tabelasExcluidasArgs = tableBlackList.map(tabela => `-T ${tabela}`).join(' ')
    const toogleTableBlacklist = blacklistInput ? '' : tabelasExcluidasArgs

    const zipFileName = backupFileName.replace('.sql', '') + '.zip'
    const cmd = `pg_dump -h ${process.env.DB_HOST} -U ${process.env.DB_USER} -d ${process.env.DB_DATABASE} ${toogleTableBlacklist} -f ${backupFileName}`

    try {
      const authLogin = await userIsDev(loginInput, passwordInput)

      if (authLogin) {
        exec(cmd, (error) => {
          if (!error) {
            const zip = new AdmZip()
            zip.addLocalFile(backupFileName)
            zip.writeZip(zipFileName)

            // Discord AND outlook can't take questlist data becase 8MB limite
            if (blacklistInput) {
              interaction.editReply('The file exceeds the 8MB limit. Saving backup locally')
              const outputFolderPath = './kelbi-backups'

              if (!fs.existsSync(outputFolderPath)) {
                fs.mkdirSync(outputFolderPath, { recursive: true })
              }

              const destinationPath = `${outputFolderPath}/${zipFileName}`

              fs.rename(zipFileName, destinationPath, (error) => {
                if (error) {
                  console.error('Failed to move .zip file to output folder: ', error)
                  fs.unlinkSync(zipFileName)
                }

                fs.unlinkSync(backupFileName)
              })
            } else {
              interaction.editReply({
                content: 'Backup was done successfully! Also sending it by email',
                files: [zipFileName]
              })
              email(zipFileName, blacklistInput)
            }
          } else {
            console.error(error)
            interaction.editReply('Fail to get backup!')
          }
        })
      } else {
        interaction.editReply('Invalid user or not a dev')
      }
    } catch (error) {
      console.error(error)
      interaction.editReply('Unexpected error trying to get backup!')
    }
  }
}

const userIsDev = async (user, password) => {
  const query = `
    SELECT
      username,
      password,
      dev
    FROM
      users
    WHERE
      username = $1;
  `

  const { rows } = await pool.query(query, [user])

  if (rows.length > 0) {
    const dbPassword = rows[0].password
    const dbDev = rows[0].dev

    const loginMatch = await bcrypt.compare(String(password), String(dbPassword))

    if (loginMatch && dbDev) return true
  }

  return false
}
