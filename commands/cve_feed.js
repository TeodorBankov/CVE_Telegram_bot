const fs = require("fs");
const axios = require("axios").default;
const ms = require("ms");
const resCmd = require("../index").resCmd;

module.exports = {
  async run(bot) {
    bot.on("/start_cve_feed", (msg) => {
      let chat_id = msg.chat.id;
      fs.readFile(resCmd("id_db.json"), (err, data) => {
        if (err) throw err;
        let db_parsed = JSON.parse(data);
        if (!db_parsed.includes(chat_id)) {
          db_parsed.push(chat_id);
          console.log("New chat added to feed!", chat_id);
          msg.reply.text(
            "Update feed to this chat started! You are now going to receive updates about the latest CVE Vulnerabilities!"
          );
          fs.writeFile(
            resCmd("id_db.json"),
            JSON.stringify(db_parsed),
            function (e) {
              if (e) throw e;
              console.log("DB File updated!");
            }
          );
        } else msg.reply.text("Chat update feed alredy started.");
      });
    });

    setInterval(async () => {
      const data = await getLastFeed();
      if (data == null) return;

      const ids = JSON.parse(fs.readFileSync(resCmd("id_db.json")));
      const msg_data = generateMessage(data);
      ids.forEach(async (chat) => {
        await bot.sendMessage(chat, msg_data, { parseMode: "HTML" }); //check here
      });
    }, ms("10s"));
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

  let out = `${b("Feed:")} ${"CVE (www.cve.circl.lu)"}\n\n`;
  out += `${b("Name:")} ${c(d.id)}\n\n`;
  out += `${b("Modified:")} ${c(new Date(d.Modified).toUTCString())}\n`;
  out += `${b("Published:")} ${c(new Date(d.Published).toUTCString())}\n\n`;

  if (d.access?.authentication)
    out += `${b("Authentication:")} ${c(d.access.authentication)}\n`;
  if (d.access?.complexity)
    out += `${b("Complexity:")} ${c(d.access.complexity)}\n`;
  if (d.access?.vector) out += `${b("Vector:")} ${c(d.access.vector)}\n`;

  if (d.assigner) out += `${b("Assigner:")} ${d.assigner}\n\n`;

  if (d.summary) out += `${b("Summary:")} ${d.summary}\n\n`;

  if (d.references && d.references.length > 0)
    out += `${b("Ref. Links:")}\n${d.references.join("\n").trim()}\n\n`;

  if (d.vulnerable_configuration && d.vulnerable_configuration.length > 0)
    out += `${b("Vulnerable Configuration(s):")}\n${c(
      d.vulnerable_configuration
        .map((v) => {
          return v
            .split(":")
            .slice(3)
            .filter((v) => v != "*")
            .join(" ");
        })
        .join("\n")
    ).trim()}\n`;
  if (d.vulnerable_product && d.vulnerable_product.length > 0)
    out += `${b("Vulnerable Product(s):")}\n${c(
      d.vulnerable_product
        .map((v) => {
          return v
            .split(":")
            .slice(3)
            .filter((v) => v != "*")
            .join(" ");
        })
        .join("\n")
    ).trim()}`;

  return out.trim();
}

/**
 * @returns {Promise<any>}
 */
async function getLastFeed() {
  const data = (await axios.get("https://cve.circl.lu/api/last/1")).data[0];

  let newTimestamp = new Date(data.Modified);
  let data_old = fs.readFileSync(resCmd("data_cve.txt")).toString();

  if (+newTimestamp != data_old) {
    fs.writeFileSync(resCmd("data_cve.txt"), +new Date(data.Modified) + "");
    return data;
  }
  return null;
}
