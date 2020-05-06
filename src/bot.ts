import { Client } from 'discord.js';
import * as mongoose from 'mongoose';
import * as path from 'path';
import { CommandHandler } from './Handlers/commandHandler';
import { ErelaClient, Utils } from 'erela.js';

mongoose.connect(process.env.MONGOOSE_LOGIN, { useNewUrlParser: true, useUnifiedTopology: true });
const bot = new Client({ disableMentions: "everyone" });

let cmdHandler: CommandHandler = new CommandHandler(bot);
cmdHandler.load(path.join(__dirname, './Commands'));



bot.on('ready', () =>
{
    bot['music'] = new ErelaClient(bot, [
        {
            "host": "localhost",
            "port": 2000,
            "password": "youshallnotpass"
        }
    ])
        .on('nodeError', console.log)
        .on('nodeConnect', () => console.log("Connected to lavalink"))
        .on('queueEnd', player =>
        {
            player.textChannel.send("Queue has ended.");
            return bot['music'].players.destroy(player.guild.id);
        })
        .on('trackStart', ({ textChannel }, { title, duration }) =>
        {
            textChannel.send("Now playing: **" + title + "** | " + Utils.formatTime(duration, true));
        });

    let test: ErelaClient = bot['music'];

    console.log('Bot turned on!');
});

bot.login(process.env.TOKEN);