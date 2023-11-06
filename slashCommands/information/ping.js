/** @format */

const { AttachmentBuilder } = require("discord.js");
const { ChartJSNodeCanvas } = require("chartjs-node-canvas");

module.exports = {
  name: ["ping"],
  description: "Shows bot's ping",
  cooldown: "",
  category: "information",
  vote: false,
  admin: false,
  owner: false,
  botPerms: [],
  userPerms: [],

  execute: async (client, interaction) => {
    await interaction.deferReply({ ephemeral: false })

    let emb = new client.embed().desc(
      `${client.emoji.cool} **| Getting data. Please wait . . .**`,
    );

    const width = 800;
    const height = 250;
    const backgroundColour = "white";
    const chartJSNodeCanvas = new ChartJSNodeCanvas({
      width,
      height,
      backgroundColour,
    });

    const gen = (wsl, msg) => {
      let rnd = Math.random();
      wsl = parseInt(
        wsl + Math.floor(rnd * (-wsl * 0.1 - wsl * 0.1)) + wsl * 0.1,
      );
      msg = parseInt(
        msg + Math.floor(rnd * (-msg * 0.1 - msg * 0.1)) + msg * 0.1,
      );
      return [wsl, msg];
    };

    await interaction.editReply({ embeds: [emb] }).then(async (m) => {
      let josh = async () => {
        const start = performance.now();
        await client.noPrefix.set("test", true);
        const write = performance.now();
        await client.noPrefix.get("test");
        const read = performance.now();
        await client.noPrefix.delete("test");
        const del = performance.now();
        return [
          (del - start).toFixed(2),
          (write - start).toFixed(2),
          (read - write).toFixed(2),
          (del - read).toFixed(2),
        ];
      };
      const ws = client.ws.ping;
      const msg = m.createdAt - message.createdAt;

      let data = [];
      for (i = 0; i < 6; i++) {
        data.push(gen(ws, msg));
      }
      data.push([ws, msg]);
      const configuration = {
        type: "line",
        data: {
          labels: [" ", " ", " ", "Time ->", " ", " ", " "],
          datasets: [
            {
              label: "ws",
              data: [
                data[0][0],
                data[1][0],
                data[2][0],
                data[3][0],
                data[4][0],
                data[5][0],
                data[6][0],
              ],
              fill: true,
              borderColor:
                ws > 100
                  ? ws < 150
                    ? "rgb(250, 200, 0)"
                    : "rgb(250, 50, 0)"
                  : "rgb(50, 250, 0)",
              borderWidth: 1,
            },
            {
              label: "message",
              data: [
                data[0][1],
                data[1][1],
                data[2][1],
                data[3][1],
                data[4][1],
                data[5][1],
                data[6][1],
              ],
              fill: true,
              borderColor:
                msg > 250
                  ? msg < 350
                    ? "rgb(250, 200, 0)"
                    : "rgb(250, 50, 0)"
                  : "rgb(50, 250, 0)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              suggestedMin: 0,
            },
          },
        },
      };

      const image = await chartJSNodeCanvas.renderToBuffer(configuration);
      const attachment = new AttachmentBuilder(image, { name: "chart.png" });
      const dbData = await josh();
      const PingEmbed = new client.embed()
        .desc(
          `${client.emoji.json} -  **DB Readㅤ : **\`${dbData[2]} ms\`\n` +
            `${client.emoji.json} -  **DB Writeㅤ : **\`${dbData[1]} ms\`\n` +
            `${client.emoji.json} -  **DB Deleteㅤ : **\`${dbData[3]} ms\`\n` +
            `${client.emoji.json} - **DB Totalㅤ : **\`${dbData[0]} ms\`\n` +
            `${client.emoji.cloud} - **WS Latencyㅤ: **\`${ws} ms\`\n` +
            `${client.emoji.message} - **MSG Latency : **\`${msg} ms\`\n`,
        )
        .thumb(client.user.displayAvatarURL())
        .img(`attachment://${attachment.name}`)
        .setFooter({ text: "By ━● 1sT-Services | Fast as Fuck boi" });
      await m
        .edit({ embeds: [PingEmbed], files: [attachment] })
        .catch(() => {});
    });
  },
};