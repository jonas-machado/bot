require("dotenv").config();
const { SlashCommandBuilder, Routes } = require("discord.js");
const { REST } = require("@discordjs/rest");
const clientId = process.env.CLIENTID;
const token = process.env.TOKEN;
console.log(clientId);
const commands = [
  new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Para a verificação!"),
  new SlashCommandBuilder()
    .setName("salgadinho")
    .setDescription("Manda mensagem cobrando o salgadinho!"),
  new SlashCommandBuilder()
    .setName("start")
    .setDescription("Inicia a verificação!"),
  new SlashCommandBuilder()
    .setName("teste")
    .setDescription("Envia apenas um evento para teste"),
].map((command) => command.toJSON());

const rest = new REST({ version: "10" }).setToken(token);

rest
  .put(Routes.applicationCommands(clientId), { body: commands })
  .then((data) =>
    console.log(`Successfully registered ${data.length} application commands.`)
  )
  .catch(console.error);
