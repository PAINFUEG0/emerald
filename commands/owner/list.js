/** @format */

const pagination = require("@utils/pagination.js");

module.exports = {
  name: "list",
  aliases: [],
  cooldown: "",
  category: "owner",
  usage: "<static>",
  description: "Add static",
  args: true,
  vote: false,
  admin: true,
  owner: true,
  botPerms: [],
  userPerms: [],
  execute: async (client, message, args) => {
    const static = args[0] ? args[0] : null;

    let db = null;

    switch (static) {
      case "np":
        db = "noPrefix";
        break;

      case "bl":
        db = "blacklist";
        break;

      case "premium":
        db = "premium";
        break;

      default:
        return await message.reply({
          embeds: [
            new client.embed().desc(
              `${client.emoji.no} **No valid static provided\n**` +
                `${client.emoji.bell} **Avaliable options :** \`np\`, \`bl\`, \`premium\``,
            ),
          ],
        });
    }

    let ids = await client[db].keys;
    if (!ids.length)
      return await message.reply({
        embeds: [
          new client.embed().desc(`${client.emoji.no}**No entries found !**`),
        ],
      });
    let names = [];
    for (id of ids) {
      id = id.split("_")[1];
      let user = await client.users.fetch(id).catch(
        async () =>
          await client.guilds.cache.get(id).catch(() => {
            name: id;
          }),
      );
      names.push(
        `** ${
          user.username
            ? `${client.emoji.user} [${user.username}`
            : `${client.emoji.hash} [${user.name.substring(0, 15)}`
        }](https://discord.com/users/${user.id}) [${user.id}]**`,
      );
    }
    const mapping = require("lodash").chunk(names, 10);
    const descriptions = mapping.map((s) => s.join("\n"));
    var pages = [];
    for (let i = 0; i < descriptions.length; i++) {
      const embed = new client.embed()
        .desc(
          `## ${db.charAt(0).toUpperCase() + db.slice(1)} list : \n\n${
            descriptions[i]
          }`,
        )
        .setFooter({ text: `Page • 1/${pages.length}` });
      pages.push(embed);
    }
    await pagination(client, message, pages);
  },
};
