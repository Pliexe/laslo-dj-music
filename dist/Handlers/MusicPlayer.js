"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const ytdl_core_discord_1 = __importDefault(require("ytdl-core-discord"));
const youtube_search_1 = __importDefault(require("youtube-search"));
class MusicPlayer {
    constructor(voiceChannel, textChannel, connection) {
        this.songQueue = [];
        this.voiceChannel = voiceChannel;
        this.textChannel = textChannel;
        this.connection = connection;
    }
    static search(term, message, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            if (term.length > 100)
                return callback("You may not provide longer than 100 character search term!", null);
            let results = yield youtube_search_1.default(term, { maxResults: 5, key: process.env.YOUTUBE_API_KEY, type: "video,playlist" });
            if (results.results.length <= 0)
                callback("Video or playlist not found.", null);
            let songs = [];
            results.results.forEach(result => {
                songs.push({
                    id: result.id,
                    title: result.title,
                    url: result.link
                });
            });
            if (results.results.length > 1) {
                let embed = new discord_js_1.MessageEmbed()
                    .setAuthor("Song selection")
                    .setDescription(results.results.map((song, i) => `**${i + 1}** ${song.title}`).join('\n'))
                    .setFooter("Your response time closes within the next 30 seconds. Type 'cancel' to cancel the selection!");
                yield message.channel.send(embed);
                const collector = message.channel.createMessageCollector(m => {
                    return m.author.id === message.author.id &&
                        new RegExp('^([1-5|cancel])$', "i").test(m.content);
                }, { time: 30000, max: 1 });
                collector.on('collect', m => {
                    if (/cancel/i.test(m.content))
                        return collector.stop("cancelled");
                    let index = Number(m.content - 1);
                    callback(null, {
                        id: results.results[index].id,
                        title: results.results[index].title,
                        url: results.results[index].link
                    });
                });
                collector.on("end", (_, reason) => {
                    if (["time", "cancelled"].includes(reason))
                        return message.channel.send("Cancelled selection.");
                    callback("1", null);
                });
            }
            else {
                callback(null, {
                    id: results.results[0].id,
                    title: results.results[0].title,
                    url: results.results[0].link
                });
            }
        });
    }
    addSong(song) {
        if (this.songQueue.length <= 0) {
            this.songQueue.push(song);
            this.play();
        }
        else {
            this.songQueue.push(song);
        }
    }
    play() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(this.songQueue);
            const dispatcher = this.connection.play(yield ytdl_core_discord_1.default(this.songQueue[0].url))
                .on('end', reason => {
                if (reason === 'Stream is not generating quickly enough.')
                    console.log('Song ended.');
                else
                    console.log(reason);
                this.songQueue.shift();
                this.play();
            })
                .on('error', error => console.error(error));
            dispatcher.setVolume(1);
            let embed = new discord_js_1.MessageEmbed()
                .setDescription("Playing song")
                .addField("Title", this.songQueue[0].title)
                .addField("link", this.songQueue[0].url);
            this.textChannel.send(embed);
        });
    }
}
exports.MusicPlayer = MusicPlayer;
//# sourceMappingURL=MusicPlayer.js.map