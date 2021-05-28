const fs = require("fs");

module.exports = {
  async run(bot) {
    bot.on("/stopfeed", (msg) => {
      fs.readFile("./commands/id_db.json", (err, data) => {
        let chat_id = msg.chat.id;
        if (err) throw err;
        let db_parsed = JSON.parse(data);
        if (db_parsed.includes(chat_id)) {
          db_parsed.splice(db_parsed.indexOf(chat_id), 1);
          console.log("Removing... ", db_parsed);
          msg.reply.text("CVE Update feed stopped.");
          fs.writeFile(
            "./commands/id_db.json",
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
