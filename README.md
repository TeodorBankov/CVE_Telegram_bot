# CVE_Telegram_bot
[Official Telegram's bot channel](https://t.me/cve_latest_info)

![icon](./icon.jpg)

## Description and what does it do

This telegram bot uses the Telebot JS Library  to connect the code with Telegram api. It can:
1. Send you the Latest CVE updates in real time
2. Lookup any CVE you want (To be added soon)
3. More functionalities to be added soon

## Installation

To install and run CVE_Telegram_bot, you must firstly create a bot from Botfather in Telegram and aquire the token, then:

```bash
sudo apt install node && npm
cd CVE_Telegram_bot
npm i 
```

In the index.js file, you must replace the 
```javascript
const bot = new telebot(process.env.TOKEN);
```
 with your token

```javascript
const bot = new telebot(INSERT YOUR BOT TOKEN HERE);
```

## Run

Command for running the bot:

```bash
cd CVE_Telegram_bot
node .
```

### Soon™️
Soon, I will make a guide on how to make the bot a process, and it being started on startup as a background process. 


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License 
MIT
