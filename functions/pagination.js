/** @format */

const { ActionRowBuilder } = require("discord.js");

module.exports = async (client, message, pages) => {
  let page = 0;
  const row = new ActionRowBuilder().addComponents(
    new client.button().secondary(`back`, `Back`),
    new client.button().secondary(`home`, `Home`),
    new client.button().secondary(`next`, `Next`),
    new client.button().secondary(`end`, `❌`),
  );

  const curPage = await message.channel.send({
    embeds: [
      pages[page].setFooter({
        text: `Page [${page + 1}/${pages.length}] By ━● 1sT-Services`,
      }),
    ],
    components: [row],
  });

  const filter = (m) => m.user.id === message.author.id;
  const collector = curPage?.createMessageComponentCollector({
    filter,
    time: 30000,
  });

  collector.on("collect", async (i) => {
    await i.deferUpdate();

    switch (i.customId) {
      case "home":
        page = 0;
        await curPage
          .edit({
            embeds: [
              pages[page].setFooter({
                text: `Page [${page + 1}/${pages.length}] By ━● 1sT-Services`,
              }),
            ],
          })
          .catch(() => {});
        break;

      case "back":
        page = page > 0 ? --page : pages.length - 1;
        await curPage
          .edit({
            embeds: [
              pages[page].setFooter({
                text: `Page [${page + 1}/${pages.length}] By ━● 1sT-Services`,
              }),
            ],
          })
          .catch(() => {});
        break;

      case "next":
        page = page + 1 < pages.length ? ++page : 0;
        await curPage
          .edit({
            embeds: [
              pages[page].setFooter({
                text: `Page [${page + 1}/${pages.length}] By ━● 1sT-Services`,
              }),
            ],
          })
          .catch(() => {});
        break;

      case "end":
        await collector.stop();
        break;
    }
  });

  collector.on("end", () => {
    curPage
      .edit({
        embeds: [
          pages[page].setFooter({
            text: `Powered by • 1sT-Services | Page • ${page + 1}/${
              pages.length
            }`,
          }),
        ],
        components: [],
      })
      .catch(() => {});
  });
};
