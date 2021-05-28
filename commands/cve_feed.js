const fs = require("fs");
const axios = require("axios").default;
const ms = require("ms");

module.exports = {
  async run(bot) {
    bot.on("/startcvefeed", (msg) => {
      let chat_id = msg.chat.id;
      fs.readFile("./commands/id_db.json", (err, data) => {
        if (err) throw err;
        let db_parsed = JSON.parse(data);
        if (!db_parsed.includes(chat_id)) {
          db_parsed.push(chat_id);
          console.log("New chat added to feed!", chat_id);
          msg.reply.text("Update feed to this chat started! You are now going to receive updates about the latest CVE Vulnerabilities!");
          fs.writeFile(
            "./commands/id_db.json",
            JSON.stringify(db_parsed),
            function (e) {
              if (e) throw e;
              console.log("DB File updated!");
            }
          );
        } else msg.reply.text("Chat update feed alredy started.")
      });
    });

    setInterval(async () => {
      const data = await getLastFeed();
      if (data == null) return;

      const ids = JSON.parse(fs.readFileSync("./commands/id_db.json")); 
      const msg_data = generateMessage(data);
      ids.forEach(async (chat) => {
        await bot.sendMessage(chat, msg_data, {parseMode: "HTML"}); //check here
      });
    }, ms("30s"));
  },
};

/**
 * Generate message from cve data
 * @param {Object} d cve data
 * @returns {String} message
 */
function generateMessage(d) {
  const b = (text) => `<b>${text}</b>`;
  const c = (text) => `<code>${text}</code>`;

  let out = `${b("Name:")} ${c(d.id)}\n\n`;
  out += `${b("Modified:")} ${c(new Date(d.Modified).toUTCString())}\n`;
  out += `${b("Published:")} ${c(new Date(d.Published))}\n\n`;
  
  if (d.access.authentication) out += `${b("Authentication:")} ${c(d.access.authentication)}\n`;
  if (d.access.complexity) out += `${b("Complexity:")} ${c(d.access.complexity)}\n`;
  if (d.access.vector) out += `${b("Vector:")} ${c(d.access)}\n`;

  out += `${b("Assigner:")} ${d.assigner}\n\n`;

  out += `${b("Summary:")} ${d.summary}\n\n`;

  out += `${b("Ref. Links:")}\n${d.references.join("\n").trim()}`;
  
  return out;
}

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
