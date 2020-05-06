import { Message } from 'discord.js';
import { MessageErrorSender } from '../Utils/MessageError';

interface options
{
    aliases?: Array<string>;
    info: string;
    usage: string;
    guildOnly?: boolean;
}

export class Command
{
    public category: string;
    public name: string;
    public aliases: Array<string>;
    public info: string;
    public usage: string;
    public guildOnly: boolean;

    constructor(name: string, options: options)
    {
        this.name = name;

        this.aliases = options.aliases || [];

        this.info = options.info;

        this.usage = options.usage;

        this.guildOnly = options.guildOnly || false;
    }

    run(message: Message, args?: string[], syntaxError?: MessageErrorSender): void
    {
        message.channel.send("Error: command not implemented.");
    }
}