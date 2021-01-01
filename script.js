require('dotenv').config();
const Discord = require("discord.js");
const client = new Discord.Client();

const POLL_CHANNEL_ID = "794356261168087090";

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", (msg) => {
    if (msg.content === "!verify") {
        client.channels.cache.get(POLL_CHANNEL_ID).send(`${msg.author}`).then((message) => {
            message.react("👍");
            message.react("👎");
        });
    }
});

client.login(process.env.TOKEN);
