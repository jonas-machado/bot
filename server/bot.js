require("dotenv").config();
const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  hyperlink,
} = require("discord.js");

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

let globalOltIntelbras = [];

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
  if (commandName == "teste") {
    orion.query(
      {
        query: `
        SELECT TOP 100 
      EventID,
      DAY(EventTime) AS DayTime, 
      MONTH(EventTime) AS MonthTime, 
      year(EventTime) AS YearTime, 
      HOUR(EventTime) AS HourTime, 
      MINUTE(EventTime) AS MinuteTime, 
      SECOND(EventTime) AS SecondTime, 
      Message, 
      EventType,         
      IPAddress,
      NodeName,
      Location,
      POP_ID,
      City,
      Department,
      nwu.WebUri,
      n.NodeID,
      ncp.NodeID AS NCPNode,
      nwu.NodeID AS NWUNode,
      EventTime,
      NetObjectID
      FROM  
      Orion.Events AS e, 
      Orion.Nodes AS n,
      Orion.NodesCustomProperties AS ncp,
      Orion.NodeWebUri AS nwu
      WHERE 
      EventType LIKE "1" AND networknode=n.nodeid AND networknode=ncp.nodeid AND networknode=nwu.nodeid
      OR 
      EventType LIKE "5" AND networknode=n.nodeid AND networknode=ncp.nodeid AND networknode=nwu.nodeid
      OR 
      EventType LIKE "10" AND networknode=n.nodeid AND networknode=ncp.nodeid AND networknode=nwu.nodeid
      OR 
      EventType LIKE "11" AND networknode=n.nodeid AND networknode=ncp.nodeid AND networknode=nwu.nodeid
      ORDER BY EventTime DESC;
      `,
      },
      async function (result) {
        const address = hyperlink(
          result.results[0].IPAddress,
          `http://172.16.40.9${result.results[0].WebUri}`
        );

        const events = new EmbedBuilder()
          .setColor(
            result.results[0].EventType == 1 ||
              result.results[0].EventType == 10
              ? 0xff0000
              : 0x32cd32
          )
          .setTitle(result.results[0].NodeName.replace(/_/g, " "))
          .setDescription(result.results[0].Message)
          .addFields(
            {
              name: "IP",
              value: address,
              inline: true,
            },
            result.results[0]?.Department
              ? {
                  name: "TIPO",
                  value: result.results[0].Department,
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
            result.results[0].POP_ID || result.results[0].Location
              ? {
                  name: "LOCAL",
                  value: `${
                    result.results[0].POP_ID
                      ? result.results[0].POP_ID + "."
                      : ""
                  }  ${
                    result.results[0].Location
                      ? result.results[0].Location + "."
                      : ""
                  }`,
                  inline: true,
                }
              : {
                  name: "\u200B",
                  value: "\u200B",
                  inline: true,
                },
            result.results[0].City
              ? {
                  name: "CIDADE",
                  value: result.results[0].City,
                }
              : {
                  name: "\u200B",
                  value: "\u200B",
                  inline: true,
                }
          )
          .setFooter({
            text: `${("0" + result.results[0].DayTime).slice(-2)}/${(
              "0" + result.results[0].MonthTime
            ).slice(-2)}/${result.results[0].YearTime} ${(
              "0" + result.results[0].HourTime
            ).slice(-2)}:${("0" + result.results[0].MinuteTime).slice(-2)}`,
          });
        const i = 1;
        if (
          (result.results[i].EventType == 10 &&
            result.results[i].NodeID != result.results[i].NetObjectID) ||
          (result.results[i].EventType == 11 &&
            result.results[i].NodeID != result.results[i].NetObjectID)
        ) {
          orion.query(
            {
              query: `
              SELECT
              EventID,
              DAY(EventTime) AS DayTime,
              MONTH(EventTime) AS MonthTime,
              year(EventTime) AS YearTime,
              HOUR(EventTime) AS HourTime,
             MINUTE(EventTime) AS MinuteTime,
              SECOND(EventTime) AS SecondTime,
              Message,
              EventType,
              IPAddress,
              Name,
             NodeName,
             Location,
              POP_ID,
              City,
              Department,
              nwu.WebUri,
              n.NodeID,
              ncp.NodeID AS NCPNode,
              nwu.NodeID AS NWUNode,
              EventTime,
   FullName,
   i.NodeID AS iNodeID, 
                   i.InterfaceID AS iIntefaceID, 
                   iwu.NodeID AS iwuNodeID, 
                   iwu.InterfaceID AS iwuIntefaceID, 
                   iwu.WebUri AS IWebUri
              FROM
              Orion.Events AS e,
              Orion.Nodes AS n,
              Orion.NodesCustomProperties AS ncp,
              Orion.NodeWebUri AS nwu,
   Orion.NPM.Interfaces as i, 
   Orion.NPM.InterfaceWebUri AS iwu
              WHERE
              EventID=@id AND
   networknode=n.nodeid AND 
   networknode=ncp.nodeid AND 
   networknode=nwu.nodeid AND
   i.InterfaceID=iwu.InterfaceID AND
   Message LIKE i.FullName + '%'
             ORDER BY EventTime DESC;
              `,
              parameters: {
                id: result.results[i].EventID,
              },
            },
            async function (result) {
              let i = 0;
              const pon = result.results[0].Name.split("-");
              if (pon[3] == 0) {
                const address = hyperlink(
                  result.results[0].IPAddress,
                  `http://172.16.40.9${result.results[0].IWebUri}`
                );
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
                      value: address,
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
                return interaction.reply({ embeds: [events] });
              } else if (pon[3] > 0) {
                globalOltIntelbras.push({
                  ID: result.results[i].EventID,
                  Message: result.results[i].Message,
                  onu: result.results[i].Name,
                  time: `${("0" + result.results[i].DayTime).slice(-2)}/${(
                    "0" + result.results[i].MonthTime
                  ).slice(-2)}/${result.results[i].YearTime} ${(
                    "0" + result.results[i].HourTime
                  ).slice(-2)}:${("0" + result.results[i].MinuteTime).slice(
                    -2
                  )}`,
                });
                let onus = [];
                if (globalOltIntelbras.length > 3) {
                  const EmbedConf = {
                    address: hyperlink(
                      result.results[0].IPAddress,
                      `http://172.16.40.9${result.results[0].WebUri}`
                    ),
                  };
                  globalOltIntelbras.map((onu) => {
                    onus.push(onu.Message);
                  });
                  const events = new EmbedBuilder()
                    .setColor(0xff0000)
                    .setTitle(result.results[i].NodeName.replace(/_/g, " "))
                    .setDescription(onus.join("\n"))
                    .setFooter({
                      text: `${("0" + result.results[i].DayTime).slice(-2)}/${(
                        "0" + result.results[i].MonthTime
                      ).slice(-2)}/${result.results[i].YearTime} ${(
                        "0" + result.results[i].HourTime
                      ).slice(-2)}:${("0" + result.results[i].MinuteTime).slice(
                        -2
                      )}`,
                    });
                  const time = setTimeout(() => {
                    client.channels.cache
                      .get(`1021807249573806090`)
                      .send({ embeds: [events] });
                  }, 20000);
                }
              } else {
                console.log("não deu");
              }
            }
          );
        } else {
          return interaction.reply({ embeds: [events] });
        }
      }
    );
  }
});

// const adicionar = () => {
//   orion.query(
//     {
//       query: `
//       SELECT TOP 100
//           EventID,
//           DAY(EventTime) AS DayTime,
//           MONTH(EventTime) AS MonthTime,
//           year(EventTime) AS YearTime,
//           HOUR(EventTime) AS HourTime,
//           MINUTE(EventTime) AS MinuteTime,
//           SECOND(EventTime) AS SecondTime,
//           Message,
//           EventType,
//           IPAddress,
//           NodeName,
//           Location,
//           POP_ID,
//           City,
//           Department,
//           nwu.WebUri,
//           n.NodeID,
//           ncp.NodeID AS NCPNode,
//           nwu.NodeID AS NWUNode,
//           EventTime
//           FROM
//           Orion.Events AS e,
//           Orion.Nodes AS n,
//           Orion.NodesCustomProperties AS ncp,
//           Orion.NodeWebUri AS nwu
//           WHERE
//           EventType LIKE "1" AND networknode=n.nodeid AND networknode=ncp.nodeid AND networknode=nwu.nodeid
//           OR
//           EventType LIKE "5" AND networknode=n.nodeid AND networknode=ncp.nodeid AND networknode=nwu.nodeid
//           OR
//           EventType LIKE "10" AND networknode=n.nodeid AND networknode=ncp.nodeid AND networknode=nwu.nodeid
//           OR
//           EventType LIKE "11" AND networknode=n.nodeid AND networknode=ncp.nodeid AND networknode=nwu.nodeid
//           ORDER BY EventTime DESC;
//                   `,
//       //query: `SELECT TOP 15 GETDATE() AS Time, Message, EventTime, EventType FROM Orion.Events WHERE EventType LIKE "1" OR EventType LIKE "5" OR EventType LIKE "10" OR EventType LIKE "11" ORDER BY EventTime DESC`,
//     },
//     function (result) {
//       let IDEvent = [];
//       result.results.map((event) => {
//         IDEvent.push(event.EventID);
//       });

//       setInterval(() => {
//         orion.query(
//           {
//             query: `
//             SELECT TOP 100
//           EventID,
//           DAY(EventTime) AS DayTime,
//           MONTH(EventTime) AS MonthTime,
//           year(EventTime) AS YearTime,
//           HOUR(EventTime) AS HourTime,
//           MINUTE(EventTime) AS MinuteTime,
//           SECOND(EventTime) AS SecondTime,
//           Message,
//           EventType,
//           IPAddress,
//           NodeName,
//           Location,
//           POP_ID,
//           City,
//           Department,
//           nwu.WebUri,
//           n.NodeID,
//           ncp.NodeID AS NCPNode,
//           nwu.NodeID AS NWUNode,
//           EventTime
//           FROM
//           Orion.Events AS e,
//           Orion.Nodes AS n,
//           Orion.NodesCustomProperties AS ncp,
//           Orion.NodeWebUri AS nwu
//           WHERE
//           EventType LIKE "1" AND networknode=n.nodeid AND networknode=ncp.nodeid AND networknode=nwu.nodeid
//           OR
//           EventType LIKE "5" AND networknode=n.nodeid AND networknode=ncp.nodeid AND networknode=nwu.nodeid
//           OR
//           EventType LIKE "10" AND networknode=n.nodeid AND networknode=ncp.nodeid AND networknode=nwu.nodeid
//           OR
//           EventType LIKE "11" AND networknode=n.nodeid AND networknode=ncp.nodeid AND networknode=nwu.nodeid
//           ORDER BY EventTime DESC;
//           `,
//           },
//           async function (result) {
//             try {
//               let IDEventNew = [];
//               result.results.map((event) => {
//                 IDEventNew.push(event.EventID);
//               });
//               for (let i = 0; i < result.results.length; i++) {
//                 const msg = hyperlink(
//                   result.results[i].IPAddress,
//                   `http://172.16.40.9${result.results[i].WebUri}`
//                 );
//                 if (!IDEvent.includes(IDEventNew[i])) {
//                   const events = new EmbedBuilder()
//                     .setColor(
//                       result.results[i].EventType == 1 ||
//                         result.results[i].EventType == 10
//                         ? 0xff0000
//                         : 0x32cd32
//                     )
//                     .setTitle(result.results[i].NodeName.replace(/_/g, " "))
//                     .setDescription(result.results[i].Message)
//                     .addFields(
//                       {
//                         name: "IP",
//                         value: result.results[i].IPAddress,
//                         inline: true,
//                       },
//                       result.results[i]?.Department
//                         ? {
//                             name: "TIPO",
//                             value: result.results[i].Department,
//                             inline: true,
//                           }
//                         : {
//                             name: "\u200B",
//                             value: "\u200B",
//                             inline: true,
//                           },
//                       {
//                         name: "\u200B",
//                         value: "\u200B",
//                         inline: true,
//                       },
//                       result.results[i].POP_ID || result.results[i].Location
//                         ? {
//                             name: "LOCAL",
//                             value: `${
//                               result.results[i].POP_ID
//                                 ? result.results[i].POP_ID + "."
//                                 : ""
//                             }  ${
//                               result.results[i].Location
//                                 ? result.results[i].Location + "."
//                                 : ""
//                             }`,
//                             inline: true,
//                           }
//                         : {
//                             name: "\u200B",
//                             value: "\u200B",
//                             inline: true,
//                           },
//                       result.results[i].City
//                         ? {
//                             name: "CIDADE",
//                             value: result.results[i].City,
//                           }
//                         : {
//                             name: "\u200B",
//                             value: "\u200B",
//                             inline: true,
//                           }
//                     )
//                     .setFooter({
//                       text: `${("0" + result.results[i].DayTime).slice(-2)}/${(
//                         "0" + result.results[i].MonthTime
//                       ).slice(-2)}/${result.results[i].YearTime} ${(
//                         "0" + result.results[i].HourTime
//                       ).slice(-2)}:${("0" + result.results[i].MinuteTime).slice(
//                         -2
//                       )}`,
//                     });
//                   await client.channels.cache
//                     .get(`1021807249573806090`)
//                     .send({ embeds: [events] });
//                   console.log(result.results[i].Message);
//                 } else {
//                   console.log("repetido");
//                 }
//               }
//               IDEvent = IDEventNew;
//               console.log(IDEventNew);
//             } catch (err) {
//               console.log(err);
//             }
//           }
//         );
//       }, 10000);
//     }
//   );
// };
// adicionar();
