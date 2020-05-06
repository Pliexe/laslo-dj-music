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
const Command_1 = require("../../Handlers/Command");
const MusicPlayer_1 = require("../../Handlers/MusicPlayer");
module.exports = class extends Command_1.Command {
    constructor(commandHandler) {
        super('play', {
            aliases: [],
            info: 'Play music',
            usage: 'play <youtube title/url>',
            guildOnly: true
        });
        this.client = commandHandler.client;
    }
    run(message, args, errorMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!args[0])
                return errorMessage.syntaxErr(this.usage);
            let voice = message.member.voice;
            if (!voice.channel)
                return message.channel.send('I\'m sorry but you need to be in a voice channel to play music!');
            const permissions = voice.channel.permissionsFor(message.client.user);
            if (!permissions.has('CONNECT'))
                return message.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
            if (!permissions.has('SPEAK'))
                return message.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');
            MusicPlayer_1.MusicPlayer.search(args.join(' '), message, (NF, song) => __awaiter(this, void 0, void 0, function* () {
                if (NF || NF == "1")
                    if (NF != "1")
                        return errorMessage.syntaxErr(this.usage, '<youtube title/url>', NF);
                let player = this.client.queue.get(message.guild.id);
                if (!player) {
                    let connection = yield voice.channel.join();
                    player = new MusicPlayer_1.MusicPlayer(voice.channel, message.channel, connection);
                    this.client.queue.set(message.guild.id, player);
                }
                else if (player.connection.status !== 0) {
                    let connection = yield voice.channel.join();
                    player = new MusicPlayer_1.MusicPlayer(voice.channel, message.channel, connection);
                    this.client.queue.set(message.guild.id, player);
                }
                try {
                    player.addSong(song);
                }
                catch (err) {
                    console.log(err);
                    message.channel.send("Something went wrong while playing. :(");
                    player.voiceChannel.leave();
                }
            }));
        });
    }
};
//# sourceMappingURL=play.js.map