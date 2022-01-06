const fs = require("fs");
const resCmd = require("../index").resCmd;

module.exports = {
  async run(bot) {
    bot.on("/stop_cve_feed", (msg) => {
      fs.readFile(resCmd("id_db.json"), (err, data) => {
        let chat_id = msg.chat.id;
        if (err) throw err;
        let db_parsed = JSON.parse(data);
        if (db_parsed.includes(chat_id)) {
          db_parsed.splice(db_parsed.indexOf(chat_id), 1);
          console.log("Removing... ", db_parsed);
          msg.reply.text("CVE Update feed stopped.");
          fs.writeFile(
            resCmd("id_db.json"),
            JSON.stringify(db_parsed),
            function (e) {
              if (e) throw e;
              console.log("DB File updated! (rm)");
            }
          );
        } else msg.reply.text("CVE Update feed alredy stopped.");
      });
    });
  },
};
