import { VoiceChannel, TextChannel, VoiceConnection, Message, MessageEmbed } from "discord.js";
import ytdl from 'ytdl-core-discord';
import search from 'youtube-search';

export interface ISong
{
    id: string;
    title: string;
    url: string;
}

export class MusicPlayer
{
    private songQueue: ISong[] = [];
    public voiceChannel: VoiceChannel;
    public textChannel: TextChannel;
    public connection: VoiceConnection;

    constructor(voiceChannel: VoiceChannel, textChannel: TextChannel, connection: VoiceConnection)
    {
        this.voiceChannel = voiceChannel;
        this.textChannel = textChannel;
        this.connection = connection;
    }

    static async search(term: string, message: Message, callback: (reason: string, song: ISong) => void)
    {
        if (term.length > 100) return callback("You may not provide longer than 100 character search term!", null);
        let results = await search(term, { maxResults: 5, key: process.env.YOUTUBE_API_KEY, type: "video,playlist" });
        if (results.results.length <= 0) callback("Video or playlist not found.", null);
        let songs: ISong[] = [];
        results.results.forEach(result =>
        {
            songs.push({
                id: result.id,
                title: result.title,
                url: result.link
            });
        });

        if (results.results.length > 1) {
            let embed = new MessageEmbed()
                .setAuthor("Song selection")
                .setDescription(results.results.map((song, i) => `**${i + 1}** ${song.title}`).join('\n'))
                .setFooter("Your response time closes within the next 30 seconds. Type 'cancel' to cancel the selection!");

            await message.channel.send(embed);

            const collector = message.channel.createMessageCollector(m =>
            {
                return m.author.id === message.author.id &&
                    new RegExp('^([1-5|cancel])$', "i").test(m.content);
            }, { time: 30000, max: 1 });

            collector.on('collect', m =>
            {
                if (m.content.toLowerCase() === "cancel") return collector.stop("cancelled");
                let index = Number(m.content - 1);
                callback(null, {
                    id: results.results[index].id,
                    title: results.results[index].title,
                    url: results.results[index].link
                });
            });

            collector.on("end", (_, reason) =>
            {
                console.log(reason);
                if (["time", "cancelled"].includes(reason)) {
                    message.channel.send("Cancelled selection.");
                    callback("1", null);
                };

            });
        } else {
            callback(null, {
                id: results.results[0].id,
                title: results.results[0].title,
                url: results.results[0].link
            });
        }
    }

    addSong(song: ISong)
    {
        console.log("Adding song: ");
        if (this.songQueue.length <= 0) this.play(song);
        this.songQueue.push(song);
    }

    private async play(song: ISong)
    {
        console.log(song);
        const dispatcher = this.connection.play(await ytdl(song.url))
            .on('end', reason =>
            {
                if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
                else console.log(reason);
                this.songQueue.shift();
                this.play(this.songQueue[0]);
            })
            .on('error', error => console.error(error));

        dispatcher.setVolume(1);

        let embed = new MessageEmbed()
            .setDescription("Playing song")
            .addField("Title", song.title)
            .addField("link", song.url);

        this.textChannel.send(embed);
    }
}