import mongoose from 'mongoose';
import * as path from 'path';
import { CommandHandler } from './Handlers/commandHandler';
import { MusicClient } from './Struct/Client';

mongoose.connect(process.env.MONGOOSE_LOGIN, { useNewUrlParser: true, useUnifiedTopology: true });
const bot = new MusicClient({ disableMentions: "everyone" });

let cmdHandler: CommandHandler = new CommandHandler(bot);
cmdHandler.load(path.join(__dirname, './Commands'));

bot.on('ready', () =>
{
    console.log('Bot turned on!');
});

bot.login(process.env.TOKEN);