require("dotenv").config();
const fs = require("fs");
const telebot = require("telebot");
const bot = new telebot({
  token: process.env.TOKEN,
});
bot.sendMessage();
fs.readdir("commands", (_, files) => {
  let commandFiles = files.filter((f) => f.endsWith(".js"));
  commandFiles.forEach((commandFile) => {
    let command = require(__dirname + "/commands/" + commandFile);
    try {
      command.run(bot);
    } catch (e) {
      console.error(e);
    }
  });
});

try {
  if (fs.existsSync("./commands/id_db.json")) {
    console.log("DB file alredy created.");
  } else {
    fs.writeFile("./commands/id_db.json", "[]", function (err) {
      if (err) throw err;
      console.log("DB File created!");
    });
  }
} catch (err) {
  console.error(err);
}

try {
  if (fs.existsSync("./commands/xdb_id.json")) {
    console.log("XDB file alredy created.");
  } else {
    fs.writeFile("./commands/xdb_id.json", "[]", function (err) {
      if (err) throw err;
      console.log("XDB File created!");
    });
  }
} catch (err) {
  console.error(err);
}
//THIS NEEDS TO BE MADE AS XDB_ID.JSON!

try {
  if (fs.existsSync("./commands/data_cve.txt")) {
    console.log("Data check file alredy exists.");
  } else {
    fs.writeFile("./commands/data_cve.txt", "0", function (err) {
      if (err) throw err;
      console.log("Data check File created!");
    });
  }
} catch (err) {
  console.error(err);
}

try {
  if (fs.existsSync("./commands/data_xdb.txt")) {
    console.log("Data check file alredy exists.");
  } else {
    fs.writeFile("./commands/data_xdb.txt", "0", function (err) {
      if (err) throw err;
      console.log("Xdb data check File created!");
    });
  }
} catch (err) {
  console.error(err);
}


bot.start();
