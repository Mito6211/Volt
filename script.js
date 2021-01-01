require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/polls", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", (err) => console.error("DB_ERROR: " + err));

const PollSchema = mongoose.Schema({
    id: Number,
    expiration: Number,
    upvotes: Number,
    downvotes: Number,
});

const Poll = mongoose.model("Poll", PollSchema, "pollData");

const Discord = require("discord.js");
const client = new Discord.Client();

// enter ID of the discord channel you want the polls to occur
const POLL_CHANNEL_ID = "794356261168087090";
const MS_IN_A_DAY = 1000 * 60 * 60 * 24;
const MS_IN_15_MINUTES = 1000 * 60 * 15;

client.on("message", (msg) => {
    if (msg.content === "!verify") {
        client.channels.cache
            .get(POLL_CHANNEL_ID)
            .send(`${msg.author}`)
            .then((message) => {
                message.react("👍");
                message.react("👎");

                const newPoll = new Poll({
                    id: message.id,
                    expiration: new Date().getTime(),
                    upvotes: 0,
                    downvotes: 0,
                });

                newPoll.save((err, poll) => {
                    if (err) return console.error("SAVE_ERROR: " + err);
                    console.log(
                        "Poll with ID " +
                            poll.id +
                            " saved to pollData collection."
                    );
                });
            });
    }
});

setInterval(() => {
    (async () => {
        const data = await Poll.find();
        data.forEach((pollEntry) => {
            if (new Date().getTime() >= pollEntry.expiration) {
                console.log(
                    "Poll with ID " + pollEntry.id + " is past expiration"
                );
            }
        });
    })();
}, MS_IN_15_MINUTES);

client.login(process.env.TOKEN);
