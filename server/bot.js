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

//const i = 2;

let globalOltIntelbras = [];
var timeout_handles = [];
var timeout_handles_else = [];

function set_time_out(color, title, state, time, id) {
  let alarm = [];

  if (globalOltIntelbras.length > 3) {
    for (let message of globalOltIntelbras) {
      alarm.push(message.Message);
    }
    const alarmes = alarm.join("\n");
    /// wrapper
    if (id in timeout_handles) {
      clearTimeout(timeout_handles[id]);
    }

    timeout_handles[id] = setTimeout(() => {
      const embedIntefaces = {
        color: color,
        title: `${title}`,
        description: alarmes,
        footer: { text: time },
      };
      console.log(alarmes);
      client.channels.cache
        .get(`1021807249573806090`)
        .send({ embeds: [embedIntefaces] });
      globalOltIntelbras.length = 0;
    }, 300000);
  } else {
    if (id in timeout_handles_else) {
      clearTimeout(timeout_handles_else[id]);
    }
    timeout_handles_else[id] = setTimeout(() => {
      globalOltIntelbras.length = 0;
    }, 300000);
    console.log("menor");
  }
}
const func = {
  queryNode: `SELECT TOP 100 
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
  ORDER BY EventTime DESC;`,
  queryInterface: `
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
  IfName,
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
          "Bah, não consegui cobrar. Vamos ter que tomar outras providências 🔪"
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
  //   if (commandName == "teste") {
  //     orion.query(
  //       {
  //         query: func.queryNode,
  //       },
  //       async function (result) {
  //         const address = hyperlink(
  //           result.results[i].IPAddress,
  //           `http://172.16.40.9${result.results[i].WebUri}`
  //         );

  //         const events = new EmbedBuilder()
  //           .setColor(
  //             result.results[i].EventType == 1 ||
  //               result.results[i].EventType == 10
  //               ? 0xff0000
  //               : 0x32cd32
  //           )
  //           .setTitle(result.results[i].NodeName.replace(/_/g, " "))
  //           .setDescription(result.results[i].Message)
  //           .addFields(
  //             {
  //               name: "IP",
  //               value: address,
  //               inline: true,
  //             },
  //             result.results[i]?.Department
  //               ? {
  //                   name: "TIPO",
  //                   value: result.results[i].Department,
  //                   inline: true,
  //                 }
  //               : {
  //                   name: "\u200B",
  //                   value: "\u200B",
  //                   inline: true,
  //                 },
  //             {
  //               name: "\u200B",
  //               value: "\u200B",
  //               inline: true,
  //             },
  //             result.results[i].POP_ID || result.results[i].Location
  //               ? {
  //                   name: "LOCAL",
  //                   value: `${
  //                     result.results[i].POP_ID
  //                       ? result.results[i].POP_ID + "."
  //                       : ""
  //                   }  ${
  //                     result.results[i].Location
  //                       ? result.results[i].Location + "."
  //                       : ""
  //                   }`,
  //                   inline: true,
  //                 }
  //               : {
  //                   name: "\u200B",
  //                   value: "\u200B",
  //                   inline: true,
  //                 },
  //             result.results[i].City
  //               ? {
  //                   name: "CIDADE",
  //                   value: result.results[i].City,
  //                 }
  //               : {
  //                   name: "\u200B",
  //                   value: "\u200B",
  //                   inline: true,
  //                 }
  //           )
  //           .setFooter({
  //             text: `${("0" + result.results[i].DayTime).slice(-2)}/${(
  //               "0" + result.results[i].MonthTime
  //             ).slice(-2)}/${result.results[i].YearTime} ${(
  //               "0" + result.results[i].HourTime
  //             ).slice(-2)}:${("0" + result.results[i].MinuteTime).slice(-2)}`,
  //           });
  //         if (
  //           (result.results[i].EventType == 10 &&
  //             result.results[i].NodeID != result.results[i].NetObjectID) ||
  //           (result.results[i].EventType == 11 &&
  //             result.results[i].NodeID != result.results[i].NetObjectID)
  //         ) {
  //           console.log(
  //             ` node: ${result.results[i].NodeID}  net: ${result.results[i].NetObjectID}`
  //           );
  //           orion.query(
  //             {
  //               query: func.queryInterface,
  //               parameters: {
  //                 id: result.results[i].EventID,
  //               },
  //             },
  //             async function (result) {
  //               const pon = result.results[0].IfName.split("-");
  //               console.log(pon);
  //               if (pon[3] == 0 || pon[0].includes("gpon")) {
  //                 let i = 0;
  //                 const address = hyperlink(
  //                   result.results[0].IPAddress,
  //                   `http://172.16.40.9${result.results[0].IWebUri}`
  //                 );
  //                 const events = new EmbedBuilder()
  //                   .setColor(
  //                     result.results[i].EventType == 1 ||
  //                       result.results[i].EventType == 10
  //                       ? 0xff0000
  //                       : 0x32cd32
  //                   )
  //                   .setTitle(result.results[i].NodeName.replace(/_/g, " "))
  //                   .setDescription(result.results[i].Message)
  //                   .addFields(
  //                     {
  //                       name: "IP",
  //                       value: address,
  //                       inline: true,
  //                     },
  //                     result.results[i]?.Department
  //                       ? {
  //                           name: "TIPO",
  //                           value: result.results[i].Department,
  //                           inline: true,
  //                         }
  //                       : {
  //                           name: "\u200B",
  //                           value: "\u200B",
  //                           inline: true,
  //                         },
  //                     {
  //                       name: "\u200B",
  //                       value: "\u200B",
  //                       inline: true,
  //                     },
  //                     result.results[i].POP_ID || result.results[i].Location
  //                       ? {
  //                           name: "LOCAL",
  //                           value: `${
  //                             result.results[i].POP_ID
  //                               ? result.results[i].POP_ID + "."
  //                               : ""
  //                           }  ${
  //                             result.results[i].Location
  //                               ? result.results[i].Location + "."
  //                               : ""
  //                           }`,
  //                           inline: true,
  //                         }
  //                       : {
  //                           name: "\u200B",
  //                           value: "\u200B",
  //                           inline: true,
  //                         },
  //                     result.results[i].City
  //                       ? {
  //                           name: "CIDADE",
  //                           value: result.results[i].City,
  //                         }
  //                       : {
  //                           name: "\u200B",
  //                           value: "\u200B",
  //                           inline: true,
  //                         }
  //                   )
  //                   .setFooter({
  //                     text: `${("0" + result.results[i].DayTime).slice(-2)}/${(
  //                       "0" + result.results[i].MonthTime
  //                     ).slice(-2)}/${result.results[i].YearTime} ${(
  //                       "0" + result.results[i].HourTime
  //                     ).slice(-2)}:${("0" + result.results[i].MinuteTime).slice(
  //                       -2
  //                     )}`,
  //                   });
  //                 client.channels.cache
  //                   .get(`1021807249573806090`)
  //                   .send({ embeds: [events] });
  //               } else if (pon[3] > 0) {
  //                 globalOltIntelbras.push({
  //                   ID: result.results[i].EventID,
  //                   Message: result.results[i].Message,
  //                   onu: result.results[i].Name,
  //                   time: `${("0" + result.results[i].DayTime).slice(-2)}/${(
  //                     "0" + result.results[i].MonthTime
  //                   ).slice(-2)}/${result.results[i].YearTime} ${(
  //                     "0" + result.results[i].HourTime
  //                   ).slice(-2)}:${("0" + result.results[i].MinuteTime).slice(
  //                     -2
  //                   )}`,
  //                 });
  //                 const forSetTimeout = {
  //                   title: result.results[i].NodeName.replace(/_/g, " "),
  //                   state: result.results[i].EventType == 11 ? true : false,
  //                   time: `${("0" + result.results[i].DayTime).slice(-2)}/${(
  //                     "0" + result.results[i].MonthTime
  //                   ).slice(-2)}/${result.results[i].YearTime} ${(
  //                     "0" + result.results[i].HourTime
  //                   ).slice(-2)}:${("0" + result.results[i].MinuteTime).slice(
  //                     -2
  //                   )}`,
  //                 };
  //                 if (forSetTimeout.state) {
  //                   set_time_out(
  //                     0x32cd32,
  //                     forSetTimeout.title,
  //                     "UP",
  //                     forSetTimeout.time
  //                   );
  //                 } else {
  //                   set_time_out(
  //                     0xff0000,
  //                     forSetTimeout.title,
  //                     "DOWN",
  //                     forSetTimeout.time
  //                   );
  //                 }
  //               } else {
  //                 console.log("não deu");
  //               }
  //               console.log(pon[3]);
  //             }
  //           );
  //         } else {
  //           return interaction.reply({ embeds: [events] });
  //         }
  //       }
  //     );
  //   }
});

const adicionar = () => {
  orion.query(
    {
      query: func.queryNode,
    },
    function (result) {
      let IDEvent = [];
      result.results.map((event) => {
        IDEvent.push(event.EventID);
      });

      setInterval(() => {
        orion.query(
          {
            query: func.queryNode,
          },
          async function (result) {
            try {
              let IDEventNew = [];
              result.results.map((event) => {
                IDEventNew.push(event.EventID);
              });
              for (let i = 0; i < result.results.length; i++) {
                const msg = hyperlink(
                  result.results[i].IPAddress,
                  `http://172.16.40.9${result.results[i].WebUri}`
                );
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
                        value: msg,
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
                  if (
                    (result.results[i].EventType == 10 &&
                      result.results[i].NodeID !=
                        result.results[i].NetObjectID) ||
                    (result.results[i].EventType == 11 &&
                      result.results[i].NodeID != result.results[i].NetObjectID)
                  ) {
                    console.log(
                      ` node: ${result.results[i].NodeID}  net: ${result.results[i].NetObjectID}`
                    );
                    orion.query(
                      {
                        query: func.queryInterface,
                        parameters: {
                          id: result.results[i].EventID,
                        },
                      },
                      async function (result) {
                        const pon = result.results[0].IfName.split("-");
                        console.log(pon);
                        if (pon[3] > 0) {
                          globalOltIntelbras.push({
                            Type: result.results[0].EventType,
                            ID: result.results[0].EventID,
                            Message: result.results[0].Message,
                            onu: result.results[0].Name,
                          });

                          const title = result.results[0].NodeName.replace(
                            /_/g,
                            " "
                          );
                          const state =
                            result.results[0].EventType == 11 ? true : false;
                          const time = `${(
                            "0" + result.results[0].DayTime
                          ).slice(-2)}/${(
                            "0" + result.results[0].MonthTime
                          ).slice(-2)}/${result.results[0].YearTime} ${(
                            "0" + result.results[0].HourTime
                          ).slice(-2)}:${(
                            "0" + result.results[0].MinuteTime
                          ).slice(-2)}`;

                          if (state) {
                            set_time_out(0x32cd32, title, "UP", time);
                          } else {
                            set_time_out(0xff0000, title, "DOWN", time);
                          }
                        } else {
                          const address = hyperlink(
                            result.results[0].IPAddress,
                            `http://172.16.40.9${result.results[0].IWebUri}`
                          );
                          const events = new EmbedBuilder()
                            .setColor(
                              result.results[0].EventType == 10
                                ? 0xff0000
                                : 0x32cd32
                            )
                            .setTitle(
                              result.results[0].NodeName.replace(/_/g, " ")
                            )
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
                              result.results[0].POP_ID ||
                                result.results[0].Location
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
                              text: `${("0" + result.results[0].DayTime).slice(
                                -2
                              )}/${("0" + result.results[0].MonthTime).slice(
                                -2
                              )}/${result.results[0].YearTime} ${(
                                "0" + result.results[0].HourTime
                              ).slice(-2)}:${(
                                "0" + result.results[0].MinuteTime
                              ).slice(-2)}`,
                            });
                          client.channels.cache
                            .get(`1021807249573806090`)
                            .send({ embeds: [events] });
                        }
                        console.log(pon[3]);
                      }
                    );
                  } else {
                    await client.channels.cache
                      .get(`1021807249573806090`)
                      .send({ embeds: [events] });
                    console.log(result.results[i].Message);
                  }
                } else {
                  console.log("repetido");
                }
              }
              IDEvent = IDEventNew;
              console.log(IDEventNew);
            } catch (err) {
              console.log(err);
            }
          }
        );
      }, 50000);
    }
  );
};
adicionar();
