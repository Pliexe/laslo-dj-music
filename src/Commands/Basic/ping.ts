import { Message, Client } from 'discord.js';
import { Command } from '../../Handlers/Command';
import { CommandHandler } from '../../Handlers/commandHandler';

export = class extends Command
{
    private bot: Client;

    constructor(cmdHandler: CommandHandler)
    {
        super('ping', {
            aliases: ['pong'],
            info: 'Shows the latency of the bot',
            usage: 'ping'
        });

        this.bot = cmdHandler.client;
    }

    async run(message: Message)
    {
        const m = await message.channel.send("Ping!");
        m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(this.bot.ws.ping)}ms`);
    }
} 