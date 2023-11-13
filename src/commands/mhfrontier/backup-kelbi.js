const { SlashCommandBuilder } = require("discord.js");
const { exec } = require("child_process");
const AdmZip = require("adm-zip");
const fs = require("fs");
const sendMail = require("../../utils/backupKelbiEmail");
const pool = require("../../utils/dbConnection");
const bcrypt = require("bcryptjs");
const path = require("path");

const rootPath = path.join(__dirname, "../../../");
const backupFolderPath = path.join(rootPath, "kelbi-backups");

const getDumpBackupFilePath = () => {
  const filename = `kelbi_${new Date().toISOString().slice(0, 10)}.sql`;

  if (!fs.existsSync(backupFolderPath)) {
    fs.mkdirSync(backupFolderPath, { recursive: true });
  }

  return path.join(backupFolderPath, filename);
};


module.exports = {
  data: new SlashCommandBuilder()
    .setName("backup-kelbi")
    .setDescription("Send a backup of the kelbi database"),
  async execute(interaction) {
    const loginInput = interaction.options.get("login").value;
    const passwordInput = interaction.options.get("password").value;
    const blacklistInput = interaction.options.get("blacklist").value;

    await interaction.deferReply({ ephemeral: true });

    const tableBacklist = ["quests", "questlist"];
    const excludeTablesPgDumpFlag = tableBacklist
      .map((table) => `-T ${table}`)
      .join(" ");

    const tPgDumpFlag = blacklistInput ? "" : excludeTablesPgDumpFlag;

    try {
      const authLogin = await isDevUser(loginInput, passwordInput);

      if (!authLogin) {
        interaction.editReply("Invalid user or not a dev");
        return;
      }

      const dumpPath = getDumpBackupFilePath();

      const cmd = `pg_dump -h ${process.env.DB_HOST} -U ${process.env.DB_USER} -d ${process.env.DB_DATABASE} ${tPgDumpFlag} -f ${dumpPath}`;

      exec(cmd, async (error) => {
        if (error) {
          console.error(error);
          return interaction.editReply("Fail to get backup!");
        }

        const zipPath = dumpPath.replace(".sql", ".zip");
        const zip = new AdmZip();

        zip.addLocalFile(dumpPath);
        zip.writeZip(zipPath);

        // Deleting unused dump file
        fs.unlinkSync(dumpPath);

        // Discord AND outlook can't take questlist data because 8MB limite
        if (blacklistInput) {
          return interaction.editReply(
            "The file exceeds the 8MB limit. Only saving backup locally"
          );
        }

        await sendMail(zipFileName, blacklistInput);

        interaction.editReply({
          content: "Backup was done successfully! Also sending it by email",
          files: [zipFileName],
        });
      });
    } catch (error) {
      console.error(error);
      interaction.editReply("Unexpected error trying to get backup!");
    }
  },
};

const isDevUser = async (user, password) => {
  const query = `
    SELECT
      username,
      password,
      dev
    FROM
      users
    WHERE
      username = $1;
  `;

  const { rows } = await pool.query(query, [user]);

  if (rows.length > 0) {
    const dbPassword = rows[0].password;
    const dbDev = rows[0].dev;

    const loginMatch = await bcrypt.compare(
      String(password),
      String(dbPassword)
    );

    if (loginMatch && dbDev) return true;
  }

  return false;
};
