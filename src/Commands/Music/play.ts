import { Message, MessageEmbed, TextChannel, SystemChannelFlags, MessageCollector } from 'discord.js';
import { Command } from '../../Handlers/Command';
import { MessageErrorSender } from '../../Utils/MessageError';
import { MusicPlayer, ISong } from '../../Handlers/MusicPlayer';
import { MusicClient } from '../../Struct/Client';

export = class extends Command
{
    private client: MusicClient;

    constructor(commandHandler)
    {
        super('play', {
            aliases: [],
            info: 'Play music',
            usage: 'play <youtube title/url>',
            guildOnly: true
        });

        this.client = commandHandler.client;
    }
    async run(message: Message, args: string[], errorMessage: MessageErrorSender)
    {
        if (!args[0]) return errorMessage.syntaxErr(this.usage);
        let voice = message.member.voice;
        if (!voice.channel) return message.channel.send('I\'m sorry but you need to be in a voice channel to play music!');
        const permissions = voice.channel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT')) return message.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
        if (!permissions.has('SPEAK')) return message.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');

        MusicPlayer.search(args.join(' '), message, async (NF: string, song: ISong) =>
        {
            if (NF)
                if (NF != "1")
                    return errorMessage.syntaxErr(this.usage, '<youtube title/url>', NF);

            let player: MusicPlayer = this.client.queue.get(message.guild.id)

            if (!player) {
                let connection = await voice.channel.join();

                player = new MusicPlayer(voice.channel, <TextChannel>message.channel, connection);

                this.client.queue.set(message.guild.id, player);
            }
            else if (player.connection.status !== 0) {
                let connection = await voice.channel.join();

                player = new MusicPlayer(voice.channel, <TextChannel>message.channel, connection);

                this.client.queue.set(message.guild.id, player);
            }

            try {
                player.addSong(song);
            } catch (err) {
                console.log(err);
                message.channel.send("Something went wrong while playing. :(");
                player.voiceChannel.leave();
            }
        });
    }
} 