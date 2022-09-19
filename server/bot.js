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
const event = new EmbedBuilder()
  .setColor(0xff0000)
  .setTitle("teste")
  .setDescription("testando embed builder")
  .setTimestamp();

client.on("messageCreate", async (interaction) => {
  if (interaction.content == "Abgail, paga o salgadinho!!!") {
    const user = await client.users.fetch("997122144016281664");
    user.send("To esperando o salgadinho :rage:");
    interaction.reply("Ela foi avisada");
  }
  if (interaction.content === "top") {
    orion.query(
      {
        query: `
          SELECT TOP 10 
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
        console.log(result);
        try {
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
                value: result.results[0].IPAddress + "",
                inline: true,
              },
              result.results[0]?.Department
                ? {
                    name: "TIPO",
                    value: result.results[0].Department + "",
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
          interaction.reply({ embeds: [events] });
        } catch (err) {
          console.log(err);
        }
      }
    );
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
      console.log(IDEvent);
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
              for (let i = 0; i < result.results.length; i++) {
                if (!IDEvent.includes(result.results[i].EventID)) {
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
                    .get(`1017773873321754695`)
                    .send({ embeds: [events] });
                  // .send(
                  //   `${result.results[i].Message} \nData: ${(
                  //     "0" + result.results[i].DayTime
                  //   ).slice(-2)}/${("0" + result.results[i].MonthTime).slice(
                  //     -2
                  //   )}/${result.results[i].YearTime} ${(
                  //     "0" + result.results[i].HourTime
                  //   ).slice(-2)}:${("0" + result.results[i].MinuteTime).slice(
                  //     -2
                  //   )}:${("0" + result.results[i].SecondTime).slice(-2)}\n`
                  // );
                  IDEvent.unshift(result.results[i].EventID);
                  IDEvent.pop();
                  console.log(result.results[i].Message);
                } else {
                  console.log("repetido");
                }
              }
            } catch (err) {
              console.log(err);
            }
          }
        );
      }, 10000);
    }
  );
};
adicionar();
