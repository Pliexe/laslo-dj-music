import { Message } from 'discord.js';
import { MessageErrorSender } from '../../Utils/MessageError';
import { Command } from '../../Handlers/Command';
import { PrefixManager } from '../../Handlers/PrefixManager';

export = class extends Command
{
    private prefixManager: PrefixManager;

    constructor(commandHandler)
    {
        super('prefix', {
            aliases: ['setprefix'],
            info: 'Changed the prefix',
            usage: 'prefix <new prefix>'
        });

        this.prefixManager = commandHandler.prefixManager;
    }

    async run(message: Message, args: string[], errorMessage: MessageErrorSender)
    {
        if (message.guild.ownerID !== message.author.id) return errorMessage.noPermission();
        if (!args[0]) return errorMessage.syntaxErr(this.usage);

        let newPrefix: string = args[0];

        if (newPrefix.length > 4) return errorMessage.syntaxErr(this.usage, '<new prefix>', 'Prefix may not be longer than 4 characters!');

        let oldPrefix: string = await this.prefixManager.getPrefix(message.guild.id);

        if (oldPrefix == newPrefix) return errorMessage.syntaxErr(this.usage, '<new prefix>', 'Prefix is already this one.', true);

        this.prefixManager.setPrefix(message.guild.id, newPrefix);

        message.channel.send("Changed prefix to `" + newPrefix + "`!");
    }
} 