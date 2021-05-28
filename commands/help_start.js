module.exports = {
    async run (bot) {
        bot.on("/help", (msg) => {
            msg.reply.text("/start - Start the bot.\n/startcvefeed - Start the bot's feed updates, giving you the latest CVE Vulnerabilities\n/stopcvefeed - Stop the feed updates.\n/help - Display this message.")
        });
        bot.on("/start", (msg) => {
            msg.reply.text("Hello! 👋\n I am the CVE and Vulnerabilites main bot. I have many functionalities such as updating you about the latest CVEs and more! See all my commands with the /help command.");
        })
    }
}