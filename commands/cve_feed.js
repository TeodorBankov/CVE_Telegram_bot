const fs = require("fs");
const axios = require("axios").default;
const ms = require("ms");

module.exports = {
  async run(bot) {
    bot.on("/start_feed", (msg) => {
      let chat_id = msg.chat.id;
      fs.readFile("./commands/id_db.json", (err, data) => {
        if (err) throw err;
        let db_parsed = JSON.parse(data);
        if (!db_parsed.includes(chat_id)) {
          db_parsed.push(chat_id);
          console.log("New chat added to feed!", chat_id);
          fs.writeFile(
            "./commands/id_db.json",
            JSON.stringify(db_parsed),
            function (e) {
              if (e) throw e;
              console.log("DB File updated!");
            }
          );
        }
      });
    });

    setInterval(async () => {
      const data = await getLastFeed();
      if (data == null) return;

      const ids = JSON.parse(fs.readFileSync("./commands/id_db.json")); 
      const msg_data = `<b>Name:</b> ${data.id}\n \n<b>Modified:</b> ${new Date(data.Modified).toUTCString()}\n<b>Published:</b> ${new Date(data.Published).toUTCString()}\n \n<b>Authentication:</b> <code>${data.access.authentication}</code>\n<b>Complexity:</b> <code>${data.access.complexity}</code>\n<b>Vector:</b> <code>${data.access.vector}</code>\n<b>Assigner:</b> ${data.assigner}\n \n<b>Summary:</b> ${data.summary}\n \n<b>Ref. Links:</b>\n${data.references.join("\n")}`.trim();
      ids.forEach(async (chat) => {
        await bot.sendMessage(chat, msg_data, {parseMode: "HTML"}); //check here
      });
    }, ms("30s"));
  },
};

/** 
 * @returns {Promise<any>}
 */
async function getLastFeed() {
  const data = (await axios.get("https://cve.circl.lu/api/last/1")).data[0];

  let newTimestamp = new Date(data.Modified);
  let data_old = fs.readFileSync("./commands/data.txt").toString();
  let oldTimestamp = new Date(data_old);

  if (newTimestamp > oldTimestamp) {
    fs.writeFileSync("./commands/data.txt", data.Modified);
    return data;
  }
  return null;
}
