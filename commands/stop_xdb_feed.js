const fs = require("fs");
const resCmd = require("../index").resCmd;

module.exports = {
  async run(bot) {
    bot.on("/stop_exploitdb_feed", (msg) => {
      fs.readFile(resCmd("xdb_id.json"), (err, data) => {
        let chat_id = msg.chat.id;
        if (err) throw err;
        let db_parsed = JSON.parse(data);
        if (db_parsed.includes(chat_id)) {
          db_parsed.splice(db_parsed.indexOf(chat_id), 1);
          console.log("Removing... ", db_parsed);
          msg.reply.text("ExploitDB Update feed stopped.");
          fs.writeFile(
            resCmd("xdb_id.json"),
            JSON.stringify(db_parsed),
            function (e) {
              if (e) throw e;
              console.log("DB File updated! (rm)");
            }
          );
        } else msg.reply.text("ExploitDB Update feed alredy stopped.");
      });
    });
  },
};
