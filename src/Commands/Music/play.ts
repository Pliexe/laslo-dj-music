import { Message, Client, MessageEmbed } from 'discord.js';
import { Command } from '../../Handlers/Command';
import { MessageErrorSender } from '../../Utils/MessageError';
import { Player, ErelaClient, Utils, Track } from 'erela.js';

export = class extends Command
{
    private client: Client;

    constructor(commandHandler)
    {
        super('play', {
            aliases: [],
            info: 'Play music',
            usage: 'play <youtube titile/url>'
        });

        this.client = commandHandler.client;
    }
    async run(message: Message, args: string[], errorMessage: MessageErrorSender)
    {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.channel.send("You need to be in voice channel to play music!");

        let permissions = voiceChannel.permissionsFor(this.client.user)
        if (!permissions.has("CONNECT")) return errorMessage.feedback(this.usage, "I cannot connect to your voice channel.Insufficient permissions");
        if (!permissions.has("SPEAK")) return errorMessage.feedback(this.usage, "I cannot connect to your voice channel.Insufficient permissions");

        if (!args[0]) return errorMessage.syntaxErr(this.usage, '<youtube titile/url>', "Please provide song name or link to search for.");

        const musicClient: ErelaClient = this.client['music'];

        const player: Player = musicClient.players.spawn({
            guild: message.guild,
            textChannel: message.channel,
            voiceChannel
        });

        musicClient.search(args.join(' '), message.author).then(async res =>
        {
            switch (res.loadType) {
                case "TRACK_LOADED":
                    player.queue.add(res.tracks[0]);
                    message.channel.send(`Enqueuing \`${res.tracks[0].title} \` ${Utils.formatTime(res.tracks[0].duration, true)}`);
                    if (!player.playing) player.play();
                    break;
                case "SEARCH_RESULT":
                    const tracks = res.tracks.slice(0, 5);
                    const embed = new MessageEmbed()
                        .setAuthor("Song selection", message.author.avatarURL())
                        .setDescription(tracks.map((video, index) => `**${index + 1}** ${video.title}`))
                        .setFooter("Your response time closes within the next 30 seconds. Type 'cancel' to cancel the selection!");

                    await message.channel.send(embed);

                    const collector = message.channel.createMessageCollector(m =>
                    {
                        return m.author.id === message.author.id &&
                            new RegExp('^([1-5|cancel])$', "i").test(m.content);
                    }, { time: 30000, max: 1 });

                    collector.on('collect', m =>
                    {
                        if (/cancel/i.test(m.content)) return collector.stop("cancelled");

                        const track = tracks[Number(m.content - 1)];
                        player.queue.add(track);
                        message.channel.send(`Enqueuing \`${track.title} \` ${Utils.formatTime(track.duration, true)}`);
                        if (!player.playing) player.play();
                    });

                    collector.on("end", (_, reason) =>
                    {
                        if (["time", "cancelled"].includes(reason)) return message.channel.send("Cancelled selection.");
                    });
                    break;
                case "PLAYLIST_LOADED":
                    player.queue.add(res.playlist.tracks);

                    const duration = Utils.formatTime(res.playlist.tracks.reduce((acc, curr) => acc += curr.duration, 0), true);
                    message.channel.send(`Enqueuing \`${res.playlist.tracks.length} tracks \` | ${duration} time | playlist name: ${res.playlist.info.name}`);
                    if (!player.playing) player.play();
                    break;
            }
        });

    }
} 