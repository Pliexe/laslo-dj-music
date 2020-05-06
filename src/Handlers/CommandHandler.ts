import { MessageEmbed, Client } from 'discord.js';
import * as fs from 'fs';
import * as path from 'path';

import { Command } from './command';
import { MessageErrorSender } from '../Utils/MessageError';
import { PrefixManager } from './PrefixManager';

export class CommandHandler
{
    public client: Client;
    public prefixManager: PrefixManager;

    private commands: Map<string, Command> = new Map();
    private aliases: Map<string, string> = new Map();

    constructor(client: Client)
    {
        this.client = client;

        this.prefixManager = new PrefixManager(this.client);
    }

    static readFiles(directory: string): string[]
    {
        let files: Array<any> = [];

        fs.readdirSync(directory).forEach(file =>
        {
            let location: string = path.join(directory, file);

            if (fs.lstatSync(location).isDirectory()) {
                files = files.concat(CommandHandler.readFiles(location));
            } else {
                files.push(location);
            }
        });

        return files;
    }

    public load(directory): void
    {
        let commands: any[], cmdLocations: string[];
        commands = cmdLocations = CommandHandler.readFiles(directory)
            .filter(file => file.endsWith('.js'));

        cmdLocations = cmdLocations.map(cmd => cmd.slice(cmd.indexOf('Commands') + 9));
        commands = commands.map(require);

        commands.forEach(command =>
        {
            this.loadCommand(new command(this), cmdLocations);
        });

        this.register();
    }

    private loadCommand(command: Command, cmdLocations): void
    {
        let location: string = cmdLocations.find(cl => cl.includes("\\" + command.name));
        command.category = location.slice(0, location.indexOf(command.name) - 1);

        this.commands.set(command.name, command);

        command.aliases.forEach(alias =>
        {
            this.aliases.set(alias, command.name);
        });
    }

    private register(): void
    {
        this.client.on('message', async message =>
        {
            let prefix = await this.prefixManager.getPrefix(message.guild.id);

            if (message.author.bot || !message.content.startsWith(prefix)) return;

            const [command, ...args] = message.content
                .slice(prefix.length)
                .split(/ +/g);

            let cmd = this.commands.get(command.toLowerCase());

            if (!cmd) {
                let cmdName = this.aliases.get(command.toLowerCase())
                cmd = this.commands.get(cmdName);;
            }

            if (!cmd)
                return;

            if (cmd.guildOnly && !message.guild) {
                message.channel.send('This command is only available in guilds');
                return;
            }

            try {
                await cmd.run(message, args, new MessageErrorSender(message));
            } catch (err) {
                console.error(err);
                message.reply('an error occured :C');
            }
        });
    }

}