require("dotenv").config();
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");

const orion = require("solar-orionjs")({
  server: "172.16.40.9",
  port: 17778,
  auth: {
    username: "redes2020",
    password: "OT#internet2018",
  },
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
  ],
}); //create new client

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.TOKEN);

const cobrança = {
  0: "994582003733254207",
  1: "997132879144435812",
  2: "994591749076951050",
  3: "994588286712553482",
  4: "991334148025356429",
  5: "993857720081985537",
  6: "992516894311591997",
  7: "995036773833003039",
  8: "997116970287771699",
  9: "997122144016281664",
  10: "994582003733254207",
};

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const { commandName } = interaction;
  if (commandName == "salgadinho") {
    let date = new Date();
    let month = date.getMonth();
    console.log(cobrança[month]);

    const user = await client.users.fetch(cobrança[month]);
    user.send("To esperando o salgadinho 😡").catch((e) => {
      if (e) {
        interaction.channel.send(
          "Bah, não consegui cobrar, vou ter que tomar outras providências 🔪"
        );
      }
    });
    interaction.reply("Tá cobrado 👍");
  }
  if (commandName == "stop") {
    clearInterval(intervalVerification);
    interaction.reply("Opa meu querido, a verificação foi parada");
  }
  if (commandName == "start") {
    adicionar();
    interaction.reply("Opa coisa linda, verificação vai começar agora");
  }
});

const adicionar = () => {
  orion.query(
    {
      query: `
      SELECT TOP 100 
          DAY(EventTime) AS DayTime, 
          MONTH(EventTime) AS MonthTime, 
          year(EventTime) AS YearTime, 
          HOUR(EventTime) AS HourTime, 
          MINUTE(EventTime) AS MinuteTime, 
          SECOND(EventTime) AS SecondTime, 
          Message, 
          EventTime, 
          EventID,
          EventType,
          n.NodeID,
          ncp.NodeID AS NCPNode,
          IPAddress,
          NodeName,
          Location,
          NodeDescription,
          POP_ID,
          City,
          Department
          FROM  
          Orion.Events AS e, 
          Orion.Nodes AS n,
          Orion.NodesCustomProperties AS ncp
          WHERE 
          EventType LIKE "1" AND networknode=n.nodeid AND networknode=ncp.nodeid
          OR 
          EventType LIKE "5" AND networknode=n.nodeid AND networknode=ncp.nodeid
          OR 
          EventType LIKE "10" AND networknode=n.nodeid AND networknode=ncp.nodeid
          OR 
          EventType LIKE "11" AND networknode=n.nodeid AND networknode=ncp.nodeid
          ORDER BY EventTime DESC;
                  `,
      //query: `SELECT TOP 15 GETDATE() AS Time, Message, EventTime, EventType FROM Orion.Events WHERE EventType LIKE "1" OR EventType LIKE "5" OR EventType LIKE "10" OR EventType LIKE "11" ORDER BY EventTime DESC`,
    },
    function (result) {
      let IDEvent = [];
      result.results.map((event) => {
        IDEvent.push(event.EventID);
      });
      
      setInterval(() => {
        orion.query(
          {
            query: `
            SELECT TOP 100 
          DAY(EventTime) AS DayTime, 
          MONTH(EventTime) AS MonthTime, 
          year(EventTime) AS YearTime, 
          HOUR(EventTime) AS HourTime, 
          MINUTE(EventTime) AS MinuteTime, 
          SECOND(EventTime) AS SecondTime, 
          Message, 
          EventTime, 
          EventID,
          EventType,
          n.NodeID,
          ncp.NodeID AS NCPNode,
          IPAddress,
          NodeName,
          Location,
          NodeDescription,
          POP_ID,
          City,
          Department
          FROM  
          Orion.Events AS e, 
          Orion.Nodes AS n,
          Orion.NodesCustomProperties AS ncp
          WHERE 
          EventType LIKE "1" AND networknode=n.nodeid AND networknode=ncp.nodeid
          OR 
          EventType LIKE "5" AND networknode=n.nodeid AND networknode=ncp.nodeid
          OR 
          EventType LIKE "10" AND networknode=n.nodeid AND networknode=ncp.nodeid
          OR 
          EventType LIKE "11" AND networknode=n.nodeid AND networknode=ncp.nodeid
          ORDER BY EventTime DESC;
                  `,
            //query: `SELECT TOP 15 GETDATE() AS Time, Message, EventTime, EventType FROM Orion.Events WHERE EventType LIKE "1" OR EventType LIKE "5" OR EventType LIKE "10" OR EventType LIKE "11" ORDER BY EventTime DESC`,
            //query: `SELECT Message, EventTime, GETDATE() AS [GetDate], GETUTCDATE() AS [getUTCDate] FROM Orion.Events`,
          },
          function (result) {
            try {
              let IDEventNew = [];
              result.results.map((event) => {
              IDEventNew.push(event.EventID);
              });
              for (let i = 0; i < result.results.length; i++) {
                if (!IDEvent.includes(IDEventNew[i])) {
                  const events = new EmbedBuilder()
                    .setColor(
                      result.results[i].EventType == 1 ||
                        result.results[i].EventType == 10
                        ? 0xff0000
                        : 0x32cd32
                    )
                    .setTitle(result.results[i].NodeName.replace(/_/g, " "))
                    .setDescription(result.results[i].Message)
                    .addFields(
                      {
                        name: "IP",
                        value: result.results[i].IPAddress,
                        inline: true,
                      },
                      result.results[i]?.Department
                        ? {
                            name: "TIPO",
                            value: result.results[i].Department,
                            inline: true,
                          }
                        : {
                            name: "\u200B",
                            value: "\u200B",
                            inline: true,
                          },
                      {
                        name: "\u200B",
                        value: "\u200B",
                        inline: true,
                      },
                      result.results[i].POP_ID || result.results[i].Location
                        ? {
                            name: "LOCAL",
                            value: `${
                              result.results[i].POP_ID
                                ? result.results[i].POP_ID + "."
                                : ""
                            }  ${
                              result.results[i].Location
                                ? result.results[i].Location + "."
                                : ""
                            }`,
                            inline: true,
                          }
                        : {
                            name: "\u200B",
                            value: "\u200B",
                            inline: true,
                          },
                      result.results[i].City
                        ? {
                            name: "CIDADE",
                            value: result.results[i].City,
                          }
                        : {
                            name: "\u200B",
                            value: "\u200B",
                            inline: true,
                          }
                    )
                    .setFooter({
                      text: `${("0" + result.results[i].DayTime).slice(-2)}/${(
                        "0" + result.results[i].MonthTime
                      ).slice(-2)}/${result.results[i].YearTime} ${(
                        "0" + result.results[i].HourTime
                      ).slice(-2)}:${("0" + result.results[i].MinuteTime).slice(
                        -2
                      )}`,
                    });
                  client.channels.cache
                    .get(`994217078892527627`)
                    .send({ embeds: [events] });
                  IDEvent = IDEventNew
                  console.log(result.results[i].Message);
                } else {
                  console.log("repetido");
                }
              }
              console.log(IDEventNew)
            } catch (err) {
              console.log(err);
            }
          }
        );
      }, 20000);
    }
  );
};
adicionar();
